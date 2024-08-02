/**
 * This code is executed when the DOM content has finished loading. It selects various DOM elements by their IDs
 * and logs a message to the console.
 *
 * The selected elements include:
 * - `chatList`: An element that will display the list of chats.
 * - `messagesDiv`: An element that will display the messages for a selected chat.
 * - `messageInput`: An input field where the user can enter a new message.
 * - `sendMessageBtn`: A button that the user can click to send a new message.
 * - `createChatBtn`: A button that the user can click to create a new chat.
 */
document.addEventListener('DOMContentLoaded', function () {
	const chatList = document.getElementById('chat-list');
	const messagesDiv = document.getElementById('messages');
	const messageInput = document.getElementById('message-input');
	const sendMessageBtn = document.getElementById('send-message-btn');
	const createChatBtn = document.getElementById('create-new-chat');
	const sidebar = document.getElementById('sidebar');
	const toggleSidebarBtn = document.getElementById('toggle-sidebar');
	const toggleThemeBtn = document.getElementById('toggle-theme');
	const toggleThemeLabel = document.getElementById('toggle-theme-label');

	/**
	 * Toggles the light/dark mode theme of the application when the theme toggle button is clicked.
	 *
	 * This function adds or removes the 'light-mode' class from the root HTML element, which switches the application
	 * between a light and dark theme. It also updates the text content of the theme toggle label to reflect the
	 * current theme.
	 */
	toggleThemeBtn.addEventListener('click', function () {
		document.documentElement.classList.toggle('light-mode');

		if (document.documentElement.classList.contains('light-mode')) {
			toggleThemeLabel.textContent = 'Dark Mode';
		} else {
			toggleThemeLabel.textContent = 'Light Mode';
		}
	});

	/**
	 * Toggles the 'open' class on the sidebar element when the toggle button is clicked.
	 * This function is used to show or hide the sidebar based on user interaction.
	 */
	toggleSidebarBtn.addEventListener('click', function () {
		sidebar.classList.toggle('open');
	});

	/**
	 * Listens for click events on the document and toggles the 'open' class on the sidebar element if the click was
	 * outside the sidebar and the toggle button.
	 *
	 * This function is used to close the sidebar when the user clicks outside of it, ensuring the sidebar is only visible
	 * when the user intends to interact with it.
	 */
	document.addEventListener('click', function (event) {
		const isClickInsideSidebar = sidebar.contains(event.target);
		const isClickOnToggleButton = toggleSidebarBtn.contains(event.target);

		if (
			!isClickInsideSidebar &&
			!isClickOnToggleButton &&
			sidebar.classList.contains('open')
		) {
			sidebar.classList.remove('open');
		}
	});

	/**
	 * Automatically adjusts the height of the message input field to fit the content.
	 *
	 * This function is called whenever the user types into the message input field. It adjusts the height
	 * of the input field based on its content, with a maximum height limit.
	 */
	messageInput.addEventListener('input', function () {
		this.style.height = 'auto';
		const newHeight = Math.min(
			this.scrollHeight,
			window.innerHeight * 0.35
		);
		this.style.height = newHeight + 'px';
	});

	/**
	 * Formats a string containing code blocks and inline code by applying syntax highlighting.
	 *
	 * This function takes a string that may contain code blocks (delimited by triple backticks) and inline code
	 * (delimited by single backticks), and applies syntax highlighting to the code using the Prism.js library.
	 *
	 * @param {string} inputString - The input string to be formatted.
	 * @returns {string} The formatted string with syntax-highlighted code blocks and inline code.
	 */
	function formatCodeBlocks(inputString) {
		if (!inputString) return '';

		// Highlight code blocks
		let formattedString = inputString.replace(
			/```(\w+)?\n([\s\S]*?)```/gm,
			function (match, lang, code) {
				try {
					const highlightedCode =
						lang && Prism.languages[lang]
							? Prism.highlight(code, Prism.languages[lang], lang)
							: Prism.highlight(
									code,
									Prism.languages.plain,
									'plain'
							  );
					return `<pre style="margin: 1.5rem"><code class="language-${
						lang || 'plain'
					}">${highlightedCode}</code></pre>`;
				} catch (error) {
					console.error('Error highlighting code:', error);
					return `<pre><code class="language-${
						lang || 'plain'
					}">${code}</code></pre>`;
				}
			}
		);

		// Highlight inline code blocks
		formattedString = formattedString.replace(
			/`([^`]+)`/gm,
			'<code>$1</code>'
		);
		return formattedString;
	}

	/**
	 * Scrolls an element to the bottom of its content.
	 *
	 * @param {HTMLElement} element - The element to scroll to the bottom.
	 */
	function scrollToBottom(element) {
		element.scrollTop = element.scrollHeight;
	}

	/**
	 * Fetches the list of chats for the current user and displays them in the chat list.
	 *
	 * This function makes a request to the `/user/chats` endpoint to retrieve the list of chats for the
	 * current user. It then sorts the chats by their ID in descending order and renders them in the
	 * `chatList` element. If there are no chats available, the function clears the `messagesDiv`
	 * element.
	 *
	 * After rendering the chat list, the function calls the `addChatClickHandlers` function to add
	 * click event handlers to the chat items. If there are any chats available, the function also
	 * selects the first chat item and calls the `fetchChatHistory` function to display the chat
	 * history for the first chat.
	 */
	function fetchChats() {
		fetch('/user/chats')
			.then((response) => response.json())
			.then((data) => {
				if (data.chats && Array.isArray(data.chats)) {
					const sortedChats = data.chats.sort((a, b) => b.id - a.id);
					chatList.innerHTML = sortedChats
						.map(
							(chat) =>
								`<li data-chat-id="${chat.id}">
									<a style="margin-right: 2.5rem;">${chat.title}</a>
									<a onclick="submitDeleteForm('${chat.id}')">X</a>
								</li>`
						)
						.join('');
					addChatClickHandlers();
					if (sortedChats.length > 0) {
						const firstChatId = sortedChats[0].id;
						const firstChatItem = chatList.querySelector(
							`li[data-chat-id="${firstChatId}"]`
						);
						firstChatItem.classList.add('selected');
						fetchChatHistory(sortedChats[0].id);
					} else {
						messagesDiv.innerHTML = ''; // Clear messages if no chats are available
					}
				}
			})
			.catch((error) => {
				console.error('Error fetching chats:', error);
			});
	}

	/**
	 * Fetches the chat history for the specified chat ID and displays the messages in the UI.
	 *
	 * This function makes a request to the `/chat/{chatId}` endpoint to retrieve the chat history for the
	 * specified chat ID. It then calls the `displayMessages` function to render the messages in the
	 * `messagesDiv` element. If there are no messages available, the function clears the `messagesDiv`
	 * element.
	 *
	 * @param {string} chatId - The ID of the chat to fetch the history for.
	 */
	function fetchChatHistory(chatId) {
		fetch(`/chat/${chatId}`)
			.then((response) => response.json())
			.then((data) => {
				if (data.messages && Array.isArray(data.messages)) {
					displayMessages(data.messages);
					scrollToBottom(messagesDiv);
				} else {
					messagesDiv.innerHTML = ''; // Clear messages if no messages are available
				}
			})
			.catch((error) => {
				console.error('Error fetching chat history:', error);
			});
	}

	/**
	 * Adds click event handlers to the chat items in the chat list.
	 *
	 * This function selects all the `li` elements in the `chatList` element, and attaches a click event
	 * handler to each one. When a chat item is clicked, the function removes the 'selected' class from all other
	 * chat items, adds the 'selected' class to the clicked item, retrieves the chat ID from the item's
	 * `data-chat-id` attribute, and calls the `fetchChatHistory` function with the retrieved chat ID to fetch
	 * and display the chat history.
	 */
	function addChatClickHandlers() {
		const chatItems = chatList.querySelectorAll('li');
		chatItems.forEach((item) => {
			item.addEventListener('click', function () {
				chatItems.forEach((chat) => chat.classList.remove('selected'));
				this.classList.add('selected');
				const chatId = this.getAttribute('data-chat-id');
				fetchChatHistory(chatId);
			});
		});
	}

	/**
	 * Displays a list of chat messages in the UI.
	 *
	 * This function takes an array of chat messages and renders them in the `messagesDiv` element.
	 * Each message is displayed with a sender label (either "AI:" or "You:") and the message content.
	 * The messages are styled with a border, margin, padding, and border radius. AI messages are
	 * displayed with a light gray background and aligned to the right, while user messages are aligned
	 * to the left.
	 *
	 * @param {Object[]} messages - An array of chat message objects, where each object has a `messageType`
	 * property (either "AI" or "User") and a `message` property containing the message text.
	 */
	function displayMessages(messages) {
		messagesDiv.innerHTML = '';
		messages.forEach((message) => {
			const messageElement = document.createElement('p');
			messageElement.className = `message-content ${
				message.messageType === 'AI' ? 'ai-message' : 'user-message'
			}`;

			// set standard message element styles
			// messageElement.style.border = '1px solid #333';
			messageElement.style.marginBottom = '4rem';
			messageElement.style.padding = '2rem';
			messageElement.style.borderRadius = '0.35rem';
			messageElement.className = 'user-message';

			// set AI and User specific styles
			if (message.messageType === 'AI') {
				// messageElement.style.backgroundColor = '#e0e4e7';
				// messageElement.style.marginRight = '10rem';
				messageElement.className = 'ai-message';
			} else {
				// messageElement.style.backgroundColor = '#fafafa';
				// messageElement.style.marginLeft = '10rem';
			}

			const messageContent = document.createElement('span');
			messageContent.innerHTML = formatCodeBlocks(message.message);
			messageElement.appendChild(messageContent);

			messagesDiv.appendChild(messageElement);
		});
		try {
			Prism.highlightAll();
		} catch (error) {
			console.error('Error applying Prism highlighting:', error);
		}
		scrollToBottom(messagesDiv);
	}

	/**
	 * Sends a message to the currently selected chat.
	 *
	 * This function retrieves the currently selected chat ID from the UI, gets the message text from the
	 * input field, and sends the message to the server. It then optimistically adds the user's message
	 * to the chat UI, clears the input field, and updates the chat history with the server's response.
	 *
	 * @param {void} - This function takes no parameters.
	 * @returns {void} - This function does not return anything.
	 */
	function sendMessage() {
		const selectedChat = chatList.querySelector('li.selected');
		const chatId = selectedChat
			? selectedChat.getAttribute('data-chat-id')
			: null;
		const message = messageInput.value.trim();

		if (!chatId || !message) {
			console.warn('Chat ID or message is missing.');
			return;
		}

		// Optimistically add user message to the UI
		displayMessages([
			...getCurrentMessages(),
			{ messageType: 'User', message: message }
		]);
		messageInput.value = '';

		fetch(`/chat/${chatId}/message`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: message })
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.messages && Array.isArray(data.messages)) {
					displayMessages(data.messages);
					scrollToBottom(messagesDiv);
				}
			})
			.catch((error) => {
				console.error('Error sending message:', error);
			});
	}

	/**
	 * Retrieves the current messages displayed in the chat UI.
	 *
	 * This function maps over the child elements of the `messagesDiv` element and creates an array of objects,
	 * where each object represents a message. The `messageType` property is set to either 'AI' or 'User' based
	 * on the CSS class of the message element, and the `message` property is set to the inner HTML of the
	 * message element's `span` tag.
	 *
	 * @returns {Array<{ messageType: 'AI' | 'User', message: string }>} - An array of message objects, where each
	 * object has a `messageType` property (either 'AI' or 'User') and a `message` property (the text content of
	 * the message).
	 */
	function getCurrentMessages() {
		return Array.from(messagesDiv.children).map((el) => ({
			messageType: el.classList.contains('ai-message') ? 'AI' : 'User',
			message: el.querySelector('span').innerHTML
		}));
	}

	/**
	 * Handles the click event on the send message button.
	 *
	 * This function is called when the user clicks the send message button. It prevents the default form submission
	 * behavior, and then calls the `sendMessage()` function to send the message.
	 *
	 * @param {Event} event - The click event object.
	 */
	sendMessageBtn.addEventListener('click', function (event) {
		event.preventDefault();
		sendMessage();
	});

	/**
	 * Handles the click event on the create chat button.
	 *
	 * This function is called when the user clicks the create chat button. It sends a POST request to the `/chat` endpoint to create a new chat, and then adds a new list item to the chat list with the chat's title and ID.
	 *
	 * @param {Event} event - The click event object.
	 */
	createChatBtn.addEventListener('click', function () {
		fetch('/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({}) // You can add chat details here if needed
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.id && data.title) {
					const newChatItem = document.createElement('li');
					newChatItem.setAttribute('data-chat-id', data.id);
					newChatItem.textContent = data.title;
					chatList.appendChild(newChatItem);
					addChatClickHandlers();
				}
				window.location.reload(); // Reload the page
			})
			.catch((error) => {
				console.error('Error creating chat:', error);
			});
	});

	/**
	 * Fetches the list of chats from the server.
	 *
	 * This function sends a GET request to the `/chat` endpoint to retrieve the list of chats. The response is then
	 * used to update the chat list in the UI.
	 */
	fetchChats();

	/**
	 * Automatically adjusts the height of the message input field to fit the content.
	 *
	 * This function is called whenever the user types into the message input field. It sets the height of the input
	 * field to 'auto' to allow it to expand, and then sets the height to the scrollHeight of the input field,
	 * effectively making the input field grow as the user types.
	 */
	messageInput.addEventListener('input', function () {
		this.style.height = 'auto';
		this.style.height = this.scrollHeight + 'px';
	});

	/**
	 * Checks if the current device is a mobile device.
	 *
	 * This function uses the user agent string to detect if the current device is a mobile device, such as a smartphone or
	 * tablet. It returns `true` if the device is a mobile device, and `false` otherwise.
	 *
	 * @returns {boolean} `true` if the current device is a mobile device, `false` otherwise.
	 */
	function isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
	}

	/**
	 * Handles the keydown event on the message input field for non-mobile devices.
	 *
	 * This function is called when the user presses a key while the message input field has focus on a non-mobile device. If the user presses
	 * the Enter key without holding the Shift key, the function prevents the default form submission behavior and calls
	 * the `sendMessage()` function to send the message.
	 *
	 * @param {KeyboardEvent} event - The keydown event object.
	 */
	if (!isMobile()) {
		messageInput.addEventListener('keydown', function (event) {
			if (event.key === 'Enter' && !event.shiftKey) {
				event.preventDefault();
				sendMessage();
			}
		});
	}
});

/**
 * Submits a DELETE request to the `/chat/${chatId}` endpoint to delete a chat.
 *
 * This function is responsible for handling the deletion of a chat. It sends a DELETE request to the server to remove the
 * chat with the specified `chatId`. If the deletion is successful, it removes the corresponding chat item from the UI and
 * selects the next available chat, if any. If there are no more chats, it clears the message area. Finally, it refreshes
 * the chat list to ensure the UI reflects the current state and reloads the page.
 *
 * @param {string} chatId - The ID of the chat to be deleted.
 */
function submitDeleteForm(chatId) {
	console.log('Submitting delete form for chat ID:', chatId);
	fetch(`/chat/${chatId}`, { method: 'DELETE' })
		.then((response) => response.json())
		.then((data) => {
			console.log('Chat deleted:', data);
			const chatItem = document.querySelector(
				`li[data-chat-id="${chatId}"]`
			);
			if (chatItem) {
				const wasSelected = chatItem.classList.contains('selected');
				chatItem.remove();

				if (wasSelected) {
					// Find the next chat to select
					const nextChat = document.querySelector('#chat-list li');
					if (nextChat) {
						nextChat.classList.add('selected');
						const nextChatId =
							nextChat.getAttribute('data-chat-id');
						fetchChatHistory(nextChatId);
					} else {
						// No more chats, clear the message area
						document.getElementById('messages').innerHTML = '';
					}
				}
			} else {
				console.warn('Chat item not found in the list:', chatId);
			}
			fetchChats(); // Refresh the chat list to ensure it reflects the current state
			window.location.reload(); // Reload the page
		})
		.catch((error) => {
			console.error('Error deleting chat:', error);
		});
}

// Ensure fetchChats is called initially to load the chats
fetchChats();

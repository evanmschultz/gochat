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
	 * Fetches the list of chats for the current user and updates the chat list UI.
	 *
	 * This function makes a request to the `/user/chats` endpoint to retrieve the list of chats for the current user.
	 * It then updates the chat list UI by rendering the chat titles as list items, and attaches click event handlers to
	 * each chat item to allow the user to select a chat and fetch its history.
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
									<a style="cursor: pointer;">${chat.title}</a>
								</li>`
						)
						.join('');
					addChatClickHandlers();
					if (sortedChats.length > 0) {
						fetchChatHistory(sortedChats[0].id);
					}
				}
			});
		// .catch((error) => {
		// 	console.error('Error fetching chats:', error);
		// });
	}

	/**
	 * Fetches the chat history for the specified chat ID and displays the messages.
	 *
	 * This function makes a request to the `/chat/{chatId}` endpoint to retrieve the chat history for the
	 * specified chat ID. It then calls the `displayMessages` function to render the chat messages in the UI.
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
			messageElement.style.border = '1px solid #333';
			messageElement.style.marginBottom = '4rem';
			messageElement.style.padding = '2rem';
			messageElement.style.borderRadius = '0.35rem';

			// set AI and User specific styles
			if (message.messageType === 'AI') {
				messageElement.style.backgroundColor = '#e0e4e7';
				messageElement.style.marginRight = '10rem';
			} else {
				messageElement.style.backgroundColor = '#fafafa';
				messageElement.style.marginLeft = '10rem';
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
	 * Handles the keydown event on the message input field.
	 *
	 * This function is called when the user presses a key while the message input field has focus. If the user presses
	 * the Enter key without holding the Shift key, the function prevents the default form submission behavior and calls
	 * the `sendMessage()` function to send the message.
	 *
	 * @param {KeyboardEvent} event - The keydown event object.
	 */
	messageInput.addEventListener('keydown', function (event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	});
});

/**
 * Submits a DELETE request to the server to delete a chat.
 *
 * This function is called when the user wants to delete a chat. It sends a DELETE request to the `/chat/${chatId}`
 * endpoint, and upon a successful response, it removes the corresponding chat item from the chat list in the UI.
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
				chatItem.remove();
			} else {
				console.warn('Chat item not found in the list:', chatId);
			}
		})
		.catch((error) => {
			console.error('Error deleting chat:', error);
		});
}

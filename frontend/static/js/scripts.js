/**
 * Toggles the light/dark mode theme of the application.
 *
 * This function adds or removes the 'light-mode' class from the root HTML element, which switches the application
 * between a light and dark theme. It also updates the text content of the theme toggle label to reflect the
 * current theme.
 */
function toggleTheme(toggleThemeLabel) {
	document.documentElement.classList.toggle('light-mode');

	if (document.documentElement.classList.contains('light-mode')) {
		toggleThemeLabel.textContent = 'Dark Mode';
	} else {
		toggleThemeLabel.textContent = 'Light Mode';
	}
}

/**
 * Toggles the 'open' class on the sidebar element when the toggle button is clicked.
 * This function is used to show or hide the sidebar based on user interaction.
 */
function toggleSidebar() {
	sidebar.classList.toggle('open');
}

/**
 * Closes the sidebar when the user clicks outside of it.
 *
 * This function is called when the user clicks anywhere on the page. It checks if the click was inside the sidebar
 * or on the toggle sidebar button. If the click was outside the sidebar and the sidebar is currently open, it
 * removes the 'open' class from the sidebar to close it.
 *
 * @param {Event} event - The click event object.
 * @param {HTMLElement} sidebar - The sidebar element.
 * @param {HTMLElement} toggleSidebarBtn - The toggle sidebar button element.
 */
function closeSidebarOnOutsideClick(event, sidebar, toggleSidebarBtn) {
	const isClickInsideSidebar = sidebar.contains(event.target);
	const isClickOnToggleButton = toggleSidebarBtn.contains(event.target);

	if (
		!isClickInsideSidebar &&
		!isClickOnToggleButton &&
		sidebar.classList.contains('open')
	) {
		sidebar.classList.remove('open');
	}
}

/**
 * Adjusts the height of a textarea element to fit its content, with a maximum height limit.
 *
 * This function sets the height of the textarea to 'auto' first to reset its size,
 * then calculates a new height based on the content. The new height is limited to
 * a maximum of 35% of the window's inner height.
 *
 * @param {HTMLTextAreaElement} textarea - The textarea element to adjust.
 */
function adjustTextareaHeight(textarea) {
	textarea.style.height = 'auto';
	const newHeight = Math.min(
		textarea.scrollHeight,
		window.innerHeight * 0.35
	);
	textarea.style.height = newHeight + 'px';
}

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
	console.log('formatCodeBlocks');
	if (!inputString) return '';

	// Highlight code blocks
	let formattedString = inputString.replace(
		/```(\w+)?\n([\s\S]*?)```/gm,
		function (match, lang, code) {
			try {
				const highlightedCode =
					lang && Prism.languages[lang]
						? Prism.highlight(code, Prism.languages[lang], lang)
						: Prism.highlight(code, Prism.languages.plain, 'plain');
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
	formattedString = formattedString.replace(/`([^`]+)`/gm, '<code>$1</code>');
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

// /**
//  * Fetches the chat history for the specified chat ID and displays the messages in the UI.
//  *
//  * This function makes a request to the `/chat/{chatId}` endpoint to retrieve the chat history for the
//  * specified chat ID. It then calls the `displayMessages` function to render the messages in the
//  * `messagesDiv` element. If there are no messages available, the function clears the `messagesDiv`
//  * element.
//  *
//  * @param {string} chatId - The ID of the chat to fetch the history for.
//  * @param {HTMLElement} messagesDiv - The container element for displaying the chat messages.
//  */
// function fetchChatHistory(chatId, messagesDiv) {
// 	fetch(`/chat/${chatId}`)
// 		.then((response) => response.json())
// 		.then((data) => {
// 			if (data.messages && Array.isArray(data.messages)) {
// 				displayMessages(data.messages, messagesDiv);
// 				scrollToBottom(messagesDiv);
// 			} else {
// 				messagesDiv.innerHTML = ''; // Clear messages if no messages are available
// 			}
// 		})
// 		.catch((error) => {
// 			console.error('Error fetching chat history:', error);
// 		});
// }

// /**
//  * Adds click event handlers to the chat list element, allowing users to select a chat and delete a chat.
//  *
//  * When a chat item is clicked, this function adds the 'selected' class to the clicked chat item and fetches the chat history
//  * for the selected chat. If a delete button is clicked, this function stops the propagation of the click event and submits
//  * a delete form for the corresponding chat.
//  *
//  * @param {HTMLElement} chatList - The container element for the list of chats.
//  * @param {HTMLElement} messagesDiv - The container element for displaying the chat messages.
//  */
// function addChatClickHandlers(chatList, messagesDiv) {
// 	chatList.addEventListener('click', function (event) {
// 		const chatItem = event.target.closest('li');
// 		if (chatItem) {
// 			const deleteButton = event.target.closest('.delete-chat');
// 			if (deleteButton) {
// 				// Handle delete button click
// 				event.stopPropagation(); // Prevent the chat selection
// 				const chatId = deleteButton.getAttribute('data-chat-id');
// 				submitDeleteForm(chatId, chatList, messagesDiv);
// 			} else {
// 				// Handle chat selection
// 				chatList
// 					.querySelectorAll('li')
// 					.forEach((chat) => chat.classList.remove('selected'));
// 				chatItem.classList.add('selected');
// 				const chatId = chatItem.getAttribute('data-chat-id');
// 				fetchChatHistory(chatId, messagesDiv);
// 			}
// 		}
// 	});
// }

// /**
//  * Displays the messages in the specified message container.
//  *
//  * This function takes an array of messages and a message container element, and renders the messages
//  * in the container. Each message is displayed as a paragraph element with the appropriate CSS class
//  * (either 'ai-message' or 'user-message') based on the message type. The message content is formatted
//  * to handle any code blocks, and the container is scrolled to the bottom after the messages are
//  * displayed.
//  *
//  * @param {Object[]} messages - An array of message objects, where each object has a 'messageType'
//  *                             property ('AI' or 'user') and a 'message' property containing the
//  *                             message text.
//  * @param {HTMLElement} messagesDiv - The container element where the messages should be displayed.
//  */
// function displayMessages(messages, messagesDiv) {
// 	messagesDiv.innerHTML = '';
// 	messages.forEach((message) => {
// 		const messageElement = document.createElement('p');
// 		messageElement.className =
// 			message.messageType === 'AI' ? 'ai-message' : 'user-message';

// 		const messageContent = document.createElement('span');
// 		messageContent.innerHTML = formatCodeBlocks(message.message);
// 		messageElement.appendChild(messageContent);

// 		messagesDiv.appendChild(messageElement);
// 	});
// 	try {
// 		Prism.highlightAll();
// 	} catch (error) {
// 		console.error('Error applying Prism highlighting:', error);
// 	}
// 	scrollToBottom(messagesDiv);
// }

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

// /**
//  * Fetches the list of chats for the current user and updates the chat list UI.
//  *
//  * This function sends a GET request to the `/user/chats` endpoint to retrieve the list of chats for the
//  * current user. It then sorts the chats by their ID in descending order and updates the chat list UI
//  * with the sorted chats. Each chat is displayed as a list item with the chat title and a delete button.
//  * If there are any chats, the first chat is automatically selected and its chat history is fetched.
//  * If there are no chats, the message area is cleared.
//  *
//  * @param {HTMLElement} chatList - The HTML element that will contain the list of chats.
//  * @param {HTMLElement} messagesDiv - The HTML element that will display the chat messages.
//  */
// function fetchChats(chatList, messagesDiv) {
// 	fetch('/user/chats')
// 		.then((response) => response.json())
// 		.then((data) => {
// 			if (data.chats && Array.isArray(data.chats)) {
// 				const sortedChats = data.chats.sort((a, b) => b.id - a.id);
// 				chatList.innerHTML = sortedChats
// 					.map(
// 						(chat) =>
// 							`<li data-chat-id="${chat.id}">
// 								<a style="margin-right: 2.5rem;">${chat.title}</a>
// 								<a class="delete-chat" data-chat-id="${chat.id}">X</a>
// 							</li>`
// 					)
// 					.join('');
// 				addChatClickHandlers(chatList, messagesDiv);
// 				if (sortedChats.length > 0) {
// 					const firstChatId = sortedChats[0].id;
// 					const firstChatItem = chatList.querySelector(
// 						`li[data-chat-id="${firstChatId}"]`
// 					);
// 					firstChatItem.classList.add('selected');
// 					fetchChatHistory(sortedChats[0].id, messagesDiv);
// 				} else {
// 					messagesDiv.innerHTML = ''; // Clear messages if no chats are available
// 				}
// 			}
// 		})
// 		.catch((error) => {
// 			console.error('Error fetching chats:', error);
// 		});
// }

// /**
//  * Sends a message to the currently selected chat.
//  *
//  * This function is responsible for sending a message to the currently selected chat. It first retrieves the ID of the
//  * selected chat and the message text from the input field. If either the chat ID or the message is missing, it logs a
//  * warning and returns.
//  *
//  * The function then optimistically adds the user's message to the message display area, clears the input field, and
//  * sends a POST request to the `/chat/${chatId}/message` endpoint with the message text. If the request is successful,
//  * it displays the updated list of messages in the message display area and scrolls to the bottom.
//  *
//  * @param {HTMLElement} chatList - The HTML element that contains the list of chats.
//  * @param {HTMLElement} messagesDiv - The HTML element that displays the chat messages.
//  */
// function sendMessage(chatList, messagesDiv, messageInput) {
// 	const selectedChat = chatList.querySelector('li.selected');
// 	const chatId = selectedChat
// 		? selectedChat.getAttribute('data-chat-id')
// 		: null;
// 	const message = messageInput.value.trim();

// 	if (!chatId || !message) {
// 		console.warn('Chat ID or message is missing.');
// 		return;
// 	}

// 	// Optimistically add user message to the UI
// 	const currentMessages = getCurrentMessages(messagesDiv);
// 	currentMessages.push({ messageType: 'User', message: message });
// 	displayMessages(currentMessages, messagesDiv);
// 	messageInput.value = '';

// 	fetch(`/chat/${chatId}/message`, {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify({ message: message })
// 	})
// 		.then((response) => response.json())
// 		.then((data) => {
// 			if (data.messages && Array.isArray(data.messages)) {
// 				displayMessages(data.messages, messagesDiv);
// 				scrollToBottom(messagesDiv);
// 			}
// 		})
// 		.catch((error) => {
// 			console.error('Error sending message:', error);
// 		});
// }

// /**
//  * Retrieves the current messages displayed in the messages div.
//  *
//  * This function maps over the children of the provided `messagesDiv` element and returns an array of objects, where each object represents a message. The `messageType` property is set to either 'AI' or 'User' based on the message's CSS class, and the `message` property is set to the inner HTML of the message's span element.
//  *
//  * @param {HTMLElement} messagesDiv - The HTML element containing the messages.
//  * @returns {Array<{ messageType: 'AI' | 'User', message: string }>} - An array of message objects.
//  */
// function getCurrentMessages(messagesDiv) {
// 	return Array.from(messagesDiv.children).map((element) => ({
// 		messageType: element.classList.contains('ai-message') ? 'AI' : 'User',
// 		message: element.querySelector('span').innerHTML
// 	}));
// }

// /**
//  * Handles the keydown event on the message input field.
//  *
//  * This function is responsible for detecting when the user presses the Enter key (without holding Shift) on the message
//  * input field. When this event occurs, the function prevents the default form submission behavior and calls the
//  * `sendMessage` function to send the current message.
//  *
//  * @param {KeyboardEvent} event - The keydown event object.
//  * @param {HTMLElement} chatList - The HTML element containing the list of chats.
//  * @param {HTMLElement} messagesDiv - The HTML element containing the messages.
//  */
// function handleMessageInputKeydown(event, chatList, messagesDiv, messageInput) {
// 	if (event.key === 'Enter' && !event.shiftKey) {
// 		event.preventDefault();
// 		sendMessage(chatList, messagesDiv, messageInput);
// 	}
// }

/**
 * Handles the keydown event on the message input field.
 * Submits the form on Enter (without Shift) for non-mobile devices.
 *
 * @param {KeyboardEvent} event - The keydown event object.
 */
function handleMessageInputKeydown(event) {
	if (!isMobile() && event.key === 'Enter' && !event.shiftKey) {
		event.preventDefault();
		const form = event.target.closest('form');
		if (form) {
			// Use HTMX to trigger the form submission
			htmx.trigger(form, 'submit');
		}
	}
}

// function handleCreateChat(chatList, messagesDiv) {
// 	fetch('/chat', {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify({}) // You can add chat details here if needed
// 	})
// 		.then((response) => response.json())
// 		.then((data) => {
// 			if (data.id && data.title) {
// 				const newChatItem = document.createElement('li');
// 				newChatItem.setAttribute('data-chat-id', data.id);
// 				newChatItem.textContent = data.title;
// 				chatList.appendChild(newChatItem);
// 				addChatClickHandlers(chatList, messagesDiv);
// 			}
// 			window.location.reload(); // Reload the page
// 		})
// 		.catch((error) => {
// 			console.error('Error creating chat:', error);
// 		});
// }

// /**
//  * Submits a DELETE request to the `/chat/${chatId}` endpoint to delete a chat.
//  *
//  * This function is responsible for handling the deletion of a chat. It sends a DELETE request to the server to remove the
//  * chat with the specified `chatId`. If the deletion is successful, it removes the corresponding chat item from the UI and
//  * selects the next available chat, if any. If there are no more chats, it clears the message area. Finally, it refreshes
//  * the chat list to ensure the UI reflects the current state.
//  *
//  * @param {string} chatId - The ID of the chat to be deleted.
//  */
// function submitDeleteForm(chatId, chatList, messagesDiv) {
// 	fetch(`/chat/${chatId}`, { method: 'DELETE' })
// 		.then((response) => response.json())
// 		.then((data) => {
// 			const chatItem = document.querySelector(
// 				`li[data-chat-id="${chatId}"]`
// 			);
// 			if (chatItem) {
// 				const wasSelected = chatItem.classList.contains('selected');
// 				chatItem.remove();

// 				if (wasSelected) {
// 					// Find the next chat to select
// 					const nextChat = document.querySelector('#chat-list li');
// 					if (nextChat) {
// 						nextChat.classList.add('selected');
// 						const nextChatId =
// 							nextChat.getAttribute('data-chat-id');
// 						fetchChatHistory(nextChatId, messagesDiv);
// 					} else {
// 						// No more chats, clear the message area
// 						messagesDiv.innerHTML = '';
// 					}
// 				}
// 			} else {
// 				console.warn('Chat item not found in the list:', chatId);
// 			}
// 			fetchChats(chatList, messagesDiv); // Refresh the chat list to ensure it reflects the current state
// 		})
// 		.catch((error) => {
// 			console.error('Error deleting chat:', error);
// 		});
// }

// Function to update the selected chat
function updateSelectedChat(chatId) {
	// Update the chat ID in the chat container
	document.getElementById('messages').setAttribute('data-chat-id', chatId);
	document.getElementById('current-chat-id').value = chatId;

	// Update the message form action URL
	// const messageForm = document.getElementById('message-form');
	// messageForm.setAttribute('hx-post', `/chat/${chatId}/message/htmx`);

	// Update UI to show which chat is selected
	document.querySelectorAll('#chat-list li').forEach((li) => {
		li.classList.remove('selected');
	});
	const selectedChat = document.querySelector(
		`#chat-list li[data-chat-id="${chatId}"]`
	);
	if (selectedChat) {
		selectedChat.classList.add('selected');
	}
}

document.addEventListener('DOMContentLoaded', function () {
	// const chatList = document.getElementById('chat-list');
	// const messagesDiv = document.getElementById('messages');
	const messageInput = document.getElementById('message-input');
	// const sendMessageBtn = document.getElementById('send-message-btn');
	// const createChatBtn = document.getElementById('create-new-chat');
	const sidebar = document.getElementById('sidebar');
	const toggleSidebarBtn = document.getElementById('toggle-sidebar');
	const toggleThemeBtn = document.getElementById('toggle-theme');

	// Add event listener for chat selection
	document.addEventListener('htmx:afterSwap', function (event) {
		if (event.detail.target.id === 'messages') {
			const chatId = document.getElementById('current-chat-id').value;
			updateSelectedChat(chatId);
		}
	});

	// Add event listeners and toggle theme on click
	const toggleThemeLabel = document.getElementById('toggle-theme-label');
	toggleThemeBtn.addEventListener('click', function () {
		toggleTheme(toggleThemeLabel);
	});

	// Add event listener for the sidebar toggle button if on mobile device
	toggleSidebarBtn.addEventListener('click', function () {
		toggleSidebar();
	});

	// Add event listener to close the sidebar when clicking outside of it
	document.addEventListener('click', function (event) {
		closeSidebarOnOutsideClick(event, sidebar, toggleSidebarBtn);
	});

	// Adjust the height of the message message input textarea to fit user input
	// messageInput.addEventListener('input', function () {
	// 	adjustTextareaHeight(this);
	// });

	if (messageInput) {
		messageInput.addEventListener('keydown', handleMessageInputKeydown);
	}

	document.body.addEventListener('htmx:afterSwap', function (event) {
		if (event.detail.target.id === 'messages') {
			var newMessages =
				event.detail.target.querySelectorAll('.message p');
			newMessages.forEach(function (message) {
				message.innerHTML = formatCodeBlocks(message.innerHTML);
			});
			Prism.highlightAllUnder(event.detail.target);
		}
	});
});
// Add event listener for delete buttons
// document.querySelectorAll('.delete-chat').forEach((deleteBtn) => {
// 	deleteBtn.addEventListener('click', function (event) {
// 		const chatId = this.getAttribute('data-chat-id');
// 		submitDeleteForm(chatId, chatList, messagesDiv);
// 	});
// });

// // Add event listeners for sending messages and prevent default form submission
// sendMessageBtn.addEventListener('click', function (event) {
// 	event.preventDefault();
// 	sendMessage(chatList, messagesDiv, messageInput);
// });
// Add event listener when the DOM is loaded

// // Add event listener for creating a new chat
// createChatBtn.addEventListener('click', function () {
// 	handleCreateChat(chatList, messagesDiv);
// });

// // Handle message input keydown events if not on mobile
// if (!isMobile()) {
// 	messageInput.addEventListener('keydown', function (event) {
// 		handleMessageInputKeydown(
// 			event,
// 			chatList,
// 			messagesDiv,
// 			messageInput
// 		);
// 	});
// }

// // Fetch the list of chats for the current user
// fetchChats(chatList, messagesDiv);

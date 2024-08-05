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
	// const messageTextarea = document.getElementById('message-input');

	// // Add event listener for chat selection
	// document.addEventListener('htmx:afterSwap', function (event) {
	// 	if (event.detail.target.id === 'messages') {
	// 		const chatId = document.getElementById('current-chat-id').value;
	// 		updateSelectedChat(chatId);
	// 	}
	// });

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

document.addEventListener('DOMContentLoaded', function () {
	const chatList = document.getElementById('chat-list');
	const messagesDiv = document.getElementById('messages');
	const messageInput = document.getElementById('message-input');
	const sendMessageBtn = document.getElementById('send-message-btn');
	const createChatBtn = document.getElementById('create-new-chat');

	console.log('Document loaded and DOMContentLoaded event fired.');

	// Fetch and display the list of chats
	function fetchChats() {
		console.log('Fetching chats...');
		fetch('/user/chats')
			.then((response) => {
				console.log('Chats fetched:', response);
				return response.text();
			})
			.then((data) => {
				console.log('Chat list data:', data);
				chatList.innerHTML = data;
				addChatClickHandlers();
			})
			.catch((error) => {
				console.error('Error fetching chats:', error);
			});
	}

	// Add click handlers to chat items
	function addChatClickHandlers() {
		const chatItems = chatList.querySelectorAll('li');
		console.log('Adding click handlers to chat items:', chatItems);
		chatItems.forEach((item) => {
			item.addEventListener('click', function () {
				chatItems.forEach((chat) => chat.classList.remove('selected')); // Remove 'selected' class from all chat items
				this.classList.add('selected'); // Add 'selected' class to the clicked chat item
				const chatId = this.getAttribute('data-chat-id');
				console.log('Chat item clicked, chat ID:', chatId);
				fetchChatHistory(chatId);
			});
		});
	}

	// Fetch and display chat history
	function fetchChatHistory(chatId) {
		console.log('Fetching chat history for chat ID:', chatId);
		fetch(`/chat/${chatId}`)
			.then((response) => {
				console.log('Chat history fetched:', response);
				return response.text();
			})
			.then((data) => {
				console.log('Chat history data:', data);
				messagesDiv.innerHTML = data;
				formatCodeBlocks();
				scrollToBottom(messagesDiv);
			})
			.catch((error) => {
				console.error('Error fetching chat history:', error);
			});
	}

	// Send a new message
	sendMessageBtn.addEventListener('click', function (event) {
		event.preventDefault();
		const selectedChat = chatList.querySelector('li.selected');
		const chatId = selectedChat
			? selectedChat.getAttribute('data-chat-id')
			: null;
		console.log(
			'Send message button clicked. Chat ID:',
			chatId,
			'Message:',
			messageInput.value
		);
		if (chatId && messageInput.value) {
			fetch(`/chat/${chatId}/message`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: messageInput.value })
			})
				.then((response) => {
					console.log('Message sent:', response);
					return response.text();
				})
				.then((data) => {
					console.log('Updated chat history data:', data);
					messagesDiv.innerHTML = data;
					messageInput.value = '';
					formatCodeBlocks();
					scrollToBottom(messagesDiv);
				})
				.catch((error) => {
					console.error('Error sending message:', error);
				});
		} else {
			console.warn('Chat ID or message input is missing.');
		}
	});

	// Create a new chat
	createChatBtn.addEventListener('click', function () {
		console.log('Create chat button clicked.');
		fetch('/chat', { method: 'POST' })
			.then((response) => {
				console.log('Chat created:', response);
				return response.text();
			})
			.then((data) => {
				console.log('Create chat response data:', data);
				chatList.innerHTML += data;
				addChatClickHandlers();
			})
			.catch((error) => {
				console.error('Error creating chat:', error);
			});
	});

	// Fetch chats on load
	fetchChats();

	// Function to format code blocks using Prism
	function formatCodeBlocks() {
		const messageBlocks = document.querySelectorAll('.message-content');
		messageBlocks.forEach((block) => {
			const originalContent = block.innerHTML;
			const formattedContent = formatCode(originalContent);
			block.innerHTML = formattedContent;
		});
		Prism.highlightAll();
	}

	// Helper function to format code blocks
	function formatCode(inputString) {
		let formattedString = inputString.replace(
			/```(\w+)?\n([\s\S]*?)```/gm,
			function (_, lang, code) {
				return `<pre><code class="language-${
					lang || 'none'
				}">${code}</code></pre>`;
			}
		);
		formattedString = formattedString.replace(
			/`([^`]+)`/gm,
			'<code>$1</code>'
		);
		return formattedString;
	}

	// Function to scroll the chat messages div to the bottom
	function scrollToBottom(element) {
		element.scrollTop = element.scrollHeight;
	}

	// Add an event listener for input events on chat input
	messageInput.addEventListener('input', function () {
		// Dynamically adjust the height based on the scrollHeight
		this.style.height = 'auto';
		this.style.height = this.scrollHeight + 'px';
	});

	// Add a keydown event listener
	messageInput.addEventListener('keydown', function (event) {
		if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			sendMessageBtn.click();
		}
	});
});

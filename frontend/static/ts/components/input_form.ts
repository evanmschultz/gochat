import { isMobile } from '../utils.js';
declare const htmx: any;

function handleMessageInputKeydown(event: KeyboardEvent): void {
	const deviceIsMobile: boolean = isMobile(navigator);
	if (!deviceIsMobile && event.key === 'Enter' && !event.shiftKey) {
		event.preventDefault();
		const form = (event.target as HTMLElement).closest('form');
		if (form) {
			// Use HTMX to trigger the form submission
			htmx.trigger(form, 'submit', {}); // Add an empty object as the third argument
		}
	}
}

function adjustTextareaHeight(textarea: HTMLTextAreaElement): void {
	textarea.style.height = 'auto';
	const newHeight = Math.min(
		textarea.scrollHeight,
		window.innerHeight * 0.35
	);
	textarea.style.height = newHeight + 'px';
}

// Event delegation for message input
document.addEventListener('input', function (event: Event) {
	const target = event.target as HTMLElement;
	if (target && target.id === 'message-input') {
		console.log('Message input changed');
		adjustTextareaHeight(target as HTMLTextAreaElement);
	}
});

document.addEventListener('keydown', function (event: KeyboardEvent) {
	const target = event.target as HTMLElement;
	if (target && target.id === 'message-input') {
		handleMessageInputKeydown(event);
	}
});

const selectedChatID =
	(document.getElementById('current-chat-id') as HTMLInputElement)?.value ||
	'0';
// const chat_list = document.getElementById('sidebar-chat-list');
const chats = document.querySelectorAll('.chat-list-item');

if (chats) {
	chats.forEach((chat) => {
		const chatElement = chat as HTMLElement; // Type assertion
		const anchorTags = chatElement.querySelectorAll('a'); // Select all anchor tags inside the chat element

		// Remove 'selected' class from the list item and its anchor tags
		chatElement.classList.remove('selected');
		anchorTags.forEach((anchor) => anchor.classList.remove('selected'));

		if (chatElement.dataset.chatId === selectedChatID) {
			console.log('Selected chat:', selectedChatID);
			chatElement.classList.add('selected');
			anchorTags.forEach((anchor) => anchor.classList.add('selected'));
		}
	});
}

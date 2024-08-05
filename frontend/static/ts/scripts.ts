// // import { ElementId, HTMXEvent } from './types';
// import 'htmx.org';
// import Prism from 'prismjs';

// function toggleTheme(toggleThemeLabel: HTMLElement): void {
// 	document.documentElement.classList.toggle('light-mode');

// 	if (document.documentElement.classList.contains('light-mode')) {
// 		toggleThemeLabel.textContent = 'Dark Mode';
// 	} else {
// 		toggleThemeLabel.textContent = 'Light Mode';
// 	}
// }

// function toggleSidebar(sidebar: HTMLElement): void {
// 	sidebar.classList.toggle('open');
// }

// function closeSidebarOnOutsideClick(
// 	event: MouseEvent,
// 	sidebar: HTMLElement,
// 	toggleSidebarBtn: HTMLElement
// ): void {
// 	const isClickInsideSidebar = sidebar.contains(event.target as Node);
// 	const isClickOnToggleButton = toggleSidebarBtn.contains(
// 		event.target as Node
// 	);

// 	if (
// 		!isClickInsideSidebar &&
// 		!isClickOnToggleButton &&
// 		sidebar.classList.contains('open')
// 	) {
// 		sidebar.classList.remove('open');
// 	}
// }

// function formatCodeBlocks(inputString: string): string {
// 	console.log('formatCodeBlocks');
// 	if (!inputString) return '';

// 	// Highlight code blocks
// 	let formattedString = inputString.replace(
// 		/```(\w+)?\n([\s\S]*?)```/gm,
// 		function (match: string, lang: string, code: string) {
// 			try {
// 				const highlightedCode =
// 					lang && (Prism.languages as any)[lang]
// 						? Prism.highlight(
// 								code,
// 								(Prism.languages as any)[lang],
// 								lang
// 						  )
// 						: Prism.highlight(code, Prism.languages.plain, 'plain');
// 				return `<pre style="margin: 1.5rem"><code class="language-${
// 					lang || 'plain'
// 				}">${highlightedCode}</code></pre>`;
// 			} catch (error) {
// 				console.error('Error highlighting code:', error);
// 				return `<pre><code class="language-${
// 					lang || 'plain'
// 				}">${code}</code></pre>`;
// 			}
// 		}
// 	);

// 	// Highlight inline code blocks
// 	formattedString = formattedString.replace(/`([^`]+)`/gm, '<code>$1</code>');
// 	return formattedString;
// }

// function scrollToBottom(element: HTMLElement): void {
// 	element.scrollTop = element.scrollHeight;
// }

// export function isMobile(): boolean {
// 	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
// 		navigator.userAgent
// 	);
// }

// function updateSelectedChat(chatId: string): void {
// 	const messagesElement = document.getElementById('messages');
// 	const currentChatIdElement = document.getElementById(
// 		'current-chat-id'
// 	) as HTMLInputElement;

// 	if (messagesElement) {
// 		messagesElement.setAttribute('data-chat-id', chatId);
// 	}

// 	if (currentChatIdElement) {
// 		currentChatIdElement.value = chatId;
// 	}

// 	document.querySelectorAll('#chat-list li').forEach((li) => {
// 		li.classList.remove('selected');
// 	});

// 	const selectedChat = document.querySelector(
// 		`#chat-list li[data-chat-id="${chatId}"]`
// 	);

// 	if (selectedChat) {
// 		selectedChat.classList.add('selected');
// 	}
// }

// document.addEventListener('DOMContentLoaded', function () {
// 	const messageInput = document.getElementById(
// 		'message-input'
// 	) as HTMLInputElement;
// 	const sidebar = document.getElementById('sidebar') as HTMLElement;
// 	const toggleSidebarBtn = document.getElementById(
// 		'toggle-sidebar'
// 	) as HTMLElement;
// 	const toggleThemeBtn = document.getElementById(
// 		'toggle-theme'
// 	) as HTMLElement;

// 	const toggleThemeLabel = document.getElementById(
// 		'toggle-theme-label'
// 	) as HTMLElement;
// 	toggleThemeBtn.addEventListener('click', function () {
// 		toggleTheme(toggleThemeLabel);
// 	});

// 	toggleSidebarBtn.addEventListener('click', function () {
// 		toggleSidebar(sidebar);
// 	});

// 	document.addEventListener('click', function (event) {
// 		closeSidebarOnOutsideClick(
// 			event as MouseEvent,
// 			sidebar,
// 			toggleSidebarBtn
// 		);
// 	});

// 	// document.body.addEventListener('htmx:afterSwap', function (event: Event) {
// 	// 	const htmxEvent = event as HTMXEvent;
// 	// 	if (htmxEvent.detail.target.id === 'messages') {
// 	// 		const newMessages =
// 	// 			htmxEvent.detail.target.querySelectorAll('.message p');
// 	// 		newMessages.forEach(function (message: Element) {
// 	// 			if (message instanceof HTMLElement) {
// 	// 				message.innerHTML = formatCodeBlocks(message.innerHTML);
// 	// 			}
// 	// 		});
// 	// 		Prism.highlightAllUnder(htmxEvent.detail.target);
// 	// 	}
// 	// });
// 	document.body.addEventListener('htmx:afterSwap', (event) => {
// 		const htmxEvent = event as HTMXEvent;
// 		if (htmxEvent.detail.target.id === 'messages') {
// 			const newMessages =
// 				htmxEvent.detail.target.querySelectorAll('.message p');
// 			newMessages.forEach((message: Element) => {
// 				if (message instanceof HTMLElement) {
// 					message.innerHTML = formatCodeBlocks(message.innerHTML);
// 				}
// 			});
// 			Prism.highlightAllUnder(htmxEvent.detail.target);
// 		}
// 	});
// });
import 'htmx.org';
import Prism from 'prismjs';

function toggleTheme(toggleThemeLabel: HTMLElement): void {
	document.documentElement.classList.toggle('light-mode');

	if (document.documentElement.classList.contains('light-mode')) {
		toggleThemeLabel.textContent = 'Dark Mode';
	} else {
		toggleThemeLabel.textContent = 'Light Mode';
	}
}

function toggleSidebar(sidebar: HTMLElement): void {
	sidebar.classList.toggle('open');
}

function closeSidebarOnOutsideClick(
	event: MouseEvent,
	sidebar: HTMLElement,
	toggleSidebarBtn: HTMLElement
): void {
	const isClickInsideSidebar = sidebar.contains(event.target as Node);
	const isClickOnToggleButton = toggleSidebarBtn.contains(
		event.target as Node
	);

	if (
		!isClickInsideSidebar &&
		!isClickOnToggleButton &&
		sidebar.classList.contains('open')
	) {
		sidebar.classList.remove('open');
	}
}

function formatCodeBlocks(inputString: string): string {
	console.log('formatCodeBlocks');
	if (!inputString) return '';

	// Highlight code blocks
	let formattedString = inputString.replace(
		/```(\w+)?\n([\s\S]*?)```/gm,
		function (match: string, lang: string, code: string) {
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

function scrollToBottom(element: HTMLElement): void {
	element.scrollTop = element.scrollHeight;
}

export function isMobile(): boolean {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	);
}

function updateSelectedChat(chatId: string): void {
	const messagesElement = document.getElementById('messages');
	const currentChatIdElement = document.getElementById(
		'current-chat-id'
	) as HTMLInputElement;

	if (messagesElement) {
		messagesElement.setAttribute('data-chat-id', chatId);
	}

	if (currentChatIdElement) {
		currentChatIdElement.value = chatId;
	}

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
	const messageInput = document.getElementById(
		'message-input'
	) as HTMLInputElement;
	const sidebar = document.getElementById('sidebar') as HTMLElement;
	const toggleSidebarBtn = document.getElementById(
		'toggle-sidebar'
	) as HTMLElement;
	const toggleThemeBtn = document.getElementById(
		'toggle-theme'
	) as HTMLElement;

	const toggleThemeLabel = document.getElementById(
		'toggle-theme-label'
	) as HTMLElement;
	toggleThemeBtn.addEventListener('click', function () {
		toggleTheme(toggleThemeLabel);
	});

	toggleSidebarBtn.addEventListener('click', function () {
		toggleSidebar(sidebar);
	});

	document.addEventListener('click', function (event) {
		closeSidebarOnOutsideClick(
			event as MouseEvent,
			sidebar,
			toggleSidebarBtn
		);
	});

	document.body.addEventListener('htmx:afterSwap', (event) => {
		const customEvent = event as CustomEvent;
		const target = customEvent.detail.target as HTMLElement;
		if (target.id === 'messages') {
			const newMessages = target.querySelectorAll('.message p');
			newMessages.forEach((message: Element) => {
				if (message instanceof HTMLElement) {
					message.innerHTML = formatCodeBlocks(message.innerHTML);
				}
			});
			Prism.highlightAllUnder(target);
		}
	});
});

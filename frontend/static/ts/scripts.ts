// import 'htmx.org';
// import Prism from 'prismjs';
// function isTablet(navigator: Navigator) {
// 	const hasTouchScreen =
// 		'ontouchstart' in window || navigator.maxTouchPoints > 0;
// 	const isMediumScreen = window.matchMedia(
// 		'(min-width: 768px) and (max-width: 1024px)'
// 	).matches;

// 	return hasTouchScreen && isMediumScreen;
// }

// function isPhone(navigator: Navigator) {
// 	const hasTouchScreen =
// 		'ontouchstart' in window || navigator.maxTouchPoints > 0;
// 	const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;

// 	return hasTouchScreen && isSmallScreen;
// }

// function isMobile(navigator: Navigator) {
// 	return isTablet(navigator) || isPhone(navigator);
// }
import { isMobile } from './utils.js';

function toggleTheme(toggleThemeLabel: HTMLElement): void {
	console.log('toggleTheme');
	document.documentElement.classList.toggle('light-mode');

	if (document.documentElement.classList.contains('light-mode')) {
		toggleThemeLabel.textContent = 'Dark Mode';
	} else {
		toggleThemeLabel.textContent = 'Light Mode';
	}
}

function toggleSidebar(sidebar: HTMLElement): void {
	console.log('toggleSidebar');
	sidebar.classList.toggle('open');
}

function closeSidebarOnOutsideClick(
	event: MouseEvent,
	sidebar: HTMLElement,
	toggleSidebarBtn: HTMLElement
): void {
	console.log('closeSidebarOnOutside Click');
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

// function formatCodeBlocks(inputString: string): string {
// 	console.log('formatCodeBlocks');
// 	if (!inputString) return '';

// 	// Highlight code blocks
// 	let formattedString = inputString.replace(
// 		/```(\w+)?\n([\s\S]*?)```/gm,
// 		function (match: string, lang: string, code: string) {
// 			try {
// 				const highlightedCode =
// 					lang && Prism.languages[lang]
// 						? Prism.highlight(code, Prism.languages[lang], lang)
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

function updateSelectedChat(chatId: string): void {
	// const messagesElement = document.getElementById('messages');
	// const currentChatIdElement = document.getElementById(
	// 	'current-chat-id'
	// ) as HTMLInputElement;

	// if (messagesElement) {
	// 	messagesElement.setAttribute('data-chat-id', chatId);
	// }

	// if (currentChatIdElement) {
	// 	currentChatIdElement.value = chatId;
	// }

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
	console.log('DOMContentLoaded event fired');
	// const messageInput = document.getElementById(
	// 	'message-input'
	// ) as HTMLInputElement | null;
	const sidebar = document.getElementById('sidebar') as HTMLElement;

	const toggleThemeBtn = document.getElementById(
		'toggle-theme'
	) as HTMLElement;
	const toggleThemeLabel = document.getElementById(
		'toggle-theme-label'
	) as HTMLElement;

	if (toggleThemeBtn && toggleThemeLabel) {
		toggleThemeBtn.addEventListener('click', function () {
			toggleTheme(toggleThemeLabel);
		});
	}

	console.log('Is device mobile:', isMobile(navigator));
	if (isMobile(navigator)) {
		console.log('isMobile');
		const toggleSidebarBtn = document.getElementById(
			'toggle-sidebar'
		) as HTMLElement;

		if (toggleSidebarBtn && sidebar) {
			toggleSidebarBtn.addEventListener('click', function () {
				toggleSidebar(sidebar);
			});

			document.addEventListener('click', function (event) {
				if (sidebar && toggleSidebarBtn) {
					closeSidebarOnOutsideClick(
						event as MouseEvent,
						sidebar,
						toggleSidebarBtn
					);
				}
			});
		}
	}

	const messagesDiv = document.getElementById('messages');
	messagesDiv?.hidden.valueOf;

	// document.body.addEventListener('htmx:afterSwap', (event) => {
	// 	const customEvent = event as CustomEvent;
	// 	const target = customEvent.detail.target as HTMLElement;
	// 	if (target.id === 'messages') {
	// 		const newMessages = target.querySelectorAll('.message p');
	// 		newMessages.forEach((message: Element) => {
	// 			if (message instanceof HTMLElement) {
	// 				message.innerHTML = formatCodeBlocks(message.innerHTML);
	// 			}
	// 		});
	// 		Prism.highlightAllUnder(target);
	// 	}
	// });
});

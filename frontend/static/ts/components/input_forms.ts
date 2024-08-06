import 'htmx.org';
function isTablet(navigator: Navigator) {
	const hasTouchScreen =
		'ontouchstart' in window || navigator.maxTouchPoints > 0;
	const isMediumScreen = window.matchMedia(
		'(min-width: 768px) and (max-width: 1024px)'
	).matches;

	return hasTouchScreen && isMediumScreen;
}

function isPhone(navigator: Navigator) {
	const hasTouchScreen =
		'ontouchstart' in window || navigator.maxTouchPoints > 0;
	const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;

	return hasTouchScreen && isSmallScreen;
}

export function isMobile(navigator: Navigator) {
	return isTablet(navigator) || isPhone(navigator);
}

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

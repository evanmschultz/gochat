function scrollToBottom(element: HTMLElement): void {
	console.log('scrollToBottom');
	element.scrollTop = element.scrollHeight;
}

document.addEventListener('htmx:afterSettle', function (event: Event) {
	const messagesDiv = document.getElementById('messages');
	console.log('Message Div!');
	if (messagesDiv instanceof HTMLElement) {
		scrollToBottom(messagesDiv);
	}
});

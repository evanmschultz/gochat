// /**
//  * Handles the keydown event on the message input field.
//  * Submits the form on Enter (without Shift) for non-mobile devices.
//  *
//  * @param {KeyboardEvent} event - The keydown event object.
//  */
// function handleMessageInputKeydown(event) {
// 	if (!isMobile() && event.key === 'Enter' && !event.shiftKey) {
// 		event.preventDefault();
// 		const form = event.target.closest('form');
// 		if (form) {
// 			// Use HTMX to trigger the form submission
// 			htmx.trigger(form, 'submit');
// 		}
// 	}
// }

// /**
//  * Adjusts the height of a textarea element to fit its content, with a maximum height limit.
//  *
//  * This function sets the height of the textarea to 'auto' first to reset its size,
//  * then calculates a new height based on the content. The new height is limited to
//  * a maximum of 35% of the window's inner height.
//  *
//  * @param {HTMLTextAreaElement} textarea - The textarea element to adjust.
//  */
// function adjustTextareaHeight(textarea) {
// 	textarea.style.height = 'auto';
// 	const newHeight = Math.min(
// 		textarea.scrollHeight,
// 		window.innerHeight * 0.35
// 	);
// 	textarea.style.height = newHeight + 'px';
// }

// // Event delegation for message input
// document.addEventListener('input', function (event) {
// 	if (event.target && event.target.id === 'message-input') {
// 		console.log('Message input changed');
// 		adjustTextareaHeight(event.target);
// 	}
// });

// document.addEventListener('keydown', function (event) {
// 	if (event.target && event.target.id === 'message-input') {
// 		handleMessageInputKeydown(event);
// 	}
// });

// API response types
interface User {
	id: number;
	username: string;
}

interface Message {
	id: number;
	chatId: number;
	userId: number;
	message: string;
	messageType: 'USER' | 'AI';
	createdAt: string;
	updatedAt: string;
}

interface Chat {
	id: number;
	userId: number;
	messages: Message[];
	createdAt: string;
	updatedAt: string;
}

// // HTMX-related types
// interface HTMXEvent extends Event {
// 	detail: {
// 		elt: HTMLElement;
// 		target: HTMLElement;
// 		path: string;
// 	};
// }
interface HTMXEventDetail {
	elt: HTMLElement;
	target: HTMLElement;
	path: string;
}

type HTMXEvent = CustomEvent<HTMXEventDetail>;

// Utility types
type ElementId =
	| 'messages'
	| 'chat-list'
	| 'message-input'
	| 'sidebar'
	| 'toggle-sidebar'
	| 'toggle-theme';

// Export all types
export type { User, Message, Chat, HTMXEvent, ElementId };
// export type { User, Message, Chat, ElementId };

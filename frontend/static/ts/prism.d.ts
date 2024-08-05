// prism.d.ts
declare namespace Prism {
	function highlight(code: string, grammar: any, language: string): string;
	function highlightAllUnder(element: Element): void;

	const languages: {
		[key: string]: any;
		plain: any;
	};
}

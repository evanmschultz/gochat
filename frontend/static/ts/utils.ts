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

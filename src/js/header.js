import $ from "jquery";

export default function header() {
	const $toggle = $('#ToggleNav');
	const $mobileMenu = $('#MobileNav');
	const $mainMenu = $('#MainNav');
	const $mainLinks = $mainMenu.find('.header__list-item');

	// Triggers menu drawer
	$toggle.on('click', () => {
		$mobileMenu.toggleClass('active');
	});

	// $mainLinks.on('click', function() {
	// 	$mainMenu.find('.header__list-item.active').removeClass('active');
	// 	$(this).addClass('active');
	// });
}
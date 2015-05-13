// Responsive Light Box
$(document).ready(function() {
	$('.popup-video').magnificPopup({
		disableOn: 0,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,

		fixedContentPos: false
	});

	


});

$(window).scroll(function() {
	if ($(this).scrollTop() > 90) {
	    $(".down-button").fadeOut();
	}

	if ($(this).scrollTop() < 90) {
	    $(".down-button").fadeIn();
	}

});


// Animations & Parallax
$(document).ready(function() {
	var controller = $.superscrollorama();

	// Intro Animations
	TweenMax.from( $('.in-anim-1'), .8, {css:{left:'10%', opacity:'0'}, ease:Quad.easeInOut});
	TweenMax.from( $('.in-anim-2'), .8, {css:{right:'10%', opacity:'0'}, ease:Quad.easeInOut});

	TweenMax.from( $('.in-anim-3'), 1.4, {css:{left:'10%', opacity:'0'}, ease:Quad.easeInOut});
	TweenMax.from( $('.in-anim-4'), 1.4, {css:{right:'10%', opacity:'0'}, ease:Quad.easeInOut});
	
	// Responsive Animations
	controller.addTween('#fly-it-top', TweenMax.from( $('#fly-it-top'), 1.8, {css:{bottom:'100%', opacity:'0'}, ease:Quad.easeInOut}));

	// From Right/Left Animation

	// Section 2
	controller.addTween('#section-2', TweenMax.from( $('#fly-it-left'), .8, {css:{right:'10%', opacity:'0'}, ease:Quad.easeInOut}), -50);
	controller.addTween('#section-2', TweenMax.from( $('#fly-it-right'), .8, {css:{left:'10%', opacity:'0'}, ease:Quad.easeInOut}), -50);

	// Section 3
	controller.addTween('#section-3', TweenMax.from( $('#fly-it-left1'), .8, {css:{right:'15%', opacity:'0'}, ease:Quad.easeInOut}), 0, -250);
	controller.addTween('#section-3', TweenMax.from( $('#fly-it-right1'), .8, {css:{left:'15%', opacity:'0'}, ease:Quad.easeInOut}), 0, -250);
	
	// Section 4
	controller.addTween('#section-4', TweenMax.from( $('#fly-it-right2'), 1.5, {css:{left:'20%', opacity:'0'}, ease:Quad.easeInOut}), 0, -300);
	
	// Color Bar
	controller.addTween('#section-4', TweenMax.from( $('.fly-in-one'), .8, {css:{right:'35%', opacity:'0'}, ease:Quad.easeInOut}), 0, -150);
	controller.addTween('#section-4', TweenMax.from( $('.fly-in-two'), 1, {css:{right:'35%', opacity:'0'}, ease:Quad.easeInOut}), 0, -100);
	controller.addTween('#section-4', TweenMax.from( $('.fly-in-three'), 1.2, {css:{right:'35%', opacity:'0'}, ease:Quad.easeInOut}),-60);
	controller.addTween('.fly-in-three', TweenMax.from( $('.fly-in-four'), 1.4, {css:{right:'35%', opacity:'0'}, ease:Quad.easeInOut}),-70);
	controller.addTween('.fly-in-four', TweenMax.from( $('.fly-in-five'), 1.6, {css:{right:'35%', opacity:'0'}, ease:Quad.easeInOut}),-70);
	controller.addTween('.fly-in-four', TweenMax.from( $('.fly-in-six'), 1.9, {css:{right:'35%', opacity:'0'}, ease:Quad.easeInOut}),-70);
	controller.addTween('.fly-in-five', TweenMax.from( $('.fly-in-seven'), 1.4, {css:{right:'35%', opacity:'0'}, ease:Quad.easeInOut}),-70);
	controller.addTween('.fly-in-six', TweenMax.from( $('.fly-in-eight'), .8, {css:{right:'35%', opacity:'0'}, ease:Quad.easeInOut}),-70);
	controller.addTween('.fly-in-seven', TweenMax.from( $('.fly-in-nine'), 1.2, {css:{right:'35%', opacity:'0'}, ease:Quad.easeInOut}),-70);
	
	// Section 5
	controller.addTween('#section-5', TweenMax.from( $('#fly-it-right3'), .8, {css:{left:'10%', opacity:'0'}, ease:Quad.easeInOut}), 0, -200);
	controller.addTween('#section-5', TweenMax.from( $('#fly-it-left3'), .8, {css:{right:'10%', opacity:'0'}, ease:Quad.easeInOut}), 0, -200);


	// Responsive Color Bar
	controller.addTween('#fly-it-bars', TweenMax.from( $('#fly-it-bars'), 1, {css:{right:'10%', opacity:'0'}, ease:Quad.easeInOut}),-170);

});
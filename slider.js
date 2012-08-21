$(document).ready(function() {

	var slideslistWidth = $('.slideslist').outerWidth(),
		slideWidth = $('.slide').outerWidth(),
		totalSlides = 3,
		currentSlide = 0,
		loop = true,
		scrollIncrement = 1,
		scrollSpeed = 800,
		showDuration = 4000,
		runSlider;


	(function sliderInit() {

		// Set the necessary basic styles, if not present
		if ($('#slides').css('position') != 'relative') {
			$('#slides').css({'position':'relative'});
			//width: 100px; height: 100px; overflow: hidden;
		}
		if ($('#slideslist').css('position') != 'absolute') {
			$('#slideslist').css({'position':'absolute'});
			//width: 300px; top: 0; left: 0;
		}

		sliderRun();
		// scrollSlider(1, false);
	})();

	function sliderRun() {
		scrollSlider('next', false);
	};

	function sliderRunStart() {
		if (runSlider !== null) { sliderRunStop(); }
		runSlider = setInterval(sliderRun, showDuration);
		console.log('interval set: '+runSlider);
	}
	function sliderRunStop() {
		clearInterval(runSlider);
		console.log('interval cleared: '+runSlider);
		runSlider = null;
	}


	function scrollSlider(slide, click) {

		sliderRunStop();
		var newSlide = slide,
			posNew;

		if (typeof(newSlide) != 'number') {
			switch (newSlide) {
				case 'prev':
					if (loop === true) {
						// Loop back to last slide
						newSlide = (currentSlide - scrollIncrement < 1)? totalSlides : currentSlide - scrollIncrement;
						//if (currentSlide == 1) console.log('Loop back to last slide');
					}
					else {
						// Stop at first slide
						newSlide = Math.max(1, currentSlide - scrollIncrement);
						//if (currentSlide == totalSlides) console.log('Stop at first slide');
					}
					break;

				case 'next':
					if (loop === true) {
						// Loop back to first slide
						newSlide = (currentSlide + scrollIncrement > totalSlides)? 1 : currentSlide + scrollIncrement;
						//if (currentSlide == totalSlides) console.log('Loop back to first slide');
					}
					else {
						// Stop at last slide
						newSlide = Math.min(totalSlides, currentSlide + scrollIncrement);
						//if (currentSlide == 1) console.log('Stop at last slide');
					}
					break;

				default:
					newSlide = newSlide.split('-').pop();
					break;
			}
		}
		/*else {
			newSlide -= 1;
		}*/


		// Set new (left) position
		posNew = -(newSlide-1) * slideWidth;

		// Bounce effect at first/last slide when not looping
		if (loop === false && click === true && (
				(slide == 'prev' && currentSlide === 1) ||
				(slide == 'next' && currentSlide === totalSlides)
			) ) {
			if (slide == 'prev' && currentSlide === 1) {
				bounceWidth = -8;
			}
			if (slide == 'next' && currentSlide === totalSlides) {
				bounceWidth = 8;
			}

			posNew -= bounceWidth;
			$('#slideslist').animate({'left': posNew}, 50, function() {
				posNew += bounceWidth;
				$('#slideslist').animate({'left': posNew}, 200);
			});
		}
		else {
			// Set css classes of navigation items
			$('.slider-nav-item').removeClass('active');
			$('#slider-nav-item-'+(newSlide)).addClass('active');

			// Animate and update current slide, reset the interval
			currentSlide = newSlide;
			$('#slideslist').stop(true).animate({'left': posNew}, scrollSpeed, function() {
				// Clear interval when not looping and on last slide
				if (loop === false && currentSlide == totalSlides) {
					sliderRunStop();
				}
				else {
					sliderRunStart();
				}
			});
		}

				// Clear interval when not looping and on last slide
				if (loop === false && currentSlide == totalSlides) {
					sliderRunStop();
				}

	};

	$('#slider-start').click(function() {
		sliderRunStart();
		return false;
	});
	$('#slider-stop').click(function() {
		sliderRunStop();
		return false;
	});

	$('#slider-prev').click(function() {
		scrollSlider('prev', true);
		return false;
	});
	$('#slider-next').click(function() {
		scrollSlider('next', true);
		return false;
	});

	$('.slider-nav-item').click(function() {
		scrollSlider($(this).attr('id'), true);
		return false;
	});



	$('#slides').hover(
		function() {
			console.log('#slides mouse over');
			sliderRunStop();
		},
		function() {
			console.log('#slides mouse out');
			sliderRunStart();
		}
	);

	/*
	// NEEDS DEBUGGING!
	$(window).blur(function() {
		console.log('Window blur');
		sliderRunStop();
	});
	$(window).focus(function() {
		console.log('Window focus');
		sliderRunStart();
	});
	*/

});

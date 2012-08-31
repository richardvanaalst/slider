$(document).ready(function() {

	var Slider = [
		slideWidth = $(".slide").outerWidth(),
		totalSlides = $(".slide").length,
		currentSlide = 0,
		loop = (window.loop != undefined)? window.loop : true,
		scrollIncrement = 1,
		scrollSpeed = 600,
		showDuration = 1500,
		sliderRunInterval = false,
		isPlaying = false,
		debug = (window.debug != undefined)? window.debug : false
	];
		console.log("Slider: "+Slider);

	(function sliderInit() {

		// Set the necessary basic styles to the slider, if not present
		if ($("#slider-content").css("position") != "relative") {
			$("#slider-content").css({"position": "relative"});
			// ADD: width: 100px; height: 100px; overflow: hidden;
		}
		if ($("#slides").css("position") != "absolute") {
			$("#slides").css({"position": "absolute"});
			// ADD: width: 300px; top: 0; left: 0;
		}
		$("#slides").css({"width": totalSlides*slideWidth+"px"});

		// Add play-pause toggle event
		if ($("#slider-playpause")) {
			$("#slider-playpause").click(function() {
				sliderPlayPause();
				return false;
			});
		}

		// Add scroll to previous/next click event
		if ($("#slider-prev")) {
			$("#slider-prev").click(function() {
				scrollSlider("prev", true);
				return false;
			});
		}
		if ($("#slider-next")) {
			$("#slider-next").click(function() {
				scrollSlider("next", true);
				return false;
			});
		}

		// Add scroll to previous/next click event
		if ($(".slider-nav-item")) {
			$(".slider-nav-item").click(function() {
				scrollSlider($(this).attr("id"), true);
				return false;
			});
		}


		/* TODO: doesnot work correctly
		$("#slider-content").hover(
			function() {
				if (debug) console.log("#slider-content mouse over");
				sliderStop();
			},
			function() {
				if (debug) console.log("#slider-content mouse out");
				sliderPlay();
			}
		);
		*/

		/* TODO: doesnot work this way
		$(window).blur(function() {
			if (debug) console.log("Window blur");
			sliderStop();
		});
		$(window).focus(function() {
			if (debug) console.log("Window focus");
			sliderPlay();
		});
		*/

		// Activate slider and go to first slide
		scrollSlider(1, false);
	})();


	function sliderRun() {
		scrollSlider("next", false);
	};

	function sliderRunReset() {
		if (typeof sliderRunInterval == "number") {
			clearInterval(sliderRunInterval);
				if (debug) console.log("interval cleared: "+sliderRunInterval);
			sliderRunInterval = false;
		}
	};


	function sliderPlay() {
		sliderRunReset();
		sliderRunInterval = setInterval(sliderRun, showDuration);
			if (debug) console.log("interval set: "+sliderRunInterval);

		$("#slider-playpause").removeClass("play").addClass("pause");
		isPlaying = true;
	};

	function sliderPause() {
		sliderRunReset();

		$("#slider-playpause").removeClass("pause").addClass("play");
		isPlaying = false;
	};

	function sliderStop() {
		sliderRunReset();

		$("#slider-playpause").removeClass("pause").addClass("play");
		isPlaying = false;
	};

	function sliderPlayPause() {
		if (isPlaying === true) {
			sliderPause();
		}
		else {
			sliderPlay();
		}
	};


	function scrollSlider(slide, click) {

		// sliderRunReset();
		var newSlide = slide,
			posNew;

		if (typeof newSlide != "number") {
			switch (newSlide) {

				case "prev":
					switch (loop) {
						// Add last slide before first
						case true:
							//	if (debug) if (currentSlide == 1) console.log("Add last slide before first");
							//break;

						// Loop back to last slide
						case "rewind":
							newSlide = (currentSlide - scrollIncrement < 1)? totalSlides : currentSlide - scrollIncrement;
								if (debug) if (currentSlide == 1) console.log("Loop back to last slide");
							break;

						// Stop at first slide
						case false:
							newSlide = Math.max(1, currentSlide - scrollIncrement);
								if (debug) if (currentSlide == 1) console.log("Stop at first slide");
							break;
					}
					break;

				case "next":
					switch (loop) {
						// Add first slide after last
						case true:
							//	if (debug) if (currentSlide == totalSlides) console.log("Add first slide after last");
							//break;

						// Loop back to first slide
						case "rewind":
							newSlide = (currentSlide + scrollIncrement > totalSlides)? 1 : currentSlide + scrollIncrement;
								if (debug) if (currentSlide == totalSlides) console.log("Loop back to first slide");
							break;

						// Stop at last slide
						case false:
								if (debug) console.log("Will stop at last slide");
							newSlide = Math.min(totalSlides, currentSlide + scrollIncrement);
								if (debug) if (currentSlide == totalSlides) console.log("Stop at last slide");
							break;
					}
					break;

				default:
					// Pop ID of slide: "#slider-nav-item-1"
					newSlide = newSlide.split("-").pop();
					break;
			}
		}

		// Set new (left) position
		posNew = -(newSlide-1) * slideWidth;
			if (debug) console.log("currentSlide: "+currentSlide+ ", newSlide: "+newSlide+ ", posNew: "+posNew);

		// Bounce effect at first/last slide when not looping
		if (loop === false && click === true && (
				(slide == "prev" && currentSlide === 1) ||
				(slide == "next" && currentSlide === totalSlides)
			) ) {
			if (slide == "prev" && currentSlide === 1) {
				bounceWidth = -8;
			}
			if (slide == "next" && currentSlide === totalSlides) {
				bounceWidth = 8;
			}

			posNew -= bounceWidth;
			$("#slides").animate({"left": posNew}, 50, function() {
				posNew += bounceWidth;
				$("#slides").animate({"left": posNew}, 200);
			});
		}
		else {
			// Set css classes of navigation items
			$(".slider-nav-item").removeClass("active");
			$("#slider-nav-item-"+(newSlide)).addClass("active");

			// Animate and update current slide, reset the interval
			currentSlide = newSlide;
				if (debug) console.log("currentSlide: "+currentSlide+ ", newSlide: "+newSlide+ ", posNew: "+posNew);
			$("#slides").stop(true).animate({"left": posNew}, scrollSpeed, function() {
				// Clear interval when not looping and on last slide
				/*if (loop === false && currentSlide == totalSlides) {
					sliderStop();
				}
				else {
					sliderPlay();
				}*/
			});
		}

		// Clear interval when not looping and on last slide
		if (loop === false && currentSlide == totalSlides) {
			sliderStop();
		}
		else {
			sliderPlay();
		}
	};

});

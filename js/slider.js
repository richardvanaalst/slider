$(document).ready(function() {
    Slider.init();
});
var Slider = new Object();
Slider.var = {
    	totalSlides: $(".slide").length,
		slideWidth: $(".slide").outerWidth(),
		currentSlide: 0,
		scrollIncrement: 1,
		scrollSpeed: 600,
		showDuration: 2000,
		sliderRunTimer: false,
		isPlaying: false,

		/* loop: "continuous", "revert", "rewind", true, false */
		autoplay: (window.autoplay != undefined)? window.autoplay : true,
		loop: (window.loop != undefined)? window.loop : true,
		debug: (window.debug != undefined)? window.debug : false,

		/* When using paging */
		navHeight: $("#slider-nav-items").outerHeight(),
		slidesPerPage: 5,
		currentPage: 0,
		navPos: 0
	};
Slider.var.totalPages= Math.ceil(Slider.var.totalSlides / Slider.var.slidesPerPage);

Slider.sliderRun = function() {
		Slider.scrollSlider("next", false);
	};

Slider.sliderRunReset = function() {
		clearTimeout(Slider.var.sliderRunTimer);
			if (Slider.var.debug) console.log("timeout cleared: "+Slider.var.sliderRunTimer);
		Slider.var.sliderRunTimer = false;
	};


Slider.sliderPlay = function() {
			if (Slider.var.debug) console.log("sliderPlay");
		if (typeof Slider.var.sliderRunTimer == "number") {
			Slider.sliderRunReset();
		}
		Slider.var.sliderRunTimer = setTimeout(Slider.sliderRun, Slider.var.showDuration);
			if (Slider.var.debug) console.log("timeout set: "+Slider.var.sliderRunTimer);
		$("#slider-playpause").removeClass("pause").addClass("play");
		Slider.var.isPlaying = true;
	};

Slider.sliderPause = function() {
			if (Slider.var.debug) console.log("sliderPause");
		Slider.sliderRunReset();
		$("#slider-playpause").removeClass("play").addClass("pause");
		Slider.var.isPlaying = false;
	};

Slider.sliderCycle = function() {
		// Clear interval when not looping and on last slide
		if (Slider.var.isPlaying === false || (Slider.var.loop === false && Slider.var.currentSlide == Slider.var.totalSlides)) {
			Slider.sliderPause();
		}
		else {
			Slider.sliderPlay();
		}
	};


Slider.scrollSlider = function(slide, click) {

		// sliderRunReset();
		var newSlide = 0,
			posNew = 0;

		if (typeof slide != "number") {
			switch (slide) {

				case "prev":
					switch (Slider.var.loop) {
						// Stop at first slide
						case false:
							newSlide = Math.max(1, Slider.var.currentSlide - Slider.var.scrollIncrement);
							Slider.sliderRunReset();
								if (Slider.var.debug) if (Slider.var.currentSlide == 1) console.log("Stop at first slide");
							break;

						// Rewind to last slide
						case true:
						case "rewind":
						default:
							newSlide = (Slider.var.currentSlide - Slider.var.scrollIncrement < 1)? Slider.var.totalSlides : Slider.var.currentSlide - Slider.var.scrollIncrement;
								if (Slider.var.debug) if (Slider.var.currentSlide == 1) console.log("Rewind to last slide");
							break;

						// Add last slide before first
						case "continuous":
							newSlide = 0;
								if (Slider.var.debug) if (Slider.var.currentSlide == 1) console.log("Add last slide before first");
							break;

						// Reverse direction from first to last slide and visa versa
						case "reverse":
							newSlide = 0;
								if (Slider.var.debug) if (Slider.var.currentSlide == 1) console.log("Reverse direction");
							break;
					}
					break;

				case "next":
					switch (Slider.var.loop) {
						// Stop at last slide
						case false:
							newSlide = Math.min(Slider.var.totalSlides, (Slider.var.currentSlide + Slider.var.scrollIncrement));
								if (Slider.var.debug) if (newSlide == Slider.var.totalSlides) console.log("Stop at last slide");
							break;

						// Rewind to first slide
						case true:
						case "rewind":
						default:
							newSlide = (Slider.var.currentSlide + Slider.var.scrollIncrement > Slider.var.totalSlides)? 1 : Slider.var.currentSlide + Slider.var.scrollIncrement;
								if (Slider.var.debug) if (newSlide == Slider.var.totalSlides) console.log("Rewind to first slide");
							break;

						// Add first slide after last
						case "continuous":
							newSlide = 0;
								if (Slider.var.debug) if (newSlide == Slider.var.totalSlides) console.log("Add first slide after last");
							break;

						// Reverse direction from last to first slide and visa versa
						case "reverse":
							newSlide = 0;
								if (Slider.var.debug) if (newSlide == Slider.var.totalSlides) console.log("Reverse direction");
							break;
					}
					break;

				default:
					// Get ID nr of slide from a id: "#slider-nav-item-1"
					// newSlide = newSlide.split("-").pop();
					// Get ID nr of slide from a href: "#slide1"
					newSlide = slide.split("#slide").pop();
					break;
			}
		}
		else {
			newSlide = slide;
		}


		// Set paging position
		Slider.scrollSliderNav(newSlide, false);


		// Set new (left) position
		posNew = -(newSlide-1) * Slider.var.slideWidth;
			if (Slider.var.debug) console.log("currentSlide (old): "+Slider.var.currentSlide, ", newSlide: "+newSlide, ", posNew: "+posNew);


		// Bounce effect at first/last slide when not looping
		if (Slider.var.loop === false && click === true && (
				(slide == "prev" && Slider.var.currentSlide === 1) ||
				(slide == "next" && Slider.var.currentSlide === Slider.var.totalSlides)
			) ) {
			if (slide == "prev" && Slider.var.currentSlide === 1) {
				Slider.var.bounceWidth = -8;
			}
			if (slide == "next" && Slider.var.currentSlide === Slider.var.totalSlides) {
				Slider.var.bounceWidth = 8;
			}

			posNew -= Slider.var.bounceWidth;
			$("#slides").animate({"left": posNew}, 50, function() {
				posNew += Slider.var.bounceWidth;
				$("#slides").animate({"left": posNew}, 200, function() {
					Slider.sliderCycle();
				});
			});
		}
		// Animate to new slide
		else {
			// Set css classes of navigation items
			$(".slider-nav-item").removeClass("active");
			$("#slider-nav-item-"+(newSlide)).addClass("active");

			// Animate and update current slide
			currentSlide = parseInt(newSlide);
				if (Slider.var.debug) console.log("currentSlide (new): "+currentSlide);
			$("#slides").stop(true).animate({"left": posNew}, Slider.var.scrollSpeed, function() {
				Slider.sliderCycle();
			});
		}

	};


Slider.scrollSliderNav = function(input, click) {

		var newPage = "";

		// Scroll to clicked page
		if (click === true) {
			newPage = input.split("#page").pop();
		}
		// Scroll by checking the current slide
		else {
			newPage = Math.floor((input-1) / Slider.var.slidesPerPage) + 1;
		}

		navPos = -((newPage-1) * Slider.var.navHeight / Slider.var.totalPages);
		currentPage = newPage;
			if (Slider.var.debug) console.log(currentPage, newPage, navPos)

		$("#slider-nav-items").animate({"top": navPos}, {"queue": false});
		// queue=false weg, check of 1 slide voor of na paginagrens zit

		// Set css classes of navigation items
		$(".slider-nav-pages-item").removeClass("active");
		$("#slider-nav-pages-item-"+newPage).addClass("active");
	};


	Slider.init=function() {
		/* Check which ones are really necessary
		// Set the necessary basic styles to the slider, if not present
		if ($("#slider-content").css("position") != "relative") {
			$("#slider-content").css({"position": "relative"});
			// ADD: width: 100px; height: 100px; overflow: hidden;
		}
		if ($("#slides").css("position") != "absolute") {
			$("#slides").css({"position": "absolute"});
			// ADD: width: 300px; top: 0; left: 0;
		}
		*/

		// Set width of slides list ul#slides to width of total slides
		$("#slides").css({"width": Slider.var.totalSlides*Slider.var.slideWidth+"px"});

		// Clear float of every first navigation item per page
		$(".slider-nav-item:nth-child("+Slider.var.slidesPerPage+"n+1)").css({"clear": "left"});


		// Add play-pause toggle event
		if ($("#slider-playpause")) {
			$("#slider-playpause").click(function() {
				if (Slider.var.isPlaying === true) {
					Slider.sliderPause();
				}
				else {
					Slider.sliderPlay();
				}
				return false;
			});
		}

		// Add scroll to previous/next click event
		if ($("#slider-prev")) {
			$("#slider-prev").click(function() {
				Slider.scrollSlider("prev", true);
				return false;
			});
		}
		if ($("#slider-next")) {
			$("#slider-next").click(function() {
				Slider.scrollSlider("next", true);
				return false;
			});
		}

		// Add scroll to previous/next click event
		if ($(".slider-nav-item a")) {
			$(".slider-nav-item a").click(function() {
				// scrollSlider($(this).attr("id"), true);
				Slider.scrollSlider($(this).attr("href"), true);
				return false;
			});
		}

		// Add scroll to previous/next click event
		if ($(".slider-nav-pages-item a")) {
			$(".slider-nav-pages-item a").click(function() {
				// scrollSlider($(this).attr("id"), true);
				Slider.scrollSliderNav($(this).attr("href"), true);
				return false;
			});
		}


		/* TODO: does not work correctly
		$("#slider-content").hover(
			function() {
				if (debug) console.log("#slider-content mouse over");
				sliderPause();
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
			sliderPause();
		});
		$(window).focus(function() {
			if (debug) console.log("Window focus");
			sliderPlay();
		});
		*/

		// Go to first slide and activate slider
		Slider.scrollSlider(1, false);
		if (Slider.var.autoplay == true) {
			Slider.sliderPlay();
		}
	};



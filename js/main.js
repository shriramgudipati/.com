jQuery(document).ready(function(){
	var intro = $('.cd-intro-block');
	// Remove projectsContainer and singleProjectContent variables - no longer needed

	// Remove show-projects functionality - content is now directly integrated
	// Projects content is now part of the main page

	// Messenger text animation for anib element
	var Messenger = function(el) {
		'use strict';
		var m = this;

		m.init = function() {
			m.codeletters = "!^_&#*+%?£@§$";
			m.message = 0;
			m.current_length = 0;
			m.fadeBuffer = false;
			m.messages = [
				'Robots',
				'Neural Networks',
				'Websites',
				'Drones',
				'Control Systems',
			];

			setTimeout(m.animateIn, 100);
		};

		m.generateRandomString = function(length) {
			var random_text = '';
			while (random_text.length < length) {
				random_text += m.codeletters.charAt(Math.floor(Math.random() * m.codeletters.length));
			}

			return random_text;
		};

		m.animateIn = function() {
			if (m.current_length < m.messages[m.message].length) {
				m.current_length = m.current_length + 2;
				if (m.current_length > m.messages[m.message].length) {
					m.current_length = m.messages[m.message].length;
				}

				var message = m.generateRandomString(m.current_length);
				$(el).html(message);

				setTimeout(m.animateIn, 20);
			} else {
				setTimeout(m.animateFadeBuffer, 20);
			}
		};

		m.animateFadeBuffer = function() {
			if (m.fadeBuffer === false) {
				m.fadeBuffer = [];
				for (var i = 0; i < m.messages[m.message].length; i++) {
					m.fadeBuffer.push({
						c: (Math.floor(Math.random() * 12)) + 1,
						l: m.messages[m.message].charAt(i)
					});
				}
			}

			var do_cycles = false;
			var message = '';

			for (var i = 0; i < m.fadeBuffer.length; i++) {
				var fader = m.fadeBuffer[i];
				if (fader.c > 0) {
					do_cycles = true;
					fader.c--;
					message += m.codeletters.charAt(Math.floor(Math.random() * m.codeletters.length));
				} else {
					message += fader.l;
				}
			}

			$(el).html(message);

			if (do_cycles === true) {
				setTimeout(m.animateFadeBuffer, 50);
			} else {
				setTimeout(m.cycleText, 2000);
			}
		};

		m.cycleText = function() {
			m.message = m.message + 1;
			if (m.message >= m.messages.length) {
				m.message = 0;
			}

			m.current_length = 0;
			m.fadeBuffer = false;

			setTimeout(m.animateIn, 200); // Start the next word transition immediately
		};

		m.init();
	};
	
	// Initialize the Messenger animation on the anib element
	new Messenger('#anib');
		
	// Show filter container functionality removed - projects are now integrated
	
	// Filter projects when category or skill selection changes
	$("#categorySelect, #skillsSelect").change(function() {
		filterProjects();
	});
	
	function filterProjects() {
		console.log("Filtering projects...");
		var selectedCategory = $("#categorySelect").val();
		var selectedSkill = $("#skillsSelect").val();
		
		console.log("Selected category:", selectedCategory, "Selected skill:", selectedSkill);
		
		// Filter and show/hide projects
		$(".cd-slider li").each(function() {
			var projectCategory = $(this).attr("data-category");
			var projectSkill = $(this).attr("data-skill");
			
			var categoryMatch = selectedCategory === "all" || projectCategory === selectedCategory;
			var skillMatch = selectedSkill === "all" || projectSkill === selectedSkill;
			
			if (categoryMatch && skillMatch) {
				$(this).removeClass('filtered').css('display', '');
				console.log("Showing project:", $(this).find("h2").text());
			} else {
				$(this).addClass('filtered').css('display', 'none');
				console.log("Hiding project:", $(this).find("h2").text());
			}
		});
		
		// Set the first visible project as current if the current one is filtered
		if($(".cd-slider li.current").hasClass('filtered')) {
			$(".cd-slider li.current").removeClass('current');
			$(".cd-slider li:not(.filtered):first").addClass('current');
		}
		
		// Update navigation buttons
		updateNavigation();
	}
	
	function updateNavigation() {
		var visibleProjects = $(".cd-slider li:not(.filtered)");
		var currentIndex = visibleProjects.index($(".cd-slider li.current"));
		
		// Update prev button
		if(currentIndex <= 0) {
			$(".cd-slider-navigation .prev").addClass("inactive");
		} else {
			$(".cd-slider-navigation .prev").removeClass("inactive");
		}
		
		// Update next button
		if(currentIndex >= visibleProjects.length - 1) {
			$(".cd-slider-navigation .next").addClass("inactive");
		} else {
			$(".cd-slider-navigation .next").removeClass("inactive");
		}
	}
	
	function initializeParticles(containerId) {
		particlesJS(containerId, {
			"particles": {
				"number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
				"color": { "value": "#000000" },
				"shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
				"opacity": { "value": 0.5, "random": false },
				"size": { "value": 3, "random": true },
				"line_linked": { "enable": true, "distance": 150, "color": "#000000", "opacity": 0.4, "width": 1 },
				"move": { "enable": true, "speed": 6, "direction": "none" }
			},
			"interactivity": {
				"detect_on": "canvas",
				"events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" } },
				"modes": { "repulse": { "distance": 100, "duration": 0.4 }, "push": { "particles_nb": 4 } }
			},
			"retina_detect": true
		});
	}

	// Initialize particles for each wrapper
	initializeParticles('particles-intro');
	initializeParticles('particles-projects');
	initializeParticles('particles-content');
	
	// Handle home button click in sidebar
	$('.home-link').on('click', function(event){
		event.preventDefault();
		
		// Scroll to top to show intro block
		$('body,html').animate({
			'scrollTop': 0
		}, 500);
	});
	
	// Clear all existing event handlers to avoid conflicts
	$(document).off('click', '[data-action="toggle-resume"]');
	$(document).off('click', '.resume-toggle');

	// Handle Projects direct link - scroll to projects section
	$('.project-link').on('click', function(event){
	    event.preventDefault();
	    
	    // Scroll to the projects section (now integrated into the page)
	    const projectsSection = $('.category-carousel-container');
	    if (projectsSection.length) {
	        $('body,html').animate({
	            'scrollTop': projectsSection.offset().top - 50
	        }, 500);
	    }
	});
	
	// Remove old event listeners for Resume (now using separate page)
	$(document).off('click', '[data-action="toggle-resume"]');
	$(document).off('click', '.resume-toggle');
	
	
	// Function to adjust PDF container size to match letter page proportions
	function adjustPdfContainerSize() {
	    // Get the container width
	    var containerWidth = $('.resume-pdf-container').width();
	    
	    // Calculate height based on letter page ratio (8.5:11)
	    // US Letter aspect ratio is approximately 1:1.294
	    var letterHeight = containerWidth * 1.294;
	    
	    // Set a maximum height to ensure it fits well on most screens
	    var maxHeight = $(window).height() * 0.8;  // 80% of viewport height
	    var height = Math.min(letterHeight, maxHeight);
	    
	    // Update the height of the PDF object
	    $('.resume-pdf-container object').css('height', height + 'px');
	}
	
	// Adjust PDF size on window resize
	$(window).on('resize', function() {
	    if ($('.resume-section').hasClass('is-visible')) {
	        adjustPdfContainerSize();
	    }
	});
});
jQuery(document).ready(function(){
	var intro = $('.cd-intro-block'),
		projectsContainer = $('.cd-projects-wrapper'),
		singleProjectContent = $('.cd-project-content');

	//show the projects slider if user clicks the show-projects button
	intro.on('click', 'a[data-action="show-projects"]', function(event) {
		event.preventDefault();
		intro.addClass('projects-visible');
		projectsContainer.addClass('projects-visible');
		//animate single project - entrance animation
		setTimeout(function(){
			showProjectPreview(projectsSlider.children('li').eq(0));
		}, 200);
	});

	intro.on('click', function(event) {
		//projects slider is visible - hide slider and show the intro panel
		if( intro.hasClass('projects-visible') && !$(event.target).is('a[data-action="show-projects"]') ) {
			intro.removeClass('projects-visible');
			projectsContainer.removeClass('projects-visible');
		}
	});

	//select a single project - open project-content panel
	projectsContainer.on('click', '.cd-slider a', function(event) {
		event.preventDefault();
		singleProjectContent.addClass('is-visible');
	});

	//close single project content
	singleProjectContent.on('click', '.close', function(event){
		event.preventDefault();
		singleProjectContent.removeClass('is-visible');
	});

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
		
	// Show filter container when projects are visible
	$('.cd-btn').on('click', function() {
		if($(this).attr('data-action') === 'show-projects') {
			// Add a small delay to ensure filters are visible after transition
			setTimeout(function() {
				$('.filter-container').addClass('is-visible');
			}, 300);
		}
	});
	
	// Add is-visible class to filter container initially if projects are already visible
	if($('.cd-projects-wrapper').hasClass('is-visible')) {
		$('.filter-container').addClass('is-visible');
	}
	
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
		
		// If projects are visible, hide them and show intro block
		if($('.cd-project-content').hasClass('is-visible')) {
			$('.cd-project-content').removeClass('is-visible');
		}
		
		// If projects wrapper is visible, hide it and show intro block
		if($('.cd-intro-block').hasClass('projects-visible')) {
			$('.cd-intro-block').removeClass('projects-visible');
		}
		
		// Scroll to top to show intro block
		$('body,html').animate({
			'scrollTop': 0
		}, 500);
	});
	
	// Clear all existing event handlers for About Me toggles
	$(document).off('click', '.about-me-toggle');
	$(document).off('click', '.sidebar-about');
	$(document).off('click', '[data-action="toggle-about"]');
	$(document).off('click', '[data-action="toggle-about-and-navigate"]');

	// Single clean handler for About Me toggle - this replaces all the above handlers
	$(document).on('click', '[data-action="toggle-about"]', function(event) {
	  event.preventDefault();
	  event.stopPropagation();
	  
	  var aboutSection = $('.about-me-section');
	  
	  // Simple toggle functionality
	  if (aboutSection.hasClass('active')) {
	    aboutSection.removeClass('active');
	    $('.about-me-toggle').removeClass('active');
	  } else {
	    aboutSection.addClass('active');
	    $('.about-me-toggle').addClass('active');
	    
	    // If projects are visible, hide them when showing About Me
	    if($('.cd-intro-block').hasClass('projects-visible')) {
	      $('.cd-intro-block').removeClass('projects-visible');
	      $('.cd-projects-wrapper').removeClass('projects-visible');
	    }
	    
	    // If project content is visible, hide it
	    if($('.cd-project-content').hasClass('is-visible')) {
	      $('.cd-project-content').removeClass('is-visible');
	    }
	    
	    // Ensure we're at the top of the page
	    $('body,html').animate({
	      'scrollTop': 0
	    }, 300);
	  }
	});

	// Keep the close button handler simple
	$(document).off('click', '.about-me-close');
	$(document).on('click', '.about-me-close', function(event) {
	  event.preventDefault();
	  event.stopPropagation();
	  
	  $('.about-me-section').removeClass('active');
	  $('.about-me-toggle').removeClass('active');
	});
	
	// Handle Projects direct link
	$('.project-link').on('click', function(event){
	    event.preventDefault();
	    
	    // If project content is visible, hide it first
	    if($('.cd-project-content').hasClass('is-visible')) {
	        $('.cd-project-content').removeClass('is-visible');
	    }
	    
	    // Show the projects section (similar to the "Show projects" button)
	    if(!$('.cd-intro-block').hasClass('projects-visible')) {
	        $('.cd-intro-block').addClass('projects-visible');
	        $('.cd-projects-wrapper').addClass('projects-visible');
	    }
	    
	    // Scroll to the projects section
	    $('body,html').animate({
	        'scrollTop': $(window).height()
	    }, 500);
	});
});

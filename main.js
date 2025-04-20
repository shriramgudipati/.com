jQuery(document).ready(function () {
	// Ensure all resources (stylesheets, images, etc.) are fully loaded
	$(window).on("load", function () {
		var intro = $(".cd-intro-block"),
			projectsContainer = $(".cd-projects-wrapper"),
			projectsSlider = projectsContainer.children(".cd-slider"),
			singleProjectContent = $(".cd-project-content"),
			sliderNav = $(".cd-slider-navigation");

		var resizing = false;

		// Check if projectsSlider exists before proceeding
		if (!projectsSlider.length) {
			console.error("projectsSlider is not defined or missing in the DOM.");
			return;
		}

		// Set slider container width
		setSliderContainer();
		$(window).on("resize", function () {
			if (!resizing) {
				(!window.requestAnimationFrame ? setSliderContainer() : window.requestAnimationFrame(setSliderContainer));
				resizing = true;
			}
		});

		// Show the projects slider when the "Show projects" button is clicked
		intro.on("click", 'a[data-action="show-projects"]', function (event) {
			event.preventDefault();
			intro.addClass("projects-visible");
			projectsContainer.addClass("projects-visible");
		});

		// Hide the projects slider and show the intro panel
		intro.on("click", function (event) {
			if (intro.hasClass("projects-visible") && !$(event.target).is('a[data-action="show-projects"]')) {
				intro.removeClass("projects-visible");
				projectsContainer.removeClass("projects-visible");
			}
		});

		// Set slider container width and translate value
		function setSliderContainer() {
			var mq = checkMQ();
			if (mq === "desktop") {
				var slides = projectsSlider.children("li"),
					slideWidth = slides.eq(0).width(),
					marginLeft = slides.eq(1).css("margin-left") ? Number(slides.eq(1).css("margin-left").replace("px", "")) : 0,
					sliderWidth = (slideWidth + marginLeft) * (slides.length + 1) + "px",
					slideCurrentIndex = projectsSlider.children("li.current").index();

				projectsSlider.css("width", sliderWidth);
				if (slideCurrentIndex !== 0) {
					setTranslateValue(projectsSlider, slideCurrentIndex * (slideWidth + marginLeft) + "px");
				}
			} else {
				projectsSlider.css("width", "");
				setTranslateValue(projectsSlider, 0);
			}
			resizing = false;
		}

		// Check media query
		function checkMQ() {
			return window
				.getComputedStyle(document.querySelector(".cd-projects-wrapper"), "::before")
				.getPropertyValue("content")
				.replace(/'/g, "")
				.replace(/"/g, "");
		}

		// Set translate value for the slider
		function setTranslateValue(item, translate) {
			item.css({
				"-moz-transform": "translateX(-" + translate + ")",
				"-webkit-transform": "translateX(-" + translate + ")",
				"-ms-transform": "translateX(-" + translate + ")",
				"-o-transform": "translateX(-" + translate + ")",
				transform: "translateX(-" + translate + ")",
			});
		}
	});

	// Ensure dataLoader is defined before using it
	if (typeof dataLoader !== "undefined") {
		dataLoader.initialize().then((success) => {
			if (success) {
				renderProjects(dataLoader.getCurrentData());
			}
		});
	} else {
		console.error("dataLoader is not defined. Ensure data-loader.js is included before main.js.");
	}
});

$(document).ready(function() {
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
});

let currentStartIndex = 0;
const SLIDES_VISIBLE = 3;
let projectsData = [];

document.addEventListener("DOMContentLoaded", async () => {
	// Initialize data loader
	const success = await dataLoader.initialize();
	if (success) {
		projectsData = dataLoader.getCurrentData();
		renderProjects(projectsData, 0);
	} else {
		console.error("Failed to load project data.");
	}

	// Handle "Show projects" button click
	const showProjectsAction = document.querySelector('[data-action="show-projects"]');
	if (showProjectsAction) {
		showProjectsAction.addEventListener("click", (event) => {
			event.preventDefault();
			document.querySelector(".cd-projects-wrapper").classList.add("projects-visible");
			document.querySelector(".cd-intro-block").classList.add("projects-visible");
		});
	}

	// Handle slider navigation
	const prevBtn = document.querySelector(".cd-slider-navigation .prev");
	const nextBtn = document.querySelector(".cd-slider-navigation .next");
	if (prevBtn && nextBtn) {
		prevBtn.addEventListener("click", (event) => {
			event.preventDefault();
			if (currentStartIndex > 0) {
				currentStartIndex = Math.max(0, currentStartIndex - SLIDES_VISIBLE);
				renderProjects(projectsData, currentStartIndex);
			}
		});
		nextBtn.addEventListener("click", (event) => {
			event.preventDefault();
			if (currentStartIndex < projectsData.length - SLIDES_VISIBLE) {
				currentStartIndex = Math.min(
					projectsData.length - 1,
					currentStartIndex + SLIDES_VISIBLE
				);
				renderProjects(projectsData, currentStartIndex);
			}
		});
	}

	// Handle project item click to open project content
	const slider = document.querySelector(".cd-slider");
	if (slider) {
		slider.addEventListener("click", async (event) => {
			const projectLink = event.target.closest("a");
			if (projectLink) {
				event.preventDefault();
				const projectId = projectLink.dataset.id;
				const projectContent = await dataLoader.getProjectContent(projectId);
				if (projectContent) {
					renderProjectContent(projectContent);
					document.querySelector(".cd-project-content").classList.add("is-visible");
				}
			}
		});
	}

	// Handle close button click for project content
	const closeBtn = document.querySelector(".cd-project-content .close");
	if (closeBtn) {
		closeBtn.addEventListener("click", (event) => {
			event.preventDefault();
			document.querySelector(".cd-project-content").classList.remove("is-visible");
		});
	}
});

function renderProjects(data, startIndex = 0) {
	const slider = document.querySelector(".cd-slider");
	if (!slider) {
		console.error("Slider element not found.");
		return;
	}

	slider.innerHTML = ""; // Clear existing content

	// If there are no projects, show a fallback
	if (!Array.isArray(data) || data.length === 0) {
		const li = document.createElement("li");
		li.innerHTML = `
			<div class="project-info" style="text-align: center; padding: 50px;">
				<h2>No Projects Available</h2>
				<p>There are currently no items to display.</p>
			</div>
		`;
		slider.appendChild(li);
	} else {
		// Always show from the start if there are fewer items than SLIDES_VISIBLE
		let safeStartIndex = startIndex;
		if (data.length <= SLIDES_VISIBLE) {
			safeStartIndex = 0;
		}
		const SLIDES_TO_SHOW = Math.max(1, Math.min(SLIDES_VISIBLE, data.length));
		const endIndex = Math.min(safeStartIndex + SLIDES_TO_SHOW, data.length);
		const visibleProjects = data.slice(safeStartIndex, endIndex);

		visibleProjects.forEach((proj, idx) => {
			const li = document.createElement("li");
			li.classList.remove("slides-in");
			li.innerHTML = `
				<a href="#0" data-id="${proj.id || (safeStartIndex + idx)}">
					<img src="${proj.image}" alt="${proj.title}">
					<div class="project-info">
						<h2>${proj.title}</h2>
						<p>${proj.description}</p>
					</div>
				</a>
			`;
			slider.appendChild(li);
		});
		const lis = slider.querySelectorAll("li");
		lis.forEach(li => li.offsetWidth); // Force reflow
		lis.forEach((li, i) => {
			setTimeout(() => {
				li.classList.add("slides-in");
			}, i * 50);
		});
	}

	// Always make the slider visible, even if only 1 or 2 items
	slider.style.visibility = "visible";
	slider.style.opacity = "1";

	// Update arrow states
	const prevBtn = document.querySelector(".cd-slider-navigation .prev");
	const nextBtn = document.querySelector(".cd-slider-navigation .next");
	if (prevBtn) {
		if (startIndex === 0 || data.length <= SLIDES_VISIBLE) {
			prevBtn.classList.add("inactive");
		} else {
			prevBtn.classList.remove("inactive");
		}
	}
	if (nextBtn) {
		if (startIndex + SLIDES_VISIBLE >= data.length || data.length <= SLIDES_VISIBLE) {
			nextBtn.classList.add("inactive");
		} else {
			nextBtn.classList.remove("inactive");
		}
	}
}

function renderProjectContent(content) {
	const container = document.querySelector("#project-content-container");
	if (container) {
		container.innerHTML = `
			<h2>${content.title}</h2>
			<em>${content.subtitle}</em>
			<p>${content.description}</p>
		`;
	}
}

// Example: If you have any code like this:
if (item.category === "projects") { /* ... */ }
// Or for filtering:
const filtered = data.filter(item => 
	item.category === "projects" ||
	item.category === "research papers" ||
	item.category === "certifications"
);
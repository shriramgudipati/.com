let projects = []; // Array to store fetched projects
let currentIndex = 0; // Track the current project index, used for detailing and selecting
console.log(currentIndex);


document.addEventListener('DOMContentLoaded', function() {

    // Fetch projects from JSON file and store in projects array
    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            projects = data; // Store fetched data in projects array
            if (projects.length > 0) {
                populateThumbnails();
                updateProjectDetails(projects[currentIndex]); // Update details with the first project
                console.log(currentIndex);


            }
        })
        .catch(error => console.log('Error loading projects:', error));


    function populateThumbnails() {
        const thumbnailsContainer = document.querySelector('.project-thumbnails');
        thumbnailsContainer.innerHTML = ''; // Clear existing thumbnails if any

        let startIndex = currentIndex - Math.floor(5 / 2);
        if (startIndex < 0) startIndex = projects.length + startIndex;

        for (let i = 0; i < 5; i++) { // Always attempt to display 5 thumbnails
            let thumbnailIndex = (startIndex + i) % projects.length; // Circular indexing
            const project = projects[thumbnailIndex];

            const thumbnailWrapper = document.createElement('div');
            thumbnailWrapper.className = 'project-thumbnail';
            thumbnailWrapper.dataset.projectId = thumbnailIndex;

            const imgElement = document.createElement('img');
            imgElement.src = project.image;
            thumbnailWrapper.appendChild(imgElement);

            thumbnailWrapper.addEventListener('click', function() {
                currentIndex = parseInt(this.dataset.projectId);
                updateProjectDetails(projects[currentIndex]);
                populateThumbnails(); // Repopulate thumbnails to update highlighting
            });

            thumbnailsContainer.appendChild(thumbnailWrapper);
        }
        highlightSelectedThumbnail();
    }


    function updateProjectDetails(project) {
        const projectNameDiv = document.querySelector('.proj_name');
        const projectDescriptionDiv = document.querySelector('.section2_proj_desc');
        const projectImage = document.querySelector('.proj_img');
        const skillsDiv = document.querySelector('.Skills');
        const projnum = document.querySelector('.proj_num');

        projectNameDiv.textContent = project.name;
        projectDescriptionDiv.textContent = project.description;
        projectImage.src = project.image;
        projnum.textContent = project.num;
        skillsDiv.innerHTML = project.skills.map(skill => `<span>${skill}</span>`).join('');

        highlightSelectedThumbnail(); // Ensure the correct thumbnail is highlighted
    }

    function highlightSelectedThumbnail() {
        const thumbnails = document.querySelectorAll('.project-thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            if (parseInt(thumbnail.dataset.projectId, 10) === currentIndex) {
                thumbnail.classList.add('selected-thumbnail');
            } else {
                thumbnail.classList.remove('selected-thumbnail');
            }
        });
    }


    // Event listeners for navigating projects
    document.getElementById('nextProject').addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % projects.length;
        updateProjectDetails(projects[currentIndex]);
        populateThumbnails(); // Repopulate thumbnails to reflect current selection

        console.log(currentIndex);

        const tt = document.querySelector('.randtitle');
        if (currentIndex != 0) {
            tt.style.display = 'none';
        }

    });

    document.getElementById('prevProject').addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + projects.length) % projects.length;
        updateProjectDetails(projects[currentIndex]);
        populateThumbnails(); // Repopulate thumbnails to reflect current selection

        console.log('hello');

        const tt = document.querySelector('.randtitle');
        if (currentIndex != 0) {
            tt.style.display = 'none';
        }

    });




    document.querySelector('.proj_img').addEventListener('click', function() {
        window.location.href = `/project.html?project=${currentIndex}`;

    });



});

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
            'Cool Stuff'
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
}

console.clear();
var anib = new Messenger($('#anib'));


document.addEventListener("DOMContentLoaded", function() {
    var section2 = document.getElementById('section2');
    var opacity = 0; // Start opacity
    section2.style.opacity = opacity;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start animation when section is in view
                function fadeIn() {
                    opacity += 0.02; // Adjust for smoother or faster animation
                    section2.style.opacity = opacity;
                    if (opacity < 1) {
                        requestAnimationFrame(fadeIn);
                    }
                }
                fadeIn();
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(section2);
});


document.getElementById("overlay").addEventListener("click", closeNav);

function updateMenuTitle(title) {
    var menuTitle = document.querySelector(".menu-cont h1");
    menuTitle.textContent = title; // Set the text content to the provided title
}

// Attach event listeners to sidebar links for title update
document.querySelectorAll("#sidebar a").forEach(link => {
    link.addEventListener("click", function() {
        var title = this.getAttribute("data-title"); // Get the title from data-title attribute
        updateMenuTitle(title); // Update the menu-cont h1 with this title
    });
});

function openNav() {
    document.getElementById("sidebar").style.width = "250px"; // Adjust the width as needed
    document.getElementById("overlay").style.display = "block"; // Show the overlay
    document.querySelector(".menu-cont").classList.add("fade-out"); // Fade out the menu icon
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0"; // Close the sidebar
    document.getElementById("overlay").style.display = "none"; // Hide the overlay
    document.querySelector(".menu-cont").classList.remove("fade-out"); // Show the menu icon again
}
document.addEventListener("DOMContentLoaded", function() {
    // Function to update the menu title
    function updateMenuTitle(title) {
        document.querySelector(".menu-cont h1").textContent = title;
    }

    // Options for the observer (tweak as needed)
    const options = {
        root: null, // null means viewport
        threshold: 0.5, // Trigger when 50% of the element is in view
        rootMargin: "0px",
    };

    // Callback function for the observer
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the title from data-title attribute of the section
                const title = entry.target.getAttribute("data-title");
                updateMenuTitle(title); // Update the menu title
            }
        });
    };

    // Create an observer instance
    const observer = new IntersectionObserver(observerCallback, options);

    // Target elements to observe
    document.querySelectorAll("section[data-title]").forEach(section => {
        observer.observe(section); // Start observing the section
    });
});

/* ---- particles.js config ---- */

particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 380,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 140,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});


/* ---- stats.js config ---- */

var count_particles, stats, update;
stats = new Stats;
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);
count_particles = document.querySelector('.js-count-particles');
update = function() {
  stats.begin();
  stats.end();
  if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
    count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
  }
  requestAnimationFrame(update);
};
requestAnimationFrame(update);
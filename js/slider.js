document.addEventListener("DOMContentLoaded", () => {
  const categorySelector = document.getElementById("category");
  const sliderContent = document.getElementById("slider-content");

  // Modify the loadCategory function to ensure skills are formatted after loading
  const loadCategory = (category) => {
    fetch(`./${category}.json`)
      .then((response) => response.json())
      .then((data) => {
        sliderContent.innerHTML = ""; // Clear existing content
        data.forEach((item) => {
          const slide = document.createElement("div");
          slide.className = "blog-slider__item swiper-slide";
          slide.innerHTML = `
            <div class="blog-slider__img">
              <img src="${item.image}" alt="">
            </div>
            <div class="blog-slider__content">
              <span class="blog-slider__code">${item.date}</span>
              <div class="blog-slider__title">${item.title}</div>
              <div class="blog-slider__subtitle">${Skills}</div>
              <div class="blog-slider__text">${item.text}</div>
              ${formatSliderSkills(item.skills)}
              <a href="#" class="blog-slider__button">READ MORE</a>
            </div>
          `;
          sliderContent.appendChild(slide);
        });

        // Reinitialize Swiper
        new Swiper(".blog-slider", {
          spaceBetween: 30,
          effect: "fade",
          loop: true,
          pagination: {
            el: ".blog-slider__pagination",
            clickable: true,
          },
        });

        // After swiper initialization, format skills
        setTimeout(function() {
          if (typeof ensureSkillTagsFormatting === 'function') {
            ensureSkillTagsFormatting();
          } else {
            // Fallback if the function isn't available
            document.querySelectorAll('.blog-slider__skills').forEach(function(element) {
              const text = element.textContent.trim();
              if (!text) return;
              
              const skills = text.split(',').filter(Boolean);
              
              if (skills.length > 0) {
                element.innerHTML = '';
                skills.forEach(skill => {
                  const span = document.createElement('span');
                  span.textContent = skill.trim();
                  element.appendChild(span);
                });
              }
            });
          }
        }, 200);
      });
  };

  function initializeSlider() {
    // Update skills in the slider
    updateSliderSkills();
  }

  function updateSliderSkills() {
    const skillsElements = document.querySelectorAll('.carousel-skills');

    skillsElements.forEach(skillsElement => {
      const projectId = parseInt(skillsElement.closest('.carousel__item')?.dataset.projectId);
      if (isNaN(projectId) || projectId >= window.projects.length) return;

      const project = window.projects[projectId];

      skillsElement.innerHTML = '';
      if (project.skills && project.skills.length > 0) {
        project.skills.forEach(skill => {
          const skillSpan = document.createElement('span');
          skillSpan.textContent = skill;
          skillsElement.appendChild(skillSpan);
        });
      }
    });
  }

  function loadSliderContent(category) {
    fetch(`./${category}.json`)
      .then((response) => response.json())
      .then((data) => {
        sliderContent.innerHTML = ""; // Clear existing content
        data.forEach((item) => {
          const slide = document.createElement("div");
          slide.className = "blog-slider__item swiper-slide";
          slide.innerHTML = `
            <div class="blog-slider__img">
              <img src="${item.image}" alt="">
            </div>
            <div class="blog-slider__content">
              <span class="blog-slider__code">${item.date}</span>
              <div class="blog-slider__title">${item.title}</div>
              <div class="blog-slider__subtitle">${Skills}</div>
              <div class="blog-slider__text">${item.text}</div>
              ${formatSliderSkills(item.skills)}
              <a href="#" class="blog-slider__button">READ MORE</a>
            </div>
          `;
          sliderContent.appendChild(slide);
        });

        // Reinitialize Swiper
        new Swiper(".blog-slider", {
          spaceBetween: 30,
          effect: "fade",
          loop: true,
          pagination: {
            el: ".blog-slider__pagination",
            clickable: true,
          },
        });

        // After the slider content is loaded
        setTimeout(function() {
          updateAllSkillTags();
        }, 100);
      });
  }

  /**
   * Format skills for the blog slider items
   * @param {string|Array} skills - Skills as string or array
   * @returns {string} HTML for skills as blog slider tags
   */
  function formatSliderSkills(skills) {
    if (!skills) return '';
    
    // Handle different input types
    let skillsArray;
    
    if (Array.isArray(skills)) {
      // If it's already an array
      skillsArray = skills;
    } else if (typeof skills === 'string') {
      // If it's a comma-separated string
      skillsArray = skills.split(',');
    } else {
      // If it's neither, return empty
      return '';
    }
    
    // Clean up the array and ensure it's not empty
    skillsArray = skillsArray.map(skill => skill.trim()).filter(Boolean);
    
    if (skillsArray.length === 0) return '';
    
    // Create HTML with blog-slider__skills class
    let html = '<div class="blog-slider__skills">';
    
    // Generate separate span for each skill
    skillsArray.forEach(skill => {
      html += `<span>${skill}</span>`;
    });
    
    html += '</div>';
    return html;
  }

  // Load default category on page load
  loadCategory("Certifications");

  // Change category on dropdown selection
  categorySelector.addEventListener("change", (e) => {
    loadCategory(e.target.value);
  });

  // Make sure to call updateSliderSkills when the slider moves or initializes
  initializeSlider();

  // Also add skill tag updates after swiper slide changes
  if (typeof window.swiper !== 'undefined') {
    window.swiper.on('slideChange', function() {
      setTimeout(updateAllSkillTags, 50);
    });
  }
});

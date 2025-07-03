const baseParticlesConfig = {
    "particles": {
        "number": { 
            "value": 80, 
            "density": { "enable": true, "value_area": 800 } 
        },
        "color": { 
            "value": "#e87464"
        },
        "shape": { 
            "type": "circle", 
            "stroke": { "width": 0, "color": "#000000" }
        },
        "opacity": {
            "value": 0.5,
            "random": false,
            "anim": { 
                "enable": true,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": { 
                "enable": true,
                "speed": 3,
                "size_min": 0.3,
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
            "speed": 3,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": { "enable": true, "mode": "grab" },
            "onclick": { "enable": true, "mode": "push" },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 140,
                "line_linked": { "opacity": 1 }
            },
            "bubble": {
                "distance": 200,
                "size": 6,
                "duration": 2,
                "opacity": 0.8,
                "speed": 3
            },
            "repulse": { 
                "distance": 200, 
                "duration": 0.4 
            },
            "push": { "particles_nb": 4 },
            "connect": {
                "distance": 150,
                "line_linked": { "opacity": 0.2 },
                "radius": 100
            }
        }
    },
    "retina_detect": true
};

function createParticlesConfig(sectionOptions) {
    // Create a deep copy of the base config
    const config = JSON.parse(JSON.stringify(baseParticlesConfig));
    
    // Ensure responsive display
    config.retina_detect = true;
    config.fps_limit = 60;
    
    // Apply section-specific overrides
    if (sectionOptions.color) {
        config.particles.color.value = sectionOptions.color;
    }
    
    if (sectionOptions.linkColor) {
        config.particles.line_linked.color = sectionOptions.linkColor;
    }
    
    if (sectionOptions.linkOpacity !== undefined) {
        config.particles.line_linked.opacity = sectionOptions.linkOpacity;
    }
    
    if (sectionOptions.lineWidth !== undefined) {
        config.particles.line_linked.width = sectionOptions.lineWidth;
    }
    
    if (sectionOptions.particleCount) {
        config.particles.number.value = sectionOptions.particleCount;
    }
    
    if (sectionOptions.particleSize) {
        config.particles.size.value = sectionOptions.particleSize;
    }
    
    if (sectionOptions.speed) {
        config.particles.move.speed = sectionOptions.speed;
    }
    
    if (sectionOptions.shape) {
        config.particles.shape.type = sectionOptions.shape;
    }
    
    if (sectionOptions.direction) {
        config.particles.move.direction = sectionOptions.direction;
    }
    
    if (sectionOptions.disableLinks) {
        config.particles.line_linked.enable = false;
    }
    
    if (sectionOptions.hoverMode) {
        config.interactivity.events.onhover.mode = sectionOptions.hoverMode;
    }
    
    if (sectionOptions.clickMode) {
        config.interactivity.events.onclick.mode = sectionOptions.clickMode;
    }
    
    return config;
}

// Initialize only the main background particles
function initializeAllParticles() {
    // Clear any existing canvases to prevent duplicates
    document.querySelectorAll('.particles-js-canvas-el').forEach(function(canvas) {
        canvas.remove();
    });
    
    // Helper function to ensure proper canvas sizing and positioning
    function setupCanvas(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Make sure container is properly sized
        if (containerId === 'particles-js') {
            container.style.width = '100vw';
            container.style.height = '100vh';
        }
    }
    
    // Set up the main container
    setupCanvas('particles-js');
    
    // Main background only - with original particle settings
    particlesJS("particles-js", createParticlesConfig({
        color: "#e87464",
        linkColor: "#ffffff",
        particleCount: 80, // Original particle count
        particleSize: 3,
        speed: 3, // Original speed
        hoverMode: "grab",
        direction: "none",
        lineWidth: 1 // Original line width
    }));
    
    // Fix canvas sizes after a short delay
    setTimeout(function() {
        fixCanvasDimensions();
    }, 200);
    
    // Handle window resize events
    window.addEventListener('resize', handleResize);
}

// Function to handle window resize events
function handleResize() {
    // Cancel any pending resize handlers
    if (window.particlesResizeTimeout) {
        clearTimeout(window.particlesResizeTimeout);
    }
    
    // Set a timeout to avoid excessive processing during resize
    window.particlesResizeTimeout = setTimeout(fixCanvasDimensions, 200);
}

// Function to fix canvas dimensions
function fixCanvasDimensions() {
    document.querySelectorAll('.particles-js-canvas-el').forEach(function(canvas) {
        const container = canvas.parentElement;
        if (!container) return;
        
        // Force the canvas size to match the container exactly
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Apply additional styling directly
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        console.log(`Fixed canvas for ${container.id}: ${rect.width}x${rect.height}`);
    });
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', initializeAllParticles);

// Function to update particle colors dynamically
window.updateParticleColors = function(section, color, linkColor) {
    const containerId = section === 'main' ? 'particles-js' : 
                        section === 'intro' ? 'particles-intro' :
                        section === 'projects' ? 'particles-projects' :
                        section === 'content' ? 'particles-content' : null;
    
    if (!containerId) return;
    
    const options = {
        color: color
    };
    
    if (linkColor) {
        options.linkColor = linkColor;
    }
    
    particlesJS(containerId, createParticlesConfig(options));
};

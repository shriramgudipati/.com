/**
 * Unified Particles Configuration
 * This file provides a single configuration that can be applied to all particle containers
 * with section-specific customizations.
 */

// Base configuration that will be applied to all sections
const baseParticlesConfig = {
    "particles": {
        "number": { 
            "value": 80, 
            "density": { "enable": true, "value_area": 800 } 
        },
        "color": { 
            "value": "#e87464" // Default color, will be overridden
        },
        "shape": { 
            "type": "circle", 
            "stroke": { "width": 0, "color": "#000000" }
        },
        "opacity": {
            "value": 0.5,
            "random": true,
            "anim": { 
                "enable": true,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 5,
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
            "color": "#ffffff", // Default link color, will be overridden
            "opacity": 0.4, 
            "width": 1 
        },
        "move": {
            "enable": true,
            "speed": 3,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "bounce",
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

// Helper function to create section-specific configurations
function createParticlesConfig(sectionOptions) {
    // Create a deep copy of the base config
    const config = JSON.parse(JSON.stringify(baseParticlesConfig));
    
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

// Initialize all particle sections
function initializeAllParticles() {
    // Main background
    particlesJS("particles-js", createParticlesConfig({
        color: "#e87464",
        linkColor: "#000000",
        particleCount: 120,
        particleSize: 3,
        speed: 6,
        hoverMode: "repulse"
    }));
    
    // Intro section
    particlesJS("particles-intro", createParticlesConfig({
        color: "#e67e22",
        linkColor: "#ffffff",
        linkOpacity: 0.2,
        particleCount: 80,
        hoverMode: "grab"
    }));
    
    // Projects section
    particlesJS("particles-projects", createParticlesConfig({
        color: "#2ecc71", 
        linkColor: "#2ecc71",
        linkOpacity: 0.15,
        particleCount: 60,
        particleSize: 4,
        shape: "polygon",
        speed: 2,
        hoverMode: "bubble"
    }));
    
    // Content section
    particlesJS("particles-content", createParticlesConfig({
        color: "#3498db",
        particleCount: 30,
        particleSize: 8,
        disableLinks: true,
        direction: "top",
        speed: 1,
        hoverMode: "connect"
    }));
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

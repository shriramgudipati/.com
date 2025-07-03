/**
 * Simplified particles fix - ensures particles work properly on all devices
 */

// Simple function to check if device is a phone
function isPhoneDevice() {
    return window.innerWidth <= 480 && 'ontouchstart' in window;
}

// Wait for DOM and particles to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize particles if not on a phone
    if (!isPhoneDevice()) {
        setTimeout(function() {
            const particlesContainer = document.getElementById('particles-js');
            if (particlesContainer) {
                console.log('Fixing particles display...');
                
                // Ensure container is properly sized
                particlesContainer.style.position = 'fixed';
                particlesContainer.style.top = '0';
                particlesContainer.style.left = '0';
                particlesContainer.style.width = '100%';
                particlesContainer.style.height = '100%';
                particlesContainer.style.zIndex = '-1';
                
                // Fix canvas if it exists
                const canvas = particlesContainer.querySelector('canvas');
                if (canvas) {
                    canvas.style.width = '100%';
                    canvas.style.height = '100%';
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            }
        }, 800);
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (!isPhoneDevice()) {
                setTimeout(function() {
                    const canvas = document.querySelector('#particles-js canvas');
                    if (canvas) {
                        canvas.width = window.innerWidth;
                        canvas.height = window.innerHeight;
                        canvas.style.width = '100%';
                        canvas.style.height = '100%';
                    }
                }, 100);
            }
        });
    }
});

// Function to manually reset particles if needed
function resetParticles() {
    if (!isPhoneDevice() && typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
        try {
            pJSDom[0].pJS.fn.vendors.destroypJS();
            if (typeof initializeAllParticles === 'function') {
                initializeAllParticles();
            }
        } catch (e) {
            console.log('Particles reset error:', e);
        }
    }
}

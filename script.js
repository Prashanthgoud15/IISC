try {
    // --- Logo Popup Animation ---
    const logoPopup = document.getElementById('logoPopup');
    const contentContainer = document.querySelector('.content-container');
    const particlesContainer = document.getElementById('particles');
    
    // Create floating particles
    function createParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 4 + 's';
            particle.style.animationDuration = (Math.random() * 2 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    // Initialize logo popup
    function initLogoPopup() {
        createParticles();
        
        // Hide popup after animation completes
        setTimeout(() => {
            logoPopup.classList.add('hidden');
            contentContainer.classList.add('visible');
            
            // Remove popup from DOM after transition
            setTimeout(() => {
                logoPopup.remove();
            }, 800);
        }, 3500); // Total animation duration
    }
    
    // Start logo popup animation
    initLogoPopup();
    
    // Skip animation functionality
    const skipButton = document.getElementById('skipAnimation');
    skipButton.addEventListener('click', () => {
        logoPopup.classList.add('hidden');
        contentContainer.classList.add('visible');
        setTimeout(() => {
            logoPopup.remove();
        }, 800);
    });
    
    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOpenIcon = document.getElementById('menu-open-icon');
    const menuCloseIcon = document.getElementById('menu-close-icon');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        menuOpenIcon.classList.toggle('hidden');
        menuOpenIcon.classList.toggle('inline-flex');
        menuCloseIcon.classList.toggle('hidden');
    });

    // --- Three.js Background Animation ---
    let scene, camera, renderer, stars;

    function init() {
        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 1;
        camera.rotation.x = Math.PI / 2;

        // Renderer
        const canvas = document.getElementById('hero-canvas');
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        // Starfield
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 7000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        
        // Hardcoded colors for robustness, matching the CSS variables
        const color1 = new THREE.Color(0xff8c00); 
        const color2 = new THREE.Color(0x9446ff);

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 1000;
            positions[i3 + 1] = (Math.random() - 0.5) * 1000;
            positions[i3 + 2] = (Math.random() - 0.5) * 1000;
            
            const randomColor = Math.random() > 0.5 ? color1 : color2;
            colors[i3] = randomColor.r;
            colors[i3 + 1] = randomColor.g;
            colors[i3 + 2] = randomColor.b;
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 0.7,
            vertexColors: true
        });

        stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        window.addEventListener('resize', onWindowResize, false);
        animate();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        stars.position.z += 0.2;
        if (stars.position.z > 1000) {
            stars.position.z = -1000;
        }
        renderer.render(scene, camera);
    }

    // Start animation only after the document is fully loaded
    if (document.readyState === 'complete') {
      init();
    } else {
      window.addEventListener('load', init);
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('.section, .card, .team-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Counter animation
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Observe counter elements
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(counter => {
        counterObserver.observe(counter);
    });

    // Form submission handling
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
            `;
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Message Sent!
                `;
                submitBtn.classList.remove('btn-primary');
                submitBtn.classList.add('bg-green-600');
                
                // Reset form
                this.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('bg-green-600');
                    submitBtn.classList.add('btn-primary');
                }, 3000);
            }, 2000);
        });
    }

    // Download button functionality
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent.includes('Download')) {
            button.addEventListener('click', function() {
                // Simulate download (replace with actual download logic)
                this.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                `;
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = 'Downloaded!';
                    this.classList.remove('btn-primary');
                    this.classList.add('bg-green-600');
                    
                    setTimeout(() => {
                        this.innerHTML = 'Download';
                        this.disabled = false;
                        this.classList.remove('bg-green-600');
                        this.classList.add('btn-primary');
                    }, 2000);
                }, 1500);
            });
        }
    });

} catch (error) {
    console.error("An error occurred while initializing the page:", error);
    // You can optionally display a friendly error message to the user here
}

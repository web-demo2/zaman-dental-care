document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Navigation Menu Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            // Toggle hamburger animation state if classes exist
            const spans = menuToggle.querySelectorAll("span");
            if (spans.length === 3) {
                if (navLinks.classList.contains("active")) {
                    spans[0].style.transform = "rotate(45deg) translate(6px, 6px)";
                    spans[1].style.opacity = "0";
                    spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
                } else {
                    spans[0].style.transform = "none";
                    spans[1].style.opacity = "1";
                    spans[2].style.transform = "none";
                }
            }
        });

        // Close menu when clicking links
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                const spans = menuToggle.querySelectorAll("span");
                if (spans.length === 3) {
                    spans[0].style.transform = "none";
                    spans[1].style.opacity = "1";
                    spans[2].style.transform = "none";
                }
            });
        });
    }

    // 2. Animated Testimonial Slider
    const carousel = document.getElementById("reviews-carousel");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    
    if (carousel) {
        const slides = carousel.querySelectorAll(".review-slide");
        let currentIndex = 0;
        const totalSlides = slides.length;

        const updateCarousel = () => {
            const gap = 32; // 2rem matches CSS gap
            carousel.style.transform = `translateX(calc(-${currentIndex * 100}% - ${currentIndex * gap}px))`;
        };

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateCarousel();
                resetAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateCarousel();
                resetAutoplay();
            });
        }

        // Autoplay carousel every 6 seconds
        let autoplay = setInterval(() => {
            if (totalSlides > 0) {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateCarousel();
            }
        }, 6000);

        const resetAutoplay = () => {
            clearInterval(autoplay);
            autoplay = setInterval(() => {
                if (totalSlides > 0) {
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateCarousel();
                }
            }, 6000);
        };
    }

    // 3. Scroll Reveal Micro-animations
    const revealElements = document.querySelectorAll(".scroll-reveal");
    
    if (revealElements.length > 0) {
        const observerOptions = {
            root: null, // Viewport
            threshold: 0.1, // Trigger when 10% visible
            rootMargin: "0px 0px -50px 0px" // Slight offset
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    // Stop observing once revealed
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    }
});

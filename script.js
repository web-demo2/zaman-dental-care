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

    // 4. Highlight current day in business hours and update today's status banner
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = days[new Date().getDay()];
    
    const hoursRows = document.querySelectorAll(".hours-row");
    let todayHours = "";
    
    hoursRows.forEach(row => {
        const dayLabel = row.querySelector("span");
        if (dayLabel) {
            const dayText = dayLabel.textContent.trim();
            if (dayText.toLowerCase() === todayName.toLowerCase()) {
                row.classList.add("current-day");
                
                const badge = document.createElement("span");
                badge.className = "today-badge";
                badge.textContent = "Today";
                dayLabel.appendChild(badge);
                
                const hoursValEl = row.querySelector("strong");
                if (hoursValEl) {
                    todayHours = hoursValEl.textContent.trim();
                }
            }
        }
    });

    const statusBanner = document.getElementById("today-status-banner");
    const statusDay = document.getElementById("today-status-day");
    const statusTime = document.getElementById("today-status-time");
    const statusBadge = document.getElementById("today-status-badge");
    const statusIcon = statusBanner ? statusBanner.querySelector(".today-status-icon") : null;

    if (statusBanner && todayHours) {
        const isClosed = todayHours.toLowerCase() === "closed";
        statusDay.textContent = `Today is ${todayName}`;
        
        if (isClosed) {
            statusTime.textContent = "Clinic is Closed Today";
            statusBadge.textContent = "Closed";
            statusBadge.className = "today-status-badge closed";
            statusBanner.classList.add("closed-today");
            if (statusIcon) statusIcon.textContent = "❌";
        } else {
            // Try to parse if it is open now or closed now
            const parts = todayHours.split(/(?:to|-)/i);
            let isNowOpen = true; // default fallback
            let hasParsed = false;
            
            if (parts.length === 2) {
                const parseTimeStr = (timeStr) => {
                    const cleanStr = timeStr.trim().toUpperCase();
                    const match = cleanStr.match(/^(\d+):(\d+)\s*(AM|PM)$/);
                    if (!match) return null;
                    let hrs = parseInt(match[1]);
                    const mins = parseInt(match[2]);
                    const period = match[3];
                    if (period === "PM" && hrs < 12) hrs += 12;
                    if (period === "AM" && hrs === 12) hrs = 0;
                    return hrs * 60 + mins;
                };
                
                const startMins = parseTimeStr(parts[0]);
                const endMins = parseTimeStr(parts[1]);
                
                if (startMins !== null && endMins !== null) {
                    hasParsed = true;
                    const now = new Date();
                    const currentMins = now.getHours() * 60 + now.getMinutes();
                    if (currentMins >= startMins && currentMins < endMins) {
                        isNowOpen = true;
                    } else {
                        isNowOpen = false;
                    }
                }
            }
            
            statusTime.textContent = `Hours: ${todayHours}`;
            if (hasParsed) {
                if (isNowOpen) {
                    statusBadge.textContent = "Open Now";
                    statusBadge.className = "today-status-badge open";
                    if (statusIcon) statusIcon.textContent = "✅";
                } else {
                    statusBadge.textContent = "Closed Now";
                    statusBadge.className = "today-status-badge closed";
                    statusBanner.classList.add("closed-today");
                    if (statusIcon) statusIcon.textContent = "❌";
                }
            } else {
                statusBadge.textContent = "Open Today";
                statusBadge.className = "today-status-badge open";
                if (statusIcon) statusIcon.textContent = "⏰";
            }
        }
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

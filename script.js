document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar scroll effect + Scroll Progress Bar
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        // Update scroll progress bar
        if (progressBar) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = pct + '%';
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // Scroll Reveal Animation via Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
    
    // Trigger reveals on load for elements already in viewport
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    // Gallery Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    // Slight delay for animation effect
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300); // match transition duration
                }
            });
        });
    });

    // Lead Generation Popup Modal Logic
    const leadModal = document.getElementById('leadModal');
    const closeLeadModal = document.querySelector('.close-modal');
    const leadForm = document.getElementById('leadForm');
    const leadSuccess = document.getElementById('leadSuccess');
    const triggerButtons = document.querySelectorAll('.trigger-lead-modal');

    if (leadModal) {
        // Show modal after 1 minute (60,000 milliseconds)
        setTimeout(() => {
            // Check if they haven't already submitted it this session
            if (!sessionStorage.getItem('leadSubmitted')) {
                leadModal.classList.remove('hide');
            }
        }, 60000);

        // Close on X click
        closeLeadModal.addEventListener('click', () => {
            leadModal.classList.add('hide');
        });

        // Open manually via Register buttons
        triggerButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                leadModal.classList.remove('hide');
            });
        });

        // Close on clicking outside the modal content
        window.addEventListener('click', (e) => {
            if (e.target === leadModal) {
                leadModal.classList.add('hide');
            }
        });

        // Handle form submission
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('leadEmail').value.trim();
            const phone = document.getElementById('leadPhone').value.trim();
            const errorDiv = document.getElementById('leadError');
            
            // Validation
            const phoneRegex = /^\d{10}$/;
            const emailIsValid = email.endsWith('@gmail.com') || email.endsWith('@workspace.in') || (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email));
            
            if (!emailIsValid) {
                errorDiv.textContent = "Please enter a valid email address (e.g., @gmail.com or @workspace.in)";
                errorDiv.style.display = 'block';
                return;
            }
            
            if (!phoneRegex.test(phone)) {
                errorDiv.textContent = "Please enter a valid 10-digit Indian phone number without any spaces or country code.";
                errorDiv.style.display = 'block';
                return;
            }

            errorDiv.style.display = 'none'; // clear errors if valid
            
            // Construct WhatsApp message
            const ownerNumber = '919515933317'; // Including country code (India)
            const message = `Hi! I visited the Vishnu Paradise website and would like more information.%0A%0A*My Contact Details:*%0AEmail: ${email}%0APhone: ${phone}`;
            const whatsappUrl = `https://wa.me/${ownerNumber}?text=${message}`;
            
            // Open WhatsApp in a new tab
            window.open(whatsappUrl, '_blank');
            
            // Mark as submitted in session to avoid popping up again
            sessionStorage.setItem('leadSubmitted', 'true');
            
            // Show Success UI
            leadForm.style.display = 'none';
            leadSuccess.style.display = 'block';
            
            // Automatically close after a few seconds
            setTimeout(() => {
                leadModal.classList.add('hide');
                
                // Reset for next session just in case
                setTimeout(() => {
                    leadForm.reset();
                    leadForm.style.display = 'block';
                    leadSuccess.style.display = 'none';
                    if(document.getElementById('leadError')) document.getElementById('leadError').style.display = 'none';
                }, 500);
            }, 3000);
        });
    }

    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Availability Modal Logic
    const availabilityModal = document.getElementById('availabilityModal');
    const availabilityForm = document.getElementById('availabilityForm');
    const triggerAvailability = document.querySelectorAll('.trigger-availability-modal');

    if (availabilityModal) {
        triggerAvailability.forEach(btn => {
            btn.addEventListener('click', () => {
                availabilityModal.classList.remove('hide');
                
                // Set min dates to today
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('checkIn').min = today;
                document.getElementById('checkOut').min = today;
            });
        });

        // Close on X click or outside
        availabilityModal.querySelector('.close-modal').addEventListener('click', () => {
            availabilityModal.classList.add('hide');
        });

        window.addEventListener('click', (e) => {
            if (e.target === availabilityModal) {
                availabilityModal.classList.add('hide');
            }
        });

        availabilityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const checkIn = document.getElementById('checkIn').value;
            const checkOut = document.getElementById('checkOut').value;
            const guests = document.getElementById('guests').value;

            if (new Date(checkIn) >= new Date(checkOut)) {
                alert("Check-out date must be after check-in date.");
                return;
            }

            const message = `Hi Vishnu Paradise! I'd like to check room availability.%0A%0A*Stay Details:*%0A📅 Check-In: ${checkIn}%0A📅 Check-Out: ${checkOut}%0A👥 Guests: ${guests}%0A%0AIs there a room available?`;
            const whatsappUrl = `https://wa.me/919515933317?text=${message}`;
            
            window.open(whatsappUrl, '_blank');
            availabilityModal.classList.add('hide');
        });
    }

    // ============================================
    // TYPING TAGLINE ANIMATION (looping)
    // ============================================
    const taglineEl = document.getElementById('heroTagline');
    if (taglineEl) {
        const fullText = 'Luxury  •  Comfort  •  Value';
        let charIdx = 0;
        let isErasing = false;

        function tick() {
            if (!isErasing) {
                // Typing forward
                if (charIdx < fullText.length) {
                    taglineEl.textContent = fullText.substring(0, charIdx + 1);
                    charIdx++;
                    taglineEl.classList.remove('typing-done');
                    setTimeout(tick, 80);
                } else {
                    // Finished typing — pause 3s then start erasing
                    taglineEl.classList.add('typing-done');
                    setTimeout(() => {
                        taglineEl.classList.remove('typing-done');
                        isErasing = true;
                        setTimeout(tick, 80);
                    }, 3000);
                }
            } else {
                // Erasing
                if (charIdx > 0) {
                    charIdx--;
                    taglineEl.textContent = fullText.substring(0, charIdx);
                    setTimeout(tick, 45);
                } else {
                    // Finished erasing — pause 1s then type again
                    isErasing = false;
                    setTimeout(tick, 1000);
                }
            }
        }

        // Start after hero reveal
        setTimeout(tick, 900);
    }



    // ============================================
    // GALLERY LIGHTBOX
    // ============================================
    const lightboxModal  = document.getElementById('lightboxModal');
    const lightboxImg    = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose  = document.getElementById('lightboxClose');
    const lightboxPrev   = document.getElementById('lightboxPrev');
    const lightboxNext   = document.getElementById('lightboxNext');

    if (lightboxModal) {
        // Collect all visible gallery images
        let galleryImages = [];
        let currentLightboxIdx = 0;

        function buildGalleryList() {
            galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
        }
        buildGalleryList();

        function openLightbox(idx) {
            buildGalleryList(); // refresh in case filter changed
            currentLightboxIdx = idx;
            const img = galleryImages[idx];
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt || '';
            lightboxModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightboxModal.classList.remove('open');
            document.body.style.overflow = '';
        }

        function showNext() {
            buildGalleryList();
            currentLightboxIdx = (currentLightboxIdx + 1) % galleryImages.length;
            const img = galleryImages[currentLightboxIdx];
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = img.alt || '';
                lightboxImg.style.opacity = '1';
            }, 180);
        }

        function showPrev() {
            buildGalleryList();
            currentLightboxIdx = (currentLightboxIdx - 1 + galleryImages.length) % galleryImages.length;
            const img = galleryImages[currentLightboxIdx];
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = img.alt || '';
                lightboxImg.style.opacity = '1';
            }, 180);
        }

        // Click gallery items to open
        document.querySelectorAll('.gallery-item').forEach((item, idx) => {
            item.addEventListener('click', () => {
                buildGalleryList();
                const visibleImgs = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"]) img'));
                const clickedSrc = item.querySelector('img').src;
                const visibleIdx = visibleImgs.findIndex(i => i.src === clickedSrc);
                galleryImages = visibleImgs;
                openLightbox(visibleIdx >= 0 ? visibleIdx : 0);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', showNext);
        lightboxPrev.addEventListener('click', showPrev);

        // Close on backdrop click
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('open')) return;
            if (e.key === 'Escape')       closeLightbox();
            if (e.key === 'ArrowRight')   showNext();
            if (e.key === 'ArrowLeft')    showPrev();
        });

        // Smooth image transition
        lightboxImg.style.transition = 'opacity 0.18s ease';
    }

    // ============================================
    // STAR RATING ANIMATION ON SCROLL (looping)
    // ============================================
    const reviewCards = document.querySelectorAll('.review-card');
    if (reviewCards.length) {
        function triggerStars(card) {
            const delay = parseInt(card.style.transitionDelay || '0') || 0;
            setTimeout(() => {
                card.classList.add('stars-animated');
                // Remove after animation and re-trigger after pause
                setTimeout(() => {
                    card.classList.remove('stars-animated');
                    setTimeout(() => triggerStars(card), 1200);
                }, 3500);
            }, delay + 100);
        }

        const starObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    triggerStars(entry.target);
                    starObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        reviewCards.forEach(card => starObserver.observe(card));
    }

    // ============================================
    // COUNTER ANIMATION (looping)
    // ============================================
    const statHeadings = document.querySelectorAll('.stat-item h3[data-count]');

    function animateCounter(el, onDone) {
        const target = parseFloat(el.getAttribute('data-count'));
        const isDecimal = el.hasAttribute('data-decimal');
        const decimals = isDecimal ? parseInt(el.getAttribute('data-decimal')) : 0;
        const steps = 60;
        const stepTime = 1800 / steps;
        let current = 0;
        el.textContent = isDecimal ? (0).toFixed(decimals) : '0';
        el.classList.add('counting');

        const timer = setInterval(() => {
            current += target / steps;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                el.classList.remove('counting');
                if (onDone) onDone();
            }
            el.textContent = isDecimal ? current.toFixed(decimals) : Math.floor(current);
        }, stepTime);
    }

    function loopCounter(el) {
        animateCounter(el, () => {
            // After count completes, wait 3s then repeat
            setTimeout(() => loopCounter(el), 3000);
        });
    }

    if (statHeadings.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loopCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        statHeadings.forEach(el => counterObserver.observe(el));
    }

});

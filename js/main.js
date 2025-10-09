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

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add fade-in animation to sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Hero section should be visible immediately
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }
});

// Add hover effect to benefit cards
document.querySelectorAll('.benefit-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderColor = '#7C3AED';
    });

    card.addEventListener('mouseleave', function() {
        this.style.borderColor = 'rgba(0,0,0,0.1)';
    });
});

// Placeholder animation for visual elements (only for non-video elements)
function animatePlaceholder(element) {
    let scale = 1;
    let growing = true;

    setInterval(() => {
        if (growing) {
            scale += 0.01;
            if (scale >= 1.05) growing = false;
        } else {
            scale -= 0.01;
            if (scale <= 0.95) growing = true;
        }
        element.style.transform = `scale(${scale})`;
    }, 50);
}

// Add subtle animations to placeholder visuals (but not videos)
document.addEventListener('DOMContentLoaded', () => {
    const placeholders = document.querySelectorAll('.animated-nodes');
    placeholders.forEach(element => {
        // Only animate if it's not a video element
        if (element.tagName !== 'VIDEO') {
            element.style.transition = 'transform 0.5s ease';
            animatePlaceholder(element);
        }
    });
});

// Button click animations
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// Get a demo button functionality - Custom lead form
document.addEventListener('DOMContentLoaded', () => {
    const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxBDV5depJZsJHOsAmSqJX7iQHWes48QHjv0iDp7py0MJ22Nvx1JnCnLaB9T0wo1uzV3w/exec';
    const SECRET = 'web_1_2_3';
    const ORIGIN = location.origin;

    // Submit function
    async function submitLead({ name, email, phone, company }) {
        const payload = {
            name: name.trim(),
            email: email.trim(),
            phone: (phone || "").trim(),
            secret: SECRET,
            origin: ORIGIN,
            company: company || "" // honeypot must be empty
        };

        const res = await fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        });

        const json = await res.json().catch(() => ({}));
        if (!json.ok) throw new Error(json.error || "Submission failed");
        return true;
    }

    // Create modal HTML structure
    const modalHTML = `
        <div id="demo-modal" class="demo-modal">
            <div class="demo-modal-overlay"></div>
            <div class="demo-modal-content">
                <button class="demo-modal-close">&times;</button>
                <div class="demo-modal-header">
                    <h2 class="demo-modal-title">Get a Demo</h2>
                    <video class="demo-modal-video" autoplay loop muted playsinline>
                        <source src="assets/images/purple cyclops.mp4" type="video/mp4">
                    </video>
                </div>
                <form id="leadForm" class="lead-form">
                    <input name="name" placeholder="Name" required>
                    <input name="email" type="email" placeholder="Email" required>
                    <input name="phone" placeholder="Phone">
                    <input type="text" name="company" style="display:none" tabindex="-1" autocomplete="off">
                    <button type="submit" class="lead-form-submit">Submit</button>
                    <div id="msg" class="lead-form-message"></div>
                </form>
            </div>
        </div>
    `;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('demo-modal');
    const closeBtn = modal.querySelector('.demo-modal-close');
    const overlay = modal.querySelector('.demo-modal-overlay');
    const form = document.getElementById('leadForm');
    const msg = document.getElementById('msg');

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = e.currentTarget;
        const submitBtn = f.querySelector('.lead-form-submit');

        // Hide button immediately and show sending message
        submitBtn.style.display = 'none';
        msg.textContent = "Sending…";
        msg.className = "lead-form-message loading";

        try {
            await submitLead({
                name: f.name.value,
                email: f.email.value,
                phone: f.phone.value,
                company: f.company.value
            });
            msg.textContent = "Thanks! You're on the list.";
            msg.className = "lead-form-message success";
            f.reset();
        } catch (err) {
            msg.textContent = err.message || "Something went wrong.";
            msg.className = "lead-form-message error";
            // Show button again on error so user can retry
            submitBtn.style.display = '';
        }
    });

    // Open modal on button click
    document.querySelectorAll('.btn-demo, .btn-primary').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        msg.textContent = "";
        msg.className = "lead-form-message";
        form.reset();
        // Show submit button again when modal reopens
        const submitBtn = form.querySelector('.lead-form-submit');
        submitBtn.style.display = '';
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});

// Make balls colliding video play forward then reverse
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.grid-pattern');
    if (video) {
        video.removeAttribute('loop'); // Remove loop attribute
        let playbackDirection = 1; // 1 for forward, -1 for reverse

        video.addEventListener('ended', () => {
            video.currentTime = video.duration;
            playbackDirection = -1;
            video.playbackRate = -1;
            video.play();
        });

        video.addEventListener('timeupdate', () => {
            if (playbackDirection === -1 && video.currentTime <= 0) {
                video.currentTime = 0;
                playbackDirection = 1;
                video.playbackRate = 1;
                video.play();
            }
        });
    }
});

console.log('Landing page loaded successfully!');

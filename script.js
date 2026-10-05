// Scroll Reveal Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(elem => {
    observer.observe(elem);
});

// Hide Navbar on Scroll Down, Show on Scroll Up
let lastScroll = 0;
const nav = document.querySelector('.glass-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.style.transform = 'translateY(0)';
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 80) {
        // Scroll down
        nav.style.transform = 'translateY(-100%)';
    } else {
        // Scroll up
        nav.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Subtle Galaxy Background using Canvas 2D
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

class Star {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Very small size for stars
        this.size = Math.random() * 1.2 + 0.2;
        // Extremely slow drift
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.speedY = (Math.random() - 0.5) * 0.1;
        // Twinkle effect variables
        this.opacity = Math.random();
        this.fadeDir = Math.random() > 0.5 ? 1 : -1;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
    }

    update() {
        // Drift
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
        
        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;

        // Twinkle (fade in and out)
        this.opacity += this.fadeSpeed * this.fadeDir;
        if (this.opacity >= 0.8) {
            this.opacity = 0.8;
            this.fadeDir = -1;
        } else if (this.opacity <= 0.1) {
            this.opacity = 0.1;
            this.fadeDir = 1;
        }
    }

    draw() {
        // Soft white/cyan color for stars
        ctx.fillStyle = `rgba(226, 232, 240, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initStars() {
    stars = [];
    // Calculate number of stars based on screen size (not too crowded)
    const starCount = Math.min(Math.floor(width * height / 5000), 250);
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw();
    }
    
    requestAnimationFrame(animate);
}

initStars();
animate();

// 3D Hover Effect for Profile Image
const heroImage = document.querySelector('.hero-image');
const imageFrame = document.querySelector('.image-frame');

if (heroImage && imageFrame) {
    heroImage.addEventListener('mousemove', (e) => {
        const rect = heroImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation based on mouse position
        const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg
        const rotateY = ((x - centerX) / centerX) * 15;
        
        imageFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroImage.addEventListener('mouseleave', () => {
        // Reset to normal
        imageFrame.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        imageFrame.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    heroImage.addEventListener('mouseenter', () => {
        // Remove transition to make movement instantly follow mouse
        imageFrame.style.transition = 'transform 0.1s';
    });
}

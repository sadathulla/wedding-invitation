document.addEventListener('DOMContentLoaded', function () {

    // ===== PRELOADER =====
    window.addEventListener('load', function () {
        setTimeout(function () {
            document.getElementById('preloader').classList.add('hidden');
        }, 2000);
    });

    // ===== FLOATING FLOWER PETALS =====
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Petal {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 3;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = Math.random() * 0.3 + 0.1;
            this.opacity = Math.random() * 0.35 + 0.05;
            this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.type = Math.random() > 0.4 ? 'petal' : 'dot';
        }
        update() {
            this.x += this.speedX + Math.sin(this.rotation) * 0.2;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            this.opacity += this.fadeDirection * 0.002;

            if (this.opacity <= 0.03 || this.opacity >= 0.4) {
                this.fadeDirection *= -1;
            }

            if (this.x < -20 || this.x > canvas.width + 20 || this.y > canvas.height + 20) {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.opacity = 0.05;
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            if (this.type === 'petal') {
                // Draw a flower petal shape
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.8, this.size * 0.8, this.size * 0.3, 0, this.size);
                ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.3, -this.size * 0.8, -this.size * 0.8, 0, -this.size);
                ctx.fillStyle = 'rgba(201, 168, 76, 0.6)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(201, 168, 76, 0.3)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            } else {
                // Small sparkle dot
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(232, 212, 139, 0.8)';
                ctx.fill();
            }

            ctx.restore();
        }
    }

    for (let i = 0; i < 60; i++) {
        particles.push(new Petal());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function (p) {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===== SCROLL REVEAL ANIMATIONS =====
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(function (el) {
        observer.observe(el);
    });

    // ===== COUNTDOWN TIMER =====
    // Set wedding date: 15th August 2026
    const weddingDate = new Date('2026-04-27T12:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(3, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== PARALLAX EFFECT ON HERO =====
    window.addEventListener('scroll', function () {
        var scrolled = window.pageYOffset;
        var hero = document.querySelector('.hero-content');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
            hero.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });

    // ===== MUSIC TOGGLE (ambient tone) =====
    var musicToggle = document.getElementById('musicToggle');
    var isPlaying = false;
    var audioContext = null;
    var gainNode = null;
    var oscillators = [];

    function createAmbientMusic() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.gain.value = 0.08;
            gainNode.connect(audioContext.destination);

            // Soft ambient chord (C major with added 9th)
            var frequencies = [130.81, 164.81, 196.00, 293.66];

            frequencies.forEach(function (freq) {
                var osc = audioContext.createOscillator();
                var oscGain = audioContext.createGain();

                osc.type = 'sine';
                osc.frequency.value = freq;
                oscGain.gain.value = 0.03;

                osc.connect(oscGain);
                oscGain.connect(gainNode);
                osc.start();

                oscillators.push({ osc: osc, gain: oscGain });
            });
        } catch (e) {
            console.log('Web Audio not supported');
        }
    }

    function stopMusic() {
        oscillators.forEach(function (item) {
            item.osc.stop();
        });
        oscillators = [];
        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }
    }

    musicToggle.addEventListener('click', function () {
        if (isPlaying) {
            stopMusic();
            musicToggle.classList.remove('playing');
        } else {
            createAmbientMusic();
            musicToggle.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });

    // ===== TIMELINE STAGGER ANIMATION =====
    var timelineItems = document.querySelectorAll('.timeline-item');
    var timelineObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function () {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(function (item) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        timelineObserver.observe(item);
    });

    // ===== EVENT CARDS STAGGER =====
    var eventCards = document.querySelectorAll('.event-card');
    var cardObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function () {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    eventCards.forEach(function (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
});

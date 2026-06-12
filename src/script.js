        document.addEventListener('DOMContentLoaded', function() {
            const canvas = document.getElementById('background-canvas');
            const ctx = canvas.getContext('2d');
            let particles = [];
            const particleCount = 80;
            let animationFrameId;
            let mouseX = -1000;
            let mouseY = -1000;

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resizeCanvas();
            window.addEventListener('resize', () => {
                resizeCanvas();
                initParticles();
            });

            document.addEventListener('mousemove', function(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
            document.addEventListener('mouseleave', function() {
                mouseX = -1000;
                mouseY = -1000;
            });

            class Particle {
                constructor() {
                    this.reset();
                }
                reset() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2.5 + 0.8;
                    this.speedX = (Math.random() - 0.5) * 0.6;
                    this.speedY = (Math.random() - 0.5) * 0.6;
                    this.opacity = Math.random() * 0.5 + 0.2;
                    this.pulseSpeed = Math.random() * 0.02 + 0.005;
                    this.pulseOffset = Math.random() * Math.PI * 2;
                }
                update(time) {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    if (this.x < -10) this.x = canvas.width + 10;
                    if (this.x > canvas.width + 10) this.x = -10;
                    if (this.y < -10) this.y = canvas.height + 10;
                    if (this.y > canvas.height + 10) this.y = -10;
                    const dx = this.x - mouseX;
                    const dy = this.y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const repelRadius = 120;
                    if (dist < repelRadius && dist > 0) {
                        const force = (repelRadius - dist) / repelRadius;
                        this.x += (dx / dist) * force * 2;
                        this.y += (dy / dist) * force * 2;
                    }
                    this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15;
                    this.currentOpacity = Math.max(0.05, Math.min(0.7, this.currentOpacity));
                }
                draw(ctx) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    const isDark = !document.body.classList.contains('light-theme');
                    const fillColor = isDark ? `rgba(0, 212, 170, ${this.currentOpacity})` : `rgba(0, 150, 120, ${this.currentOpacity * 0.7})`;
                    ctx.fillStyle = fillColor;
                    ctx.fill();
                    ctx.shadowColor = isDark ? 'rgba(0, 212, 170, 0.4)' : 'rgba(0, 150, 120, 0.2)';
                    ctx.shadowBlur = 6;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            function initParticles() {
                particles = [];
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }
            }
            initParticles();

            function animateCanvas(timestamp) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const time = timestamp || 0;
                const connectionDist = 130;
                const isDark = !document.body.classList.contains('light-theme');
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < connectionDist) {
                            const lineOpacity = (1 - dist / connectionDist) * 0.18;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = isDark ? `rgba(0, 212, 170, ${lineOpacity})` : `rgba(0, 140, 110, ${lineOpacity * 0.6})`;
                            ctx.lineWidth = 0.6;
                            ctx.stroke();
                        }
                    }
                }
                particles.forEach(p => {
                    p.update(time);
                    p.draw(ctx);
                });
                animationFrameId = requestAnimationFrame(animateCanvas);
            }
            animationFrameId = requestAnimationFrame(animateCanvas);

            const themeToggle = document.getElementById('themeToggle');
            const themeIcon = themeToggle.querySelector('i');
            const body = document.body;
            const savedTheme = localStorage.getItem('portfolio-theme');
            if (savedTheme === 'light') {
                body.classList.add('light-theme');
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
            themeToggle.addEventListener('click', function() {
                body.classList.toggle('light-theme');
                const isLight = body.classList.contains('light-theme');
                themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
                localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
            });

            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            const hamburgerMenu = document.getElementById('hamburgerMenu');
            const navLinks = document.getElementById('navLinks');
            hamburgerMenu.addEventListener('click', function() {
                hamburgerMenu.classList.toggle('active');
                navLinks.classList.toggle('open');
                const isExpanded = navLinks.classList.contains('open');
                hamburgerMenu.setAttribute('aria-expanded', isExpanded);
            });
            const allNavLinks = navLinks.querySelectorAll('a');
            allNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    hamburgerMenu.classList.remove('active');
                    navLinks.classList.remove('open');
                    hamburgerMenu.setAttribute('aria-expanded', 'false');
                });
            });

            const sections = document.querySelectorAll('section[id]');
            window.addEventListener('scroll', function() {
                let currentSectionId = '';
                const scrollPos = window.scrollY + 150;
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                        currentSectionId = section.getAttribute('id');
                    }
                });
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + currentSectionId) {
                        link.classList.add('active');
                    }
                });
            });

            const backToTopBtn = document.getElementById('backToTop');
            window.addEventListener('scroll', function() {
                if (window.scrollY > 600) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            const typingTextEl = document.getElementById('typingText');
            const phrases = [
                'Python AI/ML pipelines...',
                'High-performance C modules...',
                'Full-stack web applications...',
                'Custom AI tool development...',
                'Solo dev, complete ownership...',
                'Flask & FastAPI backends...',
                'LLM integration & fine-tuning...',
                'Embedded AI inference...',
                'End-to-end project delivery...'
            ];
            let phraseIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let typingSpeed = 70;
            function typeEffect() {
                const currentPhrase = phrases[phraseIndex];
                if (isDeleting) {
                    typingTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
                    charIndex--;
                    typingSpeed = 35;
                } else {
                    typingTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
                    charIndex++;
                    typingSpeed = 70 + Math.random() * 40;
                }
                if (!isDeleting && charIndex === currentPhrase.length) {
                    typingSpeed = 1800;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typingSpeed = 400;
                }
                setTimeout(typeEffect, typingSpeed);
            }
            setTimeout(typeEffect, 1000);

            const skillBars = document.querySelectorAll('.skill-bar-fill');
            const skillsSection = document.getElementById('skills');
            let skillsAnimated = false;
            function animateSkillBars() {
                if (skillsAnimated) return;
                const rect = skillsSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
                    skillBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth + '%';
                    });
                    skillsAnimated = true;
                }
            }
            window.addEventListener('scroll', animateSkillBars);
            animateSkillBars();

            const guesserOutput = document.getElementById('guesserOutput');
            const guesserStart = document.getElementById('guesserStart');
            const guesserHigher = document.getElementById('guesserHigher');
            const guesserLower = document.getElementById('guesserLower');
            const guesserCorrect = document.getElementById('guesserCorrect');
            let low, high, guess, attempts;
            function resetGuesser() {
                low = 1;
                high = 100;
                attempts = 0;
                guesserStart.disabled = false;
                guesserHigher.disabled = true;
                guesserLower.disabled = true;
                guesserCorrect.disabled = true;
                guesserOutput.textContent = 'Press Start to begin';
            }
            resetGuesser();
            function makeGuess() {
                if (low <= high) {
                    guess = Math.floor((low + high) / 2);
                    attempts++;
                    guesserOutput.textContent = `Is it ${guess}? (Attempt ${attempts})`;
                    guesserHigher.disabled = false;
                    guesserLower.disabled = false;
                    guesserCorrect.disabled = false;
                    guesserStart.disabled = true;
                } else {
                    guesserOutput.textContent = 'Something went wrong... Let me try again.';
                    resetGuesser();
                }
            }
            guesserStart.addEventListener('click', function() {
                low = 1;
                high = 100;
                attempts = 0;
                guesserHigher.disabled = false;
                guesserLower.disabled = false;
                guesserCorrect.disabled = false;
                guesserStart.disabled = true;
                makeGuess();
            });
            guesserHigher.addEventListener('click', function() {
                low = guess + 1;
                makeGuess();
            });
            guesserLower.addEventListener('click', function() {
                high = guess - 1;
                makeGuess();
            });
            guesserCorrect.addEventListener('click', function() {
                guesserOutput.textContent = `I guessed your number (${guess}) in ${attempts} attempts!`;
                guesserHigher.disabled = true;
                guesserLower.disabled = true;
                guesserCorrect.disabled = true;
                guesserStart.disabled = false;
            });

            const reactionBox = document.getElementById('reactionBox');
            const reactionOutput = document.getElementById('reactionOutput');
            const reactionReset = document.getElementById('reactionReset');
            let reactionTimeout;
            let startTime;
            let waitingForGreen = false;
            let gameActive = true;
            function resetReaction() {
                clearTimeout(reactionTimeout);
                reactionBox.className = 'reaction-box';
                reactionBox.textContent = 'Click to start';
                reactionOutput.textContent = 'Your time will appear here';
                waitingForGreen = false;
                gameActive = true;
            }
            reactionBox.addEventListener('click', function() {
                if (!gameActive) return;
                if (waitingForGreen) {
                    if (reactionBox.classList.contains('ready')) {
                        const reactionTime = Date.now() - startTime;
                        reactionOutput.textContent = `Your reaction time: ${reactionTime} ms`;
                        reactionBox.textContent = `${reactionTime} ms`;
                        reactionBox.className = 'reaction-box';
                        waitingForGreen = false;
                        gameActive = true;
                    } else {
                        clearTimeout(reactionTimeout);
                        reactionBox.classList.add('wrong');
                        reactionBox.textContent = 'Too soon! Click to retry';
                        reactionOutput.textContent = 'Clicked before green...';
                        waitingForGreen = false;
                        gameActive = true;
                    }
                } else {
                    if (reactionBox.classList.contains('wrong')) {
                        resetReaction();
                        return;
                    }
                    gameActive = true;
                    waitingForGreen = true;
                    reactionBox.textContent = 'Wait for green...';
                    reactionBox.className = 'reaction-box waiting';
                    reactionOutput.textContent = 'Get ready...';
                    const delay = Math.floor(Math.random() * 2000) + 1000;
                    reactionTimeout = setTimeout(() => {
                        if (waitingForGreen) {
                            reactionBox.classList.add('ready');
                            reactionBox.textContent = 'CLICK NOW!';
                            startTime = Date.now();
                        }
                    }, delay);
                }
            });
            reactionReset.addEventListener('click', resetReaction);

            const contactForm = document.getElementById('contactForm');
            const formFeedback = document.getElementById('formFeedback');
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                formFeedback.className = 'form-feedback';
                formFeedback.textContent = '';
                formFeedback.style.display = 'none';
                const name = document.getElementById('formName').value.trim();
                const email = document.getElementById('formEmail').value.trim();
                const subject = document.getElementById('formSubject').value.trim();
                const message = document.getElementById('formMessage').value.trim();
                let errors = [];
                if (name.length < 2) errors.push('Name must be at least 2 characters.');
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address.');
                if (subject.length < 3) errors.push('Subject must be at least 3 characters.');
                if (message.length < 10) errors.push('Message must be at least 10 characters.');
                if (errors.length > 0) {
                    formFeedback.className = 'form-feedback error';
                    formFeedback.textContent = errors.join(' ');
                    formFeedback.style.display = 'block';
                } else {
                    formFeedback.className = 'form-feedback success';
                    formFeedback.textContent = 'Message sent successfully! I will get back to you within 24 hours.';
                    formFeedback.style.display = 'block';
                    contactForm.reset();
                    setTimeout(() => { formFeedback.style.display = 'none'; }, 6000);
                }
            });

            document.getElementById('currentYear').textContent = new Date().getFullYear();

            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        const navHeight = navbar.offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                });
            });
        });

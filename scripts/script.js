document.addEventListener('DOMContentLoaded', () => {
    
    /* ------------------------------------------------
       1. SCROLL ANIMATION
    ------------------------------------------------ */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('waiting');
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => {
        el.classList.add('waiting'); 
        scrollObserver.observe(el);        
    });

    /* ------------------------------------------------
       2. THEME SWITCHER
    ------------------------------------------------ */
    const themeButtons = document.querySelectorAll('[data-set-theme]');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('portfolio-theme') || 'midnight-cyber';
    
    setTheme(savedTheme);

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            setTheme(button.getAttribute('data-set-theme'));
        });
    });

    function setTheme(themeName) {
        htmlElement.setAttribute('data-theme', themeName);
        localStorage.setItem('portfolio-theme', themeName);
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-set-theme') === themeName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /* ------------------------------------------------
       3. TYPEWRITER EFFECT (Hero Section)
    ------------------------------------------------ */
    const typeTarget = document.getElementById("typewriter");
    const phrases = ["power the web.", "scale effortlessly.", "handle the data."];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typeTarget.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeTarget.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; 
        }

        setTimeout(typeEffect, typeSpeed);
    }
    
    if(typeTarget) setTimeout(typeEffect, 1000);

    /* ------------------------------------------------
       4. MAGNETIC BUTTONS
    ------------------------------------------------ */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    /* ------------------------------------------------
       5. STAT NUMBER COUNTER
    ------------------------------------------------ */
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    });

    counters.forEach(counter => counterObserver.observe(counter));

    /* ------------------------------------------------
       6. API MOCK TERMINAL (Fixed Text Rendering & Auto-Scroll)
    ------------------------------------------------ */
    const runBtn = document.getElementById('run-cmd-btn');
    const terminalOutput = document.getElementById('terminal-output');
    
    const mockApiResponse = {
        "status": 200,
        "timestamp": new Date().toISOString(),
        "developer": {
            "name": "Tathya Dixit",
            "role": "Backend Developer",
            "specialty": "Django & APIs",
            "location": "Alwar, Rajasthan",
            "status": "Available for hire"
        },
        "skills": {
            "languages": ["Python", "SQL", "JavaScript"],
            "frameworks": ["Django", "Django REST", "React.js"],
            "infrastructure": ["PostgreSQL", "Docker", "Git"]
        }
    };

    if(runBtn && terminalOutput) {
        runBtn.addEventListener('click', () => {
            // Disable button during fetching
            runBtn.disabled = true;
            runBtn.innerText = "Fetching...";
            
            // Clear out terminal and start fresh
            terminalOutput.innerHTML = "";
            
            // Step 1: Initial Text Node (Connecting...)
            const initText = document.createTextNode("Connecting to api.tathyadixit.com...\n");
            terminalOutput.appendChild(initText);

            // Simulate Network Delay
            setTimeout(() => {
                const headersText = document.createTextNode("HTTP/1.1 200 OK\nContent-Type: application/json\n\n");
                terminalOutput.appendChild(headersText);
                
                // Format JSON 
                const jsonString = JSON.stringify(mockApiResponse, null, 2);
                let i = 0;
                
                // Step 2: Create a dedicated SPAN container for the JSON text
                // This stops the browser from messing up the HTML tags while typing!
                const jsonContainer = document.createElement('span');
                jsonContainer.style.color = "var(--accent)";
                terminalOutput.appendChild(jsonContainer);

                // Typewriter effect inside the secure span container
                const typeInterval = setInterval(() => {
                    jsonContainer.textContent += jsonString.charAt(i);
                    i++;
                    
                    // Auto-scroll to the bottom of the container
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;

                    if(i >= jsonString.length) {
                        clearInterval(typeInterval);
                        runBtn.disabled = false;
                        runBtn.innerText = "Send Request";
                    }
                }, 10); 

            }, 800); 
        });
    }

    /* ------------------------------------------------
       7. LIVE DATA VISUALIZATION (Metrics Chart)
    ------------------------------------------------ */
    const canvas = document.getElementById('latencyChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let dataPoints = Array.from({length: 20}, () => Math.floor(Math.random() * 30) + 30);
        
        function resizeCanvas() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function drawChart() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const padding = 10;
            const width = canvas.width - padding * 2;
            const height = canvas.height - padding * 2;
            
            const style = getComputedStyle(document.body);
            const accentColor = style.getPropertyValue('--accent').trim() || '#06b6d4';
            
            ctx.beginPath();
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
            
            const maxVal = 100; 
            const stepX = width / (dataPoints.length - 1);
            
            dataPoints.forEach((val, index) => {
                const x = padding + index * stepX;
                const y = padding + height - (val / maxVal) * height;
                if (index === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            
            ctx.lineTo(padding + width, canvas.height - padding);
            ctx.lineTo(padding, canvas.height - padding);
            ctx.closePath();
            
            ctx.globalAlpha = 0.15; 
            ctx.fillStyle = accentColor;
            ctx.fill();
            ctx.globalAlpha = 1.0; 
        }

        setInterval(() => {
            const newVal = Math.floor(Math.random() * 30) + 30; 
            dataPoints.push(newVal);
            dataPoints.shift();
            drawChart();
            
            const avg = Math.round(dataPoints.reduce((a,b) => a + b, 0) / dataPoints.length);
            document.getElementById('avg-latency').innerText = `${avg}ms`;
        }, 1500);
        
        const themeObserver = new MutationObserver(drawChart);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    /* ------------------------------------------------
       8. MOBILE MENU TOGGLE
    ------------------------------------------------ */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navContent = document.querySelector('.nav-content');
    const mobileIcon = mobileToggle ? mobileToggle.querySelector('i') : null;
    const navLinks = document.querySelectorAll('.nav-links a');

    if (mobileToggle && navContent) {
        mobileToggle.addEventListener('click', () => {
            navContent.classList.toggle('active');
            
            if (navContent.classList.contains('active')) {
                mobileIcon.classList.remove('ri-menu-3-line');
                mobileIcon.classList.add('ri-close-line');
            } else {
                mobileIcon.classList.remove('ri-close-line');
                mobileIcon.classList.add('ri-menu-3-line');
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navContent.classList.remove('active');
                mobileIcon.classList.remove('ri-close-line');
                mobileIcon.classList.add('ri-menu-3-line');
            });
        });
    }
});
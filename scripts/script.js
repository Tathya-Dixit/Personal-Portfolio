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
            typeSpeed = 2000; // Pause at the end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before typing new word
        }

        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start the typing effect
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
            
            // Apply slight movement based on cursor position
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            // Reset position smoothly
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    /* ------------------------------------------------
       5. STAT NUMBER COUNTER
    ------------------------------------------------ */
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Lower is faster

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
       6. API MOCK TERMINAL
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
            terminalOutput.style.color = "var(--text-main)";
            terminalOutput.innerHTML = "Connecting to api.tathyadixit.com...\n";

            // Simulate Network Delay
            setTimeout(() => {
                terminalOutput.innerHTML += "HTTP/1.1 200 OK\nContent-Type: application/json\n\n";
                
                // Format JSON with nice coloring
                const jsonString = JSON.stringify(mockApiResponse, null, 2);
                let i = 0;
                
                // Typewriter effect for JSON
                terminalOutput.innerHTML += `<span style="color: var(--accent);">`;
                const typeInterval = setInterval(() => {
                    terminalOutput.innerHTML += jsonString.charAt(i);
                    i++;
                    if(i >= jsonString.length) {
                        clearInterval(typeInterval);
                        terminalOutput.innerHTML += `</span>`;
                        runBtn.disabled = false;
                        runBtn.innerText = "Send Request";
                    }
                }, 10); // Typing speed

            }, 800); // Simulated delay
        });
    }

});
document.addEventListener('DOMContentLoaded', () => {
    
    /* ------------------------------------------------
       1. SCROLL ANIMATION
    ------------------------------------------------ */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('waiting');
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    animatedElements.forEach(el => {
        el.classList.add('waiting'); 
        observer.observe(el);        
    });

    /* ------------------------------------------------
       2. THEME SWITCHER LOGIC
    ------------------------------------------------ */
    const themeButtons = document.querySelectorAll('[data-set-theme]');
    const htmlElement = document.documentElement;

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('portfolio-theme') || 'midnight-cyber';
    setTheme(savedTheme);

    // Add click event listeners to all theme buttons
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-set-theme');
            setTheme(theme);
        });
    });

    // Function to update theme and active button states
    function setTheme(themeName) {
        // Update data attribute on HTML tag
        htmlElement.setAttribute('data-theme', themeName);
        
        // Save to localStorage
        localStorage.setItem('portfolio-theme', themeName);

        // Update active class on buttons
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-set-theme') === themeName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
});
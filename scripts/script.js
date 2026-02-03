document.addEventListener('DOMContentLoaded', () => {
    /* ------------------------------------------------
       SCROLL ANIMATION
    ------------------------------------------------ */
    
    // Define the observer settings
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'waiting' state and add 'visible'
                entry.target.classList.remove('waiting');
                entry.target.classList.add('visible');
                
                // Stop watching once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Find elements, hide them, and start watching
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    animatedElements.forEach(el => {
        el.classList.add('waiting'); // Make invisible initially
        observer.observe(el);        // Start watching
    });
});
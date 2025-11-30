// Client-side navigation to prevent page reloads and animation refresh
(function() {
    'use strict';

    // Cache for loaded pages
    const pageCache = new Map();

    // Function to update the active navigation state
    function updateActiveNav(path) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === path || (path === '/' && href === '/')) {
                link.classList.remove('text-zinc-400', 'hover:text-zinc-100');
                link.classList.add('text-green-600');
            } else {
                link.classList.remove('text-green-600');
                link.classList.add('text-zinc-400', 'hover:text-zinc-100');
            }
        });
    }

    // Function to load page content
    async function loadPage(url, addToHistory = true) {
        try {
            // Show loading state (optional)
            const mainContent = document.querySelector('main[role="main"]');
            if (!mainContent) return;

            // Check cache first
            let html;
            if (pageCache.has(url)) {
                html = pageCache.get(url);
            } else {
                // Fetch the full page
                const response = await fetch(url);
                if (!response.ok) throw new Error('Page not found');

                const fullHtml = await response.text();

                // Parse the HTML and extract main content
                const parser = new DOMParser();
                const doc = parser.parseFromString(fullHtml, 'text/html');
                const newMain = doc.querySelector('main[role="main"]');

                if (!newMain) throw new Error('Main content not found');

                html = newMain.innerHTML;

                // Cache the content
                pageCache.set(url, html);
            }

            setTimeout(() => {
                // Save a reference to the canvas before updating content
                const existingCanvas = document.querySelector('canvas[data-protected="true"]');

                // Update content
                mainContent.innerHTML = html;

                // If canvas was somehow removed, log error
                const canvasStillExists = document.querySelector('canvas');
                if (!canvasStillExists && existingCanvas) {
                    console.error('Canvas was removed! This should not happen.');
                    // Re-append it
                    document.body.appendChild(existingCanvas);
                }

                // Re-attach event listeners to new links BEFORE fading in
                attachLinkListeners();

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 150);

            // Update browser history
            if (addToHistory) {
                window.history.pushState({ path: url }, '', url);
            }

            // Update active navigation
            updateActiveNav(url);

        } catch (error) {
            console.error('Error loading page:', error);
            // Fallback to regular navigation
            window.location.href = url;
        }
    }

    // Function to attach click listeners to internal links
    function attachLinkListeners() {
        const links = document.querySelectorAll('a[href^="/"]');

        links.forEach(link => {
            // Skip if already has listener
            if (link.dataset.spaListener === 'true') return;

            // Skip external links
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || link.getAttribute('target') === '_blank') {
                return;
            }

            link.dataset.spaListener = 'true';

            link.addEventListener('click', (e) => {
                // Only handle left clicks without modifier keys
                if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) {
                    return;
                }

                e.preventDefault();
                const url = link.getAttribute('href');

                // Don't reload if we're already on this page
                if (url === window.location.pathname) {
                    return;
                }

                loadPage(url);
            });
        });
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.path) {
            loadPage(e.state.path, false);
        } else {
            loadPage(window.location.pathname, false);
        }
    });

    // Add smooth transition CSS
    const style = document.createElement('style');
    style.textContent = `
        main[role="main"] {
            transition: opacity 0.15s ease-in-out;
        }
        canvas[data-protected="true"] {
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
        // Set initial state
        window.history.replaceState({ path: window.location.pathname }, '', window.location.pathname);

        // Attach listeners
        attachLinkListeners();

        // Update active nav
        updateActiveNav(window.location.pathname);
    });
})();

document.addEventListener('DOMContentLoaded', function() {

    function getCurrentYear() {
        return new Date().getFullYear();
    }

    function getLastModified() {
        let lastModified = document.lastModified;
        if (!lastModified) return 'Unknown';


        let modifiedDate = new Date(lastModified + ' UTC');

        if (isNaN(modifiedDate.getTime())) return lastModified;

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        return modifiedDate.toLocaleString('en-US', options);
    }

    function updateCopyrightYear() {
        const el = document.getElementById('copyright-year');
        if (!el) return;
        el.textContent = `© ${getCurrentYear()}`;
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.transition = 'opacity 0.3s ease';
            el.style.opacity = '1';
        }, 100);
    }

    function updateLastModified() {
        const el = document.getElementById('lastModified');
        if (!el) return;
        el.textContent = `Last updated: ${getLastModified()}`;
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.transition = 'opacity 0.3s ease';
            el.style.opacity = '1';
        }, 150);
    }

    function addUpdateAnimation(element) {
        if (!element) return;
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.2s ease';
        setTimeout(() => element.style.transform = 'scale(1)', 200);
    }

    function checkYearChange() {
        const el = document.getElementById('copyright-year');
        if (!el) return;
        const currentYear = getCurrentYear();
        if (parseInt(el.textContent.replace('© ', '')) !== currentYear) updateCopyrightYear();
    }

    function initializeDates() {
        updateCopyrightYear();
        updateLastModified();
        setTimeout(() => {
            addUpdateAnimation(document.getElementById('copyright-year'));
            addUpdateAnimation(document.getElementById('lastModified'));
        }, 300);
    }

    initializeDates();
    setInterval(checkYearChange, 60000);

    window.dateUtils = {
        getCurrentYear,
        getLastModified,
        updateCopyrightYear,
        updateLastModified
    };
});

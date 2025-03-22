import { getBasePath } from './utils/commons.js';

function replaceHrefInProductionMode() {
    const basePath = getBasePath();

    if (basePath === '') { return; }

    let links = document.querySelectorAll('a[href]');

    links.forEach(link => {
        let href = link.getAttribute("href");

        // Se il link inizia con "/" (quindi è relativo) e non ha già basePath
        if (href.startsWith("/") && !href.startsWith(basePath)) {
            link.setAttribute("href", basePath + href);
        }
    });
}

document.addEventListener("DOMContentLoaded", function() { 
    replaceHrefInProductionMode();
});
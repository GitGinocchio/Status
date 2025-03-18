function replaceHrefInProductionMode() {
    let links = document.querySelectorAll('a[href]');

    if (window.location.hostname.includes("127.0.0.1") || window.location.hostname.includes("localhost")) {
        return; // Se siamo in sviluppo, non fare nulla
    }

    // Ottieni solo la prima directory dopo il dominio
    let basePath = "/" + window.location.pathname.split("/")[1];

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
function replaceHrefInProductionMode() {
    let links = document.querySelectorAll('a[href]');

    if (window.location.hostname.includes("127.0.0.1") || window.location.hostname.includes("localhost")) {
        return; // Se siamo in sviluppo, non fare nulla
    }

    let pathSegments = window.location.pathname.split("/").filter(seg => seg.length > 0);
    let basePath = pathSegments.length > 0 ? `/${pathSegments[0]}` : "";

    links.forEach(link => {
        let href = link.getAttribute("href");

        // Se il link inizia con "/" e non ha già il basePath, aggiungilo
        if (href.startsWith("/") && !href.startsWith(basePath)) {
            link.setAttribute("href", basePath + href);
        }
    });
}

document.addEventListener("DOMContentLoaded", function() { 
    replaceHrefInDevelopmentMode();
});
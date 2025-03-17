function replaceHrefInDevelopmentMode() {
    let links = document.querySelectorAll('a[href]');
  
    for (let i = 0; i < links.length; i++) {
        let link = links[i];

        if (link.hostname != window.location.hostname) { return; }


        const before = link.href;

        const defaultRoute = window.location.pathname.split('/')[1]
        const pathname = link.pathname;

        if (!link.hostname.includes('127.0.0.1') && !link.hostname.includes('localhost')) {
            link.href = `${defaultRoute}${pathname}`
        }

        console.log("defaultRoute: ", defaultRoute, "href (before): ", before, "href (after): ", link.href)
    }
}

document.addEventListener("DOMContentLoaded", function() { 
    replaceHrefInDevelopmentMode();
});
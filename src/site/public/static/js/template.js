function replaceHrefInDevelopmentMode() {
    let links = document.querySelectorAll('a[href]');
  
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        if (link.href.includes('127.0.0.1') || link.href.includes('localhost')) {
            link.href = link.href.replace('/Status', '/src/site/public');
        }
    }
}

document.addEventListener("DOMContentLoaded", function() { 
    replaceHrefInDevelopmentMode();
});
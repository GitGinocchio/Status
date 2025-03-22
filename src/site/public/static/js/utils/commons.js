export function getBasePath() {
    // Check if the hostname is a private IP address using a regex
    const isPrivateIp = /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3})|^(172\.(1[6-9]|[2-9]\d)\.\d{1,3}\.\d{1,3})|^(192\.168\.\d{1,3}\.\d{1,3})$/
                        .test(window.location.hostname);

    return isPrivateIp || window.location.hostname.includes("127.0.0.1") || window.location.hostname.includes("localhost") ? 
    '' : "/" + window.location.pathname.split("/")[1];
}

export async function fetchData() {
    const basePath = getBasePath();

    const url = `${window.location.origin}${basePath}/data/database.json`

    const response = await fetch(url);
    const data = await response.json();

    return data;
}
function showPopup(event, data) {
    const popupContainer = document.getElementById('popup-container');

    const popupContent = document.createElement('div');
    popupContent.innerHTML = `
    <div class="popup-header">
        <h2>Metrics</h2>
    </div>
    <div class="popup-body">
        <p>Status: ${data.status}</p>
        <p>Code: ${data.code}</p>
        <p>Latency: ${data.latency} seconds</p>
    </div>
    `;

    // Add the popup content to the container
    popupContainer.childNodes.forEach(child => child.remove());
    popupContainer.appendChild(popupContent);

    // Show the popup
    popupContainer.style.display = 'block';

}

function hidePopup(event) {
    const popupContainer = document.getElementById('popup-container');
    popupContainer.style.display = 'none';
    popupContainer.childNodes.forEach(child => child.remove());
}

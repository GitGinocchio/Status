// Funzione per mostrare il tooltip
function showPopup(event, metric) {
    // Rimuove eventuali tooltip esistenti
    hidePopup();

    // Crea l'elemento tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';

    // Prepara il contenuto: status e timestamp;
    tooltip.innerHTML = `
    <div>
        <div class="tooltip-content">
            <strong>Status:</strong> ${metric.status}<br>
            <strong>Code:</strong> ${metric.code}<br>
            ${metric.latency ? `<strong>Latency:</strong> ${metric.latency} seconds<br>` : "" }
            ${metric.min_latency ? `<strong>Min Latency:</strong> ${metric.min_latency} seconds<br>` : "" }
            ${metric.max_latency ? `<strong>Max Latency:</strong> ${metric.max_latency} seconds<br>` : "" }
        </div>
        <div class="tooltip-footer">
            <strong>${metric.timestamp}</strong>
        </div>
    </div>
    `;

    // Posiziona il tooltip appena sotto il cursore con un offset di 10px
    tooltip.style.left = (event.clientX + 10) + 'px';
    tooltip.style.top = (event.clientY + 25) + 'px';

    // Aggiungi il tooltip al body in modo da non essere influenzato da altri contenitori
    document.body.appendChild(tooltip);
}

// Funzione per rimuovere il tooltip
function hidePopup() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

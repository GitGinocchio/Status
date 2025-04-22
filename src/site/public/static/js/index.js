
let realContentTimeout = null;

function showPopup(event, metric) {
    let tooltip = document.querySelector('.tooltip');
    if (!tooltip) { 
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
    }
    tooltip.classList.remove('hidden');

    const realContent = `
    <div>
        <div class="content">
            <strong>Status:</strong> ${metric.status}<br>
            <strong>Code:</strong> ${metric.code}<br>
            ${metric.latency ? `<strong>Latency:</strong> ${metric.latency} seconds<br>` : "" }
            ${metric.avg_latency ? `<strong>Avg Latency:</strong> ${metric.avg_latency} seconds<br>` : "" }
            ${metric.min_latency ? `<strong>Min Latency:</strong> ${metric.min_latency} seconds<br>` : "" }
            ${metric.max_latency ? `<strong>Max Latency:</strong> ${metric.max_latency} seconds<br>` : "" }
        </div>
        <div class="footer">
            <strong>${metric.timestamp}</strong>
        </div>
    </div>
    `;

    tooltip.innerHTML = realContent;

    tooltip.style.left = (event.clientX + 10) + 'px';
    tooltip.style.top = (event.clientY + 25) + 'px';

    document.body.appendChild(tooltip);
}

// Funzione per rimuovere il tooltip
function hidePopup() {
    const tooltip = document.querySelector('.tooltip');
    tooltip.classList.add('hidden');
}

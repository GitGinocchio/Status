
let realContentTimeout = null;

function showPopup(event, metric) {
    let tooltip = document.querySelector('.tooltip');
    if (!tooltip) { 
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
    }

    tooltip.classList.remove('hidden');

    const skeletonContent = `
    <div>
        <div class="content">
            <strong>Status:</strong> <span class="skeleton"></span><br>
            <strong>Code:</strong> <span class="skeleton"></span><br>
            ${metric.latency ? `<strong>Latency:</strong> <span class="skeleton"></span><br>` : "" }
            ${metric.avg_latency ? `<strong>Avg Latency:</strong> <span class="skeleton"></span><br>` : "" }
            ${metric.min_latency ? `<strong>Min Latency:</strong> <span class="skeleton"></span><br>` : "" }
            ${metric.max_latency ? `<strong>Max Latency:</strong> <span class="skeleton"></span><br>` : "" }
        </div>
        <div class="footer">
            <strong><span class="skeleton"></span></strong>
        </div>
    </div>
    `;

    // tooltip.innerHTML = skeletonContent;
    // clearTimeout(realContentTimeout);

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

    // realContentTimeout = setTimeout(() => { tooltip.innerHTML = realContent; }, 300);

    tooltip.innerHTML = realContent;

    // Posiziona il tooltip appena sotto il cursore con un offset di 10px
    tooltip.style.left = (event.clientX + 10) + 'px';
    tooltip.style.top = (event.clientY + 25) + 'px';

    // Aggiungi il tooltip al body in modo da non essere influenzato da altri contenitori
    document.body.appendChild(tooltip);
}

// Funzione per rimuovere il tooltip
function hidePopup() {
    const tooltip = document.querySelector('.tooltip');
    tooltip.classList.add('hidden');
}

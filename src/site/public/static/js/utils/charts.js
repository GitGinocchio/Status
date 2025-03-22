function getRadiusByDeviceWidth() {
    return (window.innerWidth / 1920) * 2.5;
}

function getBorderWidthByDeviceWidth() {
    return (window.innerWidth / 1920) * 2;
}

function getFontSizeByDeviceWidth() {
    return (window.innerWidth / 1920) * 12;
}

function getBorderDashByDeviceWidth() {
    return [(window.innerWidth / 1920) * 2.5, (window.innerWidth / 1920) * 2.5];
}

export function getLatencyGraphConfig(ctx, data) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(54, 162, 235, 0.6)");
    gradient.addColorStop(1, "rgba(54, 162, 235, 0.1)");

    return  {
        type: "line",
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: { duration: 500 },
            interaction: {
                axis: "x",
                mode : window.innerWidth  < 1000 ? "x" : "point", 
                intersect: true, 
            },
            scales: {
                x: {
                    title: { display: window.innerWidth > 500 ? true : false, text: "Datetime" },
                    min: data.labels.length > 50 ? data.labels.length - 50 : 0,         // Mostra solo gli ultimi 10 punti inizialmente
                    max: data.labels.length - 1,                                        // Fissa il massimo all'ultimo valore
                    scaleLabel: {
                        fontSize: getFontSizeByDeviceWidth()
                    }
                },
                y: {
                    beginAtZero: true,
                    title: { display: window.innerWidth > 500 ? true : false, text: "Latency (s)" },
                    min: 0,
                    max: Math.max(...data.latencies) * 1.2,  // Blocca il massimo
                    scaleLabel: {
                        fontSize: getFontSizeByDeviceWidth()
                    }
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                        touch: { enabled: window.innerWidth > 500 ? true : false, threshold: 5 },
                        drag: { enabled: window.innerWidth <= 500 ? true : false, threshold: 5 }
                    },
                    zoom: {
                        wheel: { enabled: true, modifierKey: 'ctrl' },
                        pinch: { enabled: true },
                        mode: "x",
                    },
                }
                
            },
            tooltip: {
                position: 'nearest',
            }
        },
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: "Avg Latency",
                    data: data.avg_latencies,
                    borderColor: "rgba(255, 206, 86, 1)",
                    borderWidth: getBorderWidthByDeviceWidth(),
                    pointRadius: getRadiusByDeviceWidth(),
                    borderDash: getBorderDashByDeviceWidth(), // Linea tratteggiata
                    fill: false
                },
                {
                    label: "Min latency",
                    data: data.min_latencies,
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: getBorderWidthByDeviceWidth(),
                    pointRadius: getRadiusByDeviceWidth(),
                    borderDash: getBorderDashByDeviceWidth(),
                    fill: false
                },
                {
                    label: "Max Latency",
                    data: data.max_latencies,
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: getBorderWidthByDeviceWidth(),
                    pointRadius: getRadiusByDeviceWidth(),
                    borderDash: getBorderDashByDeviceWidth(),
                    fill: false
                },
                {
                    label: "Latency in Time",
                    data: data.latencies,
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: gradient,
                    borderWidth: getBorderWidthByDeviceWidth(),
                    fill: true,
                    pointRadius: getRadiusByDeviceWidth(),
                    pointBackgroundColor: "rgba(54, 162, 235, 1)",
                    cubicInterpolationMode: 'monotone',
                    tension: 0.3
                }
            ]
        },
    }
}

export function getUptimePercentageConfig(ctx, data) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(54, 162, 235, 0.6)");
    gradient.addColorStop(1, "rgba(54, 162, 235, 0.1)");

    return {
        type: "line",
        options: {
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                        threshold: 0.1,
                        touch: { enabled: true, threshold: 5 },
                        onPanComplete: ({ chart }) => { chart.update("none"); }
                    },
                    zoom: {
                        wheel: { enabled: true, modifierKey: 'ctrl' },
                        pinch: { enabled: true },
                        mode: "x",
                    }
                }
                
            }
        }
    }
}




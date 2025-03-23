function getRadiusByDeviceWidth() {
    return (window.innerWidth / 1920) * 2.5;
}

function getBorderWidthByDeviceWidth() {
    return (window.innerWidth / 1920) * 2;
}

function getFontSizeByDeviceWidth() {
    console.log(window.innerWidth, window.outerWidth);
    return (window.innerWidth / 1920) * 12;
}

function getBorderDashByDeviceWidth() {
    return [(window.innerWidth / 1920) * 5, (window.innerWidth / 1920) * 5];
}

function getDotsToDisplayByDeviceWidth() {
    return (window.innerWidth / 1920) * 50;
}

const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;

const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');
  
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
      tooltipEl.style.borderRadius = '3px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';
  
      const table = document.createElement('table');
      table.style.margin = '0px';
  
      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
  
    return tooltipEl;
};
  
const externalTooltipHandler = (context) => {
    // Tooltip Element
    const {chart, tooltip} = context;
    const tooltipEl = getOrCreateTooltip(chart);
  
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
  
    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map(b => b.lines);
  
      const tableHead = document.createElement('thead');
  
      titleLines.forEach(title => {
        const tr = document.createElement('tr');
        tr.style.borderWidth = 0;
  
        const th = document.createElement('th');
        th.style.borderWidth = 0;
        const text = document.createTextNode(title);
  
        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });
  
      const tableBody = document.createElement('tbody');
      bodyLines.forEach((body, i) => {
        const colors = tooltip.labelColors[i];
  
        const span = document.createElement('span');
        span.style.background = colors.backgroundColor;
        span.style.borderColor = colors.borderColor;
        span.style.borderWidth = '2px';
        span.style.marginRight = '10px';
        span.style.height = '10px';
        span.style.width = '10px';
        span.style.display = 'inline-block';
  
        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = 0;
  
        const td = document.createElement('td');
        td.style.borderWidth = 0;
  
        const text = document.createTextNode(body);
  
        td.appendChild(span);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });
  
      const tableRoot = tooltipEl.querySelector('table');
  
      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }
  
      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }
  
    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
  
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};

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
                axis: "xy",
                mode : "index",
                intersect: false, 
            },
            scales: {
                x: {
                    title: { display: window.innerWidth > 500 ? true : false, text: "Datetime" },
                    min: data.labels.length > getDotsToDisplayByDeviceWidth() ? data.labels.length - getDotsToDisplayByDeviceWidth() : 0,         // Mostra solo gli ultimi 10 punti inizialmente
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
                        touch: { enabled: window.innerWidth > 1000 ? true : false, threshold: 5 },
                        drag: { enabled: window.innerWidth <= 1000 ? true : false, threshold: 5 }
                    },
                    zoom: {
                        wheel: { enabled: true, modifierKey: 'ctrl' },
                        drag: { enabled: window.innerWidth <= 1000 ? true : false, threshold: 5 },
                        mode: "x",
                    },
                },
                legend: {
                    labels: {
                      usePointStyle: true,
                    },
                    position: 'top',
                    align: window.innerWidth <= 1000 ? 'start' : 'center',

                },
                tooltip: {
                    usePointStyle: true
                }
            },
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: externalTooltipHandler
            },
            onClick(e) {
                const chart = e.chart;
                chart.options.plugins.zoom.zoom.wheel.enabled = !chart.options.plugins.zoom.zoom.wheel.enabled;
                chart.options.plugins.zoom.zoom.pinch.enabled = !chart.options.plugins.zoom.zoom.pinch.enabled;
                chart.update();
            },
            beforeDraw(chart, args, options) {
                const {ctx, chartArea: {left, top, width, height}} = chart;
                if (chart.options.plugins.zoom.zoom.wheel.enabled) {
                    ctx.save();
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(left, top, width, height);
                    ctx.restore();
                }
                chart.update();
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
                    segment: {
                        borderColor: ctx => skipped(ctx, 'rgba(54, 162, 235, 0.7)'),
                        borderDash: ctx => skipped(ctx, [6, 6]),
                        backgroundColor: ctx => skipped(ctx, "rgba(0, 0, 0, 0)")
                    },
                    spanGaps: true,
                    backgroundColor: gradient,
                    borderWidth: getBorderWidthByDeviceWidth(),
                    pointRadius: getRadiusByDeviceWidth(),
                    pointBackgroundColor: "rgba(54, 162, 235, 1)",
                    cubicInterpolationMode: 'monotone',
                    tension: 0.3,
                    fill: true
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




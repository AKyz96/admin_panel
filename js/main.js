let selectedSwitcherValue =
  document.querySelector(".switcher-btn.active")?.textContent.trim() || "";
let selectedDropdownValues = {
  recruteur: "tous",
  type: "tous",
  voyant: "tous",
};

document.addEventListener("DOMContentLoaded", function () {
  const switcherBtns = document.querySelectorAll(".switcher-btn");
  switcherBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      switcherBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      selectedSwitcherValue = this.textContent.trim();
    });
  });

  let datepickerInstance = null;
  if (window.flatpickr) {
    datepickerInstance = flatpickr("#datepicker", {
      locale: {
        ...flatpickr.l10ns.fr,
        rangeSeparator: " - ",
      },
      mode: "range",
      dateFormat: "d.m.y",
    });
  }

  document.querySelectorAll(".dropdown-item.selected").forEach((item) => {
    if (
      !item.querySelector(".dropdown-check") &&
      !item.querySelector(".voyant-checkbox")
    ) {
      const img = document.createElement("img");
      img.src = "assets/icons/icon_check.svg";
      img.alt = "selected";
      img.className = "dropdown-check";
      item.appendChild(img);
    }
  });

  const dropdowns = document.querySelectorAll(".custom-dropdown");
  dropdowns.forEach((dropdown) => {
    const selected = dropdown.querySelector(".dropdown-selected");
    const list = dropdown.querySelector(".dropdown-list");
    const items = dropdown.querySelectorAll(".dropdown-item");
    const filterKey = dropdown.dataset.filter;

    selected.addEventListener("click", function (e) {
      dropdowns.forEach((d) => {
        if (d !== dropdown) d.classList.remove("open");
      });
      dropdown.classList.toggle("open");
    });

    items.forEach((item) => {
      item.addEventListener("click", function () {
        items.forEach((i) => {
          i.classList.remove("selected");
          const check = i.querySelector(".dropdown-check");
          if (check) check.remove();
        });

        this.classList.add("selected");
        if (!this.querySelector(".voyant-checkbox")) {
          const img = document.createElement("img");
          img.src = "assets/icons/icon_check.svg";
          img.alt = "selected";
          img.className = "dropdown-check";
          this.appendChild(img);
        }

        dropdown.querySelector(".dropdown-selected").textContent =
          this.textContent.trim();
        selectedDropdownValues[filterKey] = this.dataset.value;

        if (filterKey !== "voyant") {
          dropdown.classList.remove("open");
        }
      });
    });
  });

  document.addEventListener("click", function (e) {
    document.querySelectorAll(".custom-dropdown.open").forEach((dropdown) => {
      if (dropdown.dataset.filter === "voyant") {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove("open");
        }
      } else {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove("open");
        }
      }
    });
  });

  const grouperDropdown = document.querySelector(
    '.custom-dropdown[data-filter="mois"]'
  );
  const grouperList = grouperDropdown?.querySelector(".dropdown-list");
  const grouperSelected = grouperDropdown?.querySelector(".dropdown-selected");

  const grouperOptions = {
    Jour: [{ value: "jour", label: "Jour" }],
    Semaine: [{ value: "jour", label: "Jour" }],
    Mois: [
      { value: "jour", label: "Jour" },
      { value: "semaine", label: "Semaine" },
    ],
    Année: [
      { value: "semaine", label: "Semaine" },
      { value: "mois", label: "Mois" },
    ],
  };

  function updateGrouperDropdown(selectedSwitcher) {
    if (!grouperList) return;

    grouperList.innerHTML = "";
    const options = grouperOptions[selectedSwitcher] || [];
    options.forEach((opt, idx) => {
      const div = document.createElement("div");
      div.className = "dropdown-item" + (idx === 0 ? " selected" : "");
      div.dataset.value = opt.value;
      div.textContent = opt.label;
      if (idx === 0) {
        const img = document.createElement("img");
        img.src = "assets/icons/icon_check.svg";
        img.alt = "selected";
        img.className = "dropdown-check";
        div.appendChild(img);

        if (grouperSelected) grouperSelected.textContent = opt.label;
      }
      grouperList.appendChild(div);
    });

    const items = grouperList.querySelectorAll(".dropdown-item");
    items.forEach((item) => {
      item.addEventListener("click", function () {
        items.forEach((i) => {
          i.classList.remove("selected");
          const check = i.querySelector(".dropdown-check");
          if (check) check.remove();
        });
        this.classList.add("selected");
        const img = document.createElement("img");
        img.src = "assets/icons/icon_check.svg";
        img.alt = "selected";
        img.className = "dropdown-check";
        this.appendChild(img);
        if (grouperSelected)
          grouperSelected.textContent = this.textContent.trim();
        grouperDropdown.classList.remove("open");
      });
    });
  }

  updateGrouperDropdown(selectedSwitcherValue);

  switcherBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const value = this.textContent.trim();
      updateGrouperDropdown(value);
    });
  });

  function setDatepickerRange(start, end) {
    if (datepickerInstance) {
      datepickerInstance.setDate([start, end], true);
    }
  }

  function getRangeForSwitcher(switcher) {
    const today = new Date();
    let start, end;
    end = today;
    if (switcher === "Jour") {
      start = today;
    } else if (switcher === "Semaine") {
      start = new Date(today);
      start.setDate(start.getDate() - 7);
    } else if (switcher === "Mois") {
      start = new Date(today);
      start.setDate(start.getDate() - 30);
    } else if (switcher === "Année") {
      start = new Date(today);
      start.setDate(start.getDate() - 365);
    } else {
      start = today;
    }
    return [start, end];
  }

  if (datepickerInstance) {
    const [start, end] = getRangeForSwitcher(selectedSwitcherValue);
    setDatepickerRange(start, end);
  }

  switcherBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const value = this.textContent.trim();
      const [start, end] = getRangeForSwitcher(value);
      setDatepickerRange(start, end);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const voyantDropdown = document.querySelector(
    '.custom-dropdown[data-filter="voyant"]'
  );
  if (!voyantDropdown) return;

  const checkboxes = voyantDropdown.querySelectorAll(".voyant-checkbox");
  const tousCheckbox = voyantDropdown.querySelector(
    '.voyant-checkbox[data-value="tous"]'
  );

  function updateDropdownSelected() {
    const checked = voyantDropdown.querySelectorAll(
      '.voyant-checkbox:checked:not([data-value="tous"])'
    );
    if (tousCheckbox.checked) {
      voyantDropdown.querySelector(
        ".dropdown-selected"
      ).textContent = `Tous (${checked.length} sélectionnés)`;
    } else if (checked.length === 0) {
      voyantDropdown.querySelector(".dropdown-selected").textContent = "Aucun";
    } else if (checked.length === 1) {
      voyantDropdown.querySelector(".dropdown-selected").textContent =
        checked[0].parentElement.textContent.trim();
    } else {
      voyantDropdown.querySelector(
        ".dropdown-selected"
      ).textContent = `${checked.length} sélectionnés`;
    }
  }

  tousCheckbox.addEventListener("change", function () {
    checkboxes.forEach((cb) => {
      cb.checked = tousCheckbox.checked;
    });
    updateDropdownSelected();
  });

  checkboxes.forEach((cb) => {
    if (cb === tousCheckbox) return;
    cb.addEventListener("change", function () {
      const checked = voyantDropdown.querySelectorAll(
        '.voyant-checkbox:checked:not([data-value="tous"])'
      );
      if (checked.length === checkboxes.length - 1) {
        tousCheckbox.checked = true;
        checkboxes.forEach((cb2) => (cb2.checked = true));
      } else if (checked.length === 0) {
        tousCheckbox.checked = false;
        checkboxes.forEach((cb2) => (cb2.checked = false));
      } else {
        tousCheckbox.checked = false;
      }
      updateDropdownSelected();
    });
  });

  updateDropdownSelected();
});

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("chart").getContext("2d");
  const labels = [
    "01 fév. 2025",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "01 fév. 2025",
  ];

  const chartLines = [
    {
      label: "Voyants actifs",
      color: "#E53935",
      yAxisID: "y",
      data: [102, 6, 7, 3, 9, 13, 15, 22, 25, 24],
    },
    {
      label: "Revenus totaux",
      color: "#7C3AED",
      yAxisID: "y",
      data: [100, 1250, 1555, 1700, 2000, 1800, 2500, 3000, 2800, 3500],
    },
    {
      label: "Heures en ligne",
      color: "#00916E",
      yAxisID: "y",
      data: [500.2, 800.8, 600.5, 1200, 1000, 1500, 1800.5, 2000, 2200, 2500],
    },
    {
      label: "Nombre d'appels",
      color: "#C04000",
      yAxisID: "y",
      data: [300, 500, 800, 600, 1200, 1000, 1500, 1800, 2000, 2200],
    },
    {
      label: "Durée",
      color: "#B8860B",
      yAxisID: "y1",
      data: [5, 10, 4, 18, 9, 18, 12, 28, 36, 40],
    },
  ];

  const checkboxes = Array.from(
    document.querySelectorAll('.stats-title input[type="checkbox"]')
  );

  function getActiveDatasets() {
    const active = chartLines.filter((line) =>
      checkboxes.find((cb) => cb.value === line.label && cb.checked)
    );

    if (active.length === 1) {
      return [
        {
          ...active[0],
          yAxisID: "y",
          borderColor: active[0].color,
          pointRadius: 0.5,
          pointHoverBorderWidth: 2,
        },
      ];
    }

    if (active.length === 2) {
      return [
        {
          ...active[0],
          yAxisID: "y",
          borderColor: active[0].color,
          pointRadius: 0.5,
          pointHoverBorderWidth: 2,
        },
        {
          ...active[1],
          yAxisID: "y1",
          borderColor: active[1].color,
          pointRadius: 0.5,
          pointHoverBorderWidth: 2,
        },
      ];
    }

    if (active.length >= 3) {
      return active.map((line, idx) => ({
        ...line,
        yAxisID: `y${idx}`,
        borderColor: line.color,
        pointRadius: 0.5,
        pointHoverBorderWidth: 2,
      }));
    }

    return active.map((line) => ({
      ...line,
      yAxisID: "y",
      borderColor: line.color,
      pointRadius: 0.5,
      pointHoverBorderWidth: 2,
    }));
  }

  function getScales() {
    const activeLines = chartLines.filter((line) =>
      checkboxes.find((cb) => cb.value === line.label && cb.checked)
    );

    if (activeLines.length === 1) {
      const line = activeLines[0];
      let min = Math.min(...line.data);
      let max = Math.max(...line.data);
      if (min === max) {
        min = 0;
        max = max + 1;
      } else {
        const padding = (max - min) * 0.1;
        min -= padding;
        max += padding;
      }
      return {
        y: {
          type: "linear",
          position: "left",
          min: min,
          max: max,
          display: true,
          ticks: { color: "#222" },
          grid: { color: "#e9edf1" },
        },
        y1: {
          type: "linear",
          position: "right",
          display: false,
          grid: { drawOnChartArea: false, color: "#e9edf1" },
          ticks: {
            callback: function (value) {
              const minutes = value;
              const h = String(Math.floor(minutes / 60)).padStart(2, "0");
              const m = String(minutes % 60).padStart(2, "0");
              return `${h}:${m}:00`;
            },
            color: "#222",
          },
        },
        x: {
          grid: { display: false },
          ticks: { color: "#222" },
        },
      };
    }

    if (activeLines.length === 2) {
      const lineLeft = activeLines[0];
      const lineRight = activeLines[1];
      let minLeft = Math.min(...lineLeft.data);
      let maxLeft = Math.max(...lineLeft.data);
      let minRight = Math.min(...lineRight.data);
      let maxRight = Math.max(...lineRight.data);
      if (minLeft === maxLeft) {
        minLeft = 0;
        maxLeft = maxLeft + 1;
      } else {
        const padding = (maxLeft - minLeft) * 0.1;
        minLeft -= padding;
        maxLeft += padding;
      }
      if (minRight === maxRight) {
        minRight = 0;
        maxRight = maxRight + 1;
      } else {
        const padding = (maxRight - minRight) * 0.1;
        minRight -= padding;
        maxRight += padding;
      }
      return {
        y: {
          type: "linear",
          position: "left",
          min: minLeft,
          max: maxLeft,
          display: true,
          ticks: { color: "#222" },
          grid: { color: "#e9edf1" },
        },
        y1: {
          type: "linear",
          position: "right",
          min: minRight,
          max: maxRight,
          display: true,
          grid: { drawOnChartArea: false, color: "#e9edf1" },
          ticks: {
            callback: function (value) {
              if (lineRight.label === "Durée") {
                const minutes = value;
                const roundedMinutes = Math.round(minutes);
                const h = String(Math.floor(roundedMinutes / 60)).padStart(
                  2,
                  "0"
                );
                const m = String(roundedMinutes % 60).padStart(2, "0");
                return `${h}:${m}:00`;
              }
              return value;
            },
            color: "#222",
          },
        },
        x: {
          grid: { display: false },
          ticks: { color: "#222" },
        },
      };
    }

    if (activeLines.length >= 3) {
      const scales = {
        x: {
          grid: { display: false },
          ticks: { color: "#222" },
        },
      };
      activeLines.forEach((line, idx) => {
        let min = Math.min(...line.data);
        let max = Math.max(...line.data);
        if (min === max) {
          min = 0;
          max = max + 1;
        } else {
          const padding = (max - min) * 0.1;
          min -= padding;
          max += padding;
        }
        scales[`y${idx}`] = {
          type: "linear",
          position: idx % 2 === 0 ? "left" : "right",
          min: min,
          max: max,
          display: false,
          grid: { drawOnChartArea: idx === 0, color: "#e9edf1" },
          ticks: {
            callback: function (value) {
              if (line.label === "Durée") {
                const minutes = value;
                const roundedMinutes = Math.round(minutes);
                const h = String(Math.floor(roundedMinutes / 60)).padStart(2, "0");
                const m = String(roundedMinutes % 60).padStart(2, "0");
                return `${h}:${m}:00`;
              }
              return value;
            },
            color: "#222",
          },
        };
      });
      return scales;
    }

    return {
      y: {
        type: "linear",
        position: "left",
        display: false,
        ticks: { color: "#222" },
        grid: { color: "#e9edf1" },
      },
      y1: {
        type: "linear",
        position: "right",
        display: false,
        grid: { drawOnChartArea: false, color: "#e9edf1" },
        ticks: {
          callback: function (value) {
            const minutes = value;
            const h = String(Math.floor(minutes / 60)).padStart(2, "0");
            const m = String(minutes % 60).padStart(2, "0");
            return `${h}:${m}:00`;
          },
          color: "#222",
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#222" },
      },
    };
  }

  function updateChart() {
    chart.data.datasets = getActiveDatasets();
    chart.options.scales = getScales();
    chart.update();
  }

  const verticalLinePlugin = {
    id: "verticalLinePlugin",
    afterDraw: function (chart) {
      if (chart.tooltip?._active && chart.tooltip._active.length) {
        const ctx = chart.ctx;
        ctx.save();
        const activePoint = chart.tooltip._active[0];
        ctx.beginPath();
        ctx.setLineDash([6, 6]);
        ctx.moveTo(activePoint.element.x, chart.chartArea.top);
        ctx.lineTo(activePoint.element.x, chart.chartArea.bottom);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#bdbdbd";
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  let chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: getActiveDatasets(),
    },
    options: {
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          mode: "index",
          intersect: false,
          external: function (context) {
            let tooltipEl = document.getElementById("chartjs-tooltip");
            if (!tooltipEl) {
              tooltipEl = document.createElement("div");
              tooltipEl.id = "chartjs-tooltip";
              tooltipEl.style.background = "#fff";
              tooltipEl.style.borderRadius = "10px";
              tooltipEl.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              tooltipEl.style.padding = "16px 20px";
              tooltipEl.style.position = "absolute";
              tooltipEl.style.pointerEvents = "none";
              tooltipEl.style.transition = "all .1s ease";
              tooltipEl.style.fontFamily = "inherit";
              tooltipEl.style.fontSize = "14px";
              tooltipEl.style.minWidth = "180px";
              tooltipEl.style.zIndex = 100;
              document.body.appendChild(tooltipEl);
            }

            const tooltipModel = context.tooltip;
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            if (tooltipModel.body) {
              const title = tooltipModel.title[0] || "";
              let innerHtml = `<div style="font-weight:700;font-size:15px;margin-bottom:10px;">${title}</div>`;

              tooltipModel.dataPoints.forEach(function (item) {
                let value = item.raw;
                if (item.dataset.label === "Durée") {
                  const minutes = value;
                  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
                  const m = String(minutes % 60).padStart(2, "0");
                  value = `${h}:${m}:00`;
                }
                innerHtml += `
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                    <div style="display:flex;align-items:center;gap:6px;">
                      <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.dataset.borderColor};"></span>
                      <span style="color:#222;">${item.dataset.label}</span>
                    </div>
                    <span style="font-weight:600;color:#222;">${value}</span>
                  </div>
                `;
              });

              tooltipEl.innerHTML = innerHtml;
            }

            const position = context.chart.canvas.getBoundingClientRect();
            tooltipEl.style.opacity = 1;
            tooltipEl.style.left =
              position.left +
              window.pageXOffset +
              tooltipModel.caretX +
              20 +
              "px";
            tooltipEl.style.top =
              position.top +
              window.pageYOffset +
              tooltipModel.caretY -
              20 +
              "px";
          },
        },
      },
      scales: getScales(),
    },
    plugins: [verticalLinePlugin],
  });

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", function () {
      updateChart();
    });
  });

  checkboxes.forEach((cb) => {
    const line = chartLines.find((l) => l.label === cb.value);
    if (line) {
      cb.style.accentColor = line.color;
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const voyantDropdown = document.querySelector(
    '.custom-dropdown[data-filter="voyant"]'
  );
  if (!voyantDropdown) return;
  const searchInput = voyantDropdown.querySelector(".search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    const filter = this.value.trim().toLowerCase();
    const items = voyantDropdown.querySelectorAll(".dropdown-item");
    items.forEach((item) => {
      if (item.querySelector(".search-input")) return;

      const checkbox = item.querySelector(".voyant-checkbox");
      if (checkbox && checkbox.dataset.value === "tous") {
        item.style.display = "";
        return;
      }
      const labelText = item.textContent.trim().toLowerCase();
      if (filter === "" || labelText.includes(filter)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const groupSwitch = document.querySelector('.switch input[type="checkbox"]');
  if (!groupSwitch) return;
  groupSwitch.addEventListener("change", function () {
    const extraCols = document.querySelectorAll(".extra-col");
    extraCols.forEach((col) => {
      col.style.display = this.checked ? "" : "none";
    });
  });

  const extraCols = document.querySelectorAll(".extra-col");
  extraCols.forEach((col) => {
    col.style.display = groupSwitch.checked ? "" : "none";
  });
});

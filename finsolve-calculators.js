document.addEventListener("DOMContentLoaded", () => {
  // SIP Calculator
  const sipForm = document.getElementById("sip-form");
  const sipResult = document.getElementById("sip-result");
  const sipError = document.getElementById("sip-error");
  const sipChartCtx = document.getElementById("sip-chart").getContext("2d");
  let sipChart;

  sipForm.addEventListener("input", () => {
    const monthly = parseFloat(document.getElementById("sip-monthly").value);
    const rate = parseFloat(document.getElementById("sip-rate").value);
    const years = parseFloat(document.getElementById("sip-years").value);

    if (!monthly || !rate || !years || monthly <= 0 || rate <= 0 || years <= 0) {
      sipError.textContent = "Please enter valid numbers greater than 0.";
      sipResult.innerHTML = "";
      if (sipChart) sipChart.destroy();
      return;
    }

    sipError.textContent = "";

    const n = years * 12;
    const r = rate / 12 / 100;
    const futureValue = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = monthly * n;
    const returns = futureValue - invested;

    sipResult.innerHTML = `
      <p><strong>Total Invested:</strong> ₹${invested.toFixed(2)}</p>
      <p><strong>Estimated Returns:</strong> ₹${returns.toFixed(2)}</p>
      <p><strong>Final Value:</strong> ₹${futureValue.toFixed(2)}</p>
    `;

    if (sipChart) sipChart.destroy();
    sipChart = new Chart(sipChartCtx, {
      type: "doughnut",
      data: {
        labels: ["Invested", "Returns"],
        datasets: [{
          data: [invested, returns],
          backgroundColor: ["#00f0ff", "#00ffa2"],
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });
  });

  // EMI Calculator
  const emiForm = document.getElementById("emi-form");
  const emiResult = document.getElementById("emi-result");
  const emiError = document.getElementById("emi-error");
  const emiChartCtx = document.getElementById("emi-chart").getContext("2d");
  let emiChart;

  emiForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const loan = parseFloat(document.getElementById("emi-loan").value);
    const rate = parseFloat(document.getElementById("emi-rate").value);
    const years = parseFloat(document.getElementById("emi-years").value);

    if (!loan || !rate || !years || loan <= 0 || rate <= 0 || years <= 0) {
      emiError.textContent = "Please enter valid numbers greater than 0.";
      emiResult.innerHTML = "";
      if (emiChart) emiChart.destroy();
      return;
    }

    emiError.textContent = "";

    const n = years * 12;
    const r = rate / 12 / 100;
    const emi = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const interest = totalPayment - loan;

    emiResult.innerHTML = `
      <p><strong>Monthly EMI:</strong> ₹${emi.toFixed(2)}</p>
      <p><strong>Total Interest:</strong> ₹${interest.toFixed(2)}</p>
      <p><strong>Total Payment:</strong> ₹${totalPayment.toFixed(2)}</p>
    `;

    if (emiChart) emiChart.destroy();
    emiChart = new Chart(emiChartCtx, {
      type: "doughnut",
      data: {
        labels: ["Principal", "Interest"],
        datasets: [{
          data: [loan, interest],
          backgroundColor: ["#00f0ff", "#ff6384"],
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });
  });

  // CAGR Calculator
  const cagrForm = document.getElementById("cagr-form");
  const cagrResult = document.getElementById("cagr-result");
  const cagrError = document.getElementById("cagr-error");
  const cagrChartCtx = document.getElementById("cagr-chart").getContext("2d");
  let cagrChart;

  cagrForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const initial = parseFloat(document.getElementById("cagr-initial").value);
    const finalVal = parseFloat(document.getElementById("cagr-final").value);
    const years = parseFloat(document.getElementById("cagr-years").value);

    if (!initial || !finalVal || !years || initial <= 0 || finalVal <= 0 || years <= 0) {
      cagrError.textContent = "Please enter valid numbers greater than 0.";
      cagrResult.innerHTML = "";
      if (cagrChart) cagrChart.destroy();
      return;
    }

    cagrError.textContent = "";

    const cagr = (Math.pow(finalVal / initial, 1 / years) - 1) * 100;

    cagrResult.innerHTML = `
      <p><strong>CAGR:</strong> ${cagr.toFixed(2)}%</p>
    `;

    if (cagrChart) cagrChart.destroy();
    cagrChart = new Chart(cagrChartCtx, {
      type: "bar",
      data: {
        labels: ["Initial Value", "Final Value"],
        datasets: [{
          data: [initial, finalVal],
          backgroundColor: ["#00f0ff", "#00ffa2"],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  });

  // IRR Calculator
  const irrForm = document.getElementById("irr-form");
  const irrContainer = document.getElementById("irr-cashflows-container");
  const irrResult = document.getElementById("irr-result");
  const irrError = document.getElementById("irr-error");
  const irrChartCtx = document.getElementById("irr-chart").getContext("2d");
  let irrChart;

  document.getElementById("add-cashflow").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "number";
    input.className = "irr-cashflow";
    input.placeholder = "Enter Cashflow";
    input.required = true;
    irrContainer.appendChild(input);
  });

  irrForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const cashflowInputs = document.querySelectorAll(".irr-cashflow");
    const cashflows = Array.from(cashflowInputs).map(input => parseFloat(input.value));

    if (cashflows.some(isNaN)) {
      irrError.textContent = "Please enter valid cashflows.";
      irrResult.innerHTML = "";
      if (irrChart) irrChart.destroy();
      return;
    }

    irrError.textContent = "";

    const irr = calculateIRR(cashflows);
    if (irr === null) {
      irrResult.innerHTML = "<p><strong>Could not calculate IRR. Try different values.</strong></p>";
      if (irrChart) irrChart.destroy();
      return;
    }

    irrResult.innerHTML = `<p><strong>IRR:</strong> ${irr.toFixed(2)}%</p>`;

    if (irrChart) irrChart.destroy();
    irrChart = new Chart(irrChartCtx, {
      type: "line",
      data: {
        labels: cashflows.map((_, i) => `Year ${i}`),
        datasets: [{
          label: "Cashflows",
          data: cashflows,
          fill: false,
          borderColor: "#00f0ff",
          tension: 0.1
        }]
      },
      options: {
        responsive: true
      }
    });
  });

  function calculateIRR(cashflows, guess = 0.1) {
    const maxIter = 1000;
    const precision = 1e-6;
    let rate = guess;

    for (let i = 0; i < maxIter; i++) {
      let npv = 0;
      let dnpv = 0;

      for (let t = 0; t < cashflows.length; t++) {
        const cf = cashflows[t];
        npv += cf / Math.pow(1 + rate, t);
        dnpv += -t * cf / Math.pow(1 + rate, t + 1);
      }

      const newRate = rate - npv / dnpv;
      if (Math.abs(newRate - rate) < precision) return newRate * 100;
      rate = newRate;
    }

    return null;
  }
});

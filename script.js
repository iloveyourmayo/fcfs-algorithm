const numProcessesInput = document.getElementById('num-processes');
const addProcessesButton = document.getElementById('add-processes');
const calculateResultsButton = document.getElementById('calculate-results');
const processTableBody = document.getElementById('process-tbody');
const ganttChart = document.getElementById('gantt-chart');
const computedValuesTableBody = document.getElementById('computed-values-tbody');
const waitingTimeElement = document.getElementById('avg-waiting-time');
const turnaroundTimeElement = document.getElementById('avg-turnaround-time');

const MAX_PROCESSES = 6; // Define the maximum number of processes allowed

function addProcesses() {
  const numProcesses = parseInt(numProcessesInput.value);

  // Check if user entered more than the maximum allowed processes
  if (numProcesses > MAX_PROCESSES) {
    alert(`Maximum processes allowed: ${MAX_PROCESSES} only. Enter value between 1 - ${MAX_PROCESSES}.`);
    return; // Exit the function if exceeded limit
  }

  processTableBody.innerHTML = '';

  for (let i = 0; i < numProcesses; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>Process ${i + 1}</td>
      <td><input type="number" class="arrival-time"></td>
      <td><input type="number" class="burst-time"></td>
    `;
    processTableBody.appendChild(row);
  }
}

function calculateFCFS() {
  const processes = [];

  const rows = processTableBody.getElementsByTagName('tr');
  for (let i = 0; i < rows.length; i++) {
    const arrivalTime = parseInt(rows[i].getElementsByClassName('arrival-time')[0].value);
    const burstTime = parseInt(rows[i].getElementsByClassName('burst-time')[0].value);
    processes.push({ id: i + 1, arrivalTime, burstTime });
  }

  // Sort processes by arrival time
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  for (const process of processes) {
    if (process.arrivalTime > currentTime) {
      currentTime = process.arrivalTime; // Idle time
    }

    const waitingTime = currentTime - process.arrivalTime;
    const turnaroundTime = waitingTime + process.burstTime;

    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;

    process.waitingTime = waitingTime;
    process.turnaroundTime = turnaroundTime;
    // Calculate completion time based on current time and burst time
    process.completionTime = currentTime + process.burstTime;

    currentTime += process.burstTime;
  }

  // Create Gantt chart string
  let ganttChartString = "";
  for (const process of processes) {
    const barWidth = process.burstTime * 10; // Adjust bar width as needed
    const barColor = process.id % 3 === 0 ? '#678b8e' : (process.id % 3 === 1 ? '#364043' : '#44575a');

    ganttChartString += `
      <div style="width: ${barWidth}px; background-color: ${barColor};">
        <div style="display: flex; justify-content: center; align-items: center; height: 100%">
          <span style="font-size: 12px; font-weight: bold">P${process.id}</span>
        </div>
        <div style="display: flex; justify-content: end; align-items: center; height: 100%">
          <span style="font-size: 10px">${process.completionTime}</span>
        </div>
      </div>
    `;
  }

  // Update Gantt chart and display results
  ganttChart.innerHTML = ganttChartString;

  // Clear computed values table
  computedValuesTableBody.innerHTML = '';

  // Create and display computed values in a table
  for (const process of processes) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>P${process.id}</td>
      <td>${process.arrivalTime}</td>
      <td>${process.burstTime}</td>
      <td>${process.completionTime}</td>
      <td>${process.turnaroundTime}</td>
      <td>${process.waitingTime}</td>
    `;
    computedValuesTableBody.appendChild(row);
  }

  // Update average waiting and turnaround time directly
  const avgWaitingTime = (totalWaitingTime / processes.length).toFixed(2);
  const avgTurnaroundTime = (totalTurnaroundTime / processes.length).toFixed(2);

  waitingTimeElement.textContent = avgWaitingTime;
  turnaroundTimeElement.textContent = avgTurnaroundTime;
}

// Add event listeners to buttons
addProcessesButton.addEventListener('click', addProcesses);
calculateResultsButton.addEventListener('click', calculateFCFS);
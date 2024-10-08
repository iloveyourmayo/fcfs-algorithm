function showWelcomeAlert() {
  const message = "Hi O.S Guest! Click OK to begin FCFS Process Scheduling.";
  const result = confirm(message);

  if (result) {
    window.location.href = "index.html"; // Redirect to index.html
  }
}

window.addEventListener("load", showWelcomeAlert);
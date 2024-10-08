function showWelcomeAlert() {
  const message = "Hi O.S Guest! Click OK to begin FCFS Process Scheduling.";

  setTimeout(() => {
    const result = confirm(message);

    if (result) {
      window.location.href = "index2.html"; 
    }
  }, 3000); 
}

window.addEventListener("load", showWelcomeAlert);

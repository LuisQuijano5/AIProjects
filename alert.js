export function showAlert(message, { type = "info", timeout = 3000 } = {}) {
  const colors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-400 text-black",
    info: "bg-blue-500 text-white",
  };

  let container = document.getElementById("alert-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "alert-container";
    container.className = "fixed top-4 right-4 space-y-2 z-50";
    document.body.appendChild(container);
  }

  const alert = document.createElement("div");
  alert.className = `px-4 py-2 rounded shadow ${colors[type]}`;
  alert.textContent = message;

  container.appendChild(alert);

  if (timeout > 0) {
    setTimeout(() => {
      alert.classList.add("opacity-0", "transition", "duration-500");
      setTimeout(() => alert.remove(), 500);
    }, timeout);
  }
}
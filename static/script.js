let tableData = {
  columns: [],
  data: [],
};

// Fetch data from server
async function fetchData() {
  try {
    const response = await fetch("/get_data");
    const data = await response.json();
    if (response.ok) {
      tableData = data;
      renderTable();
    } else {
      showNotification("Error loading data: " + data.error, "error");
    }
  } catch (error) {
    showNotification("Error loading data: " + error.message, "error");
  }
}

// Render table
function renderTable() {
  // Render headers
  const headerRow = document.getElementById("headerRow");
  headerRow.innerHTML = "";
  tableData.columns.forEach((column) => {
    const th = document.createElement("th");
    th.textContent = column;
    headerRow.appendChild(th);
  });

  // Render body
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  tableData.data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach((cell, cellIndex) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.value = cell;
      input.addEventListener("change", (e) => {
        tableData.data[rowIndex][cellIndex] = e.target.value;
      });
      td.appendChild(input);
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}

// Add new row
function addRow() {
  const newRow = Array(tableData.columns.length).fill("");
  tableData.data.push(newRow);
  renderTable();
}

// Save changes
async function saveChanges() {
  try {
    const response = await fetch("/update_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tableData),
    });
    const data = await response.json();
    if (response.ok) {
      showNotification("Changes saved successfully!");
    } else {
      showNotification("Error saving changes: " + data.error, "error");
    }
  } catch (error) {
    showNotification("Error saving changes: " + error.message, "error");
  }
}

// Show notification
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.backgroundColor =
    type === "success" ? "#28a745" : "#dc3545";
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}
// PWA install functionality
let deferredPrompt;
const installButton = document.createElement("button");
installButton.classList.add("btn");
installButton.textContent = "Install App";
installButton.style.display = "none";

// Add install button to header actions
document.querySelector(".actions").appendChild(installButton);

// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/static/sw.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}

// Handle install prompt
window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show the install button
  installButton.style.display = "block";
});

installButton.addEventListener("click", async () => {
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // Clear the deferredPrompt variable
    deferredPrompt = null;
    // Hide the install button
    installButton.style.display = "none";
  }
});

// Handle successful installation
window.addEventListener("appinstalled", (evt) => {
  console.log("Application installed successfully");
  installButton.style.display = "none";
});

// Initialize
document.addEventListener("DOMContentLoaded", fetchData);

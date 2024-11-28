
// used global variables to share data between file variables with "window." are global variables



// public/script/values.js
const socket = io();

// Retrieve saved values on page load
window.motion_count = parseInt(localStorage.getItem("motion_count")) || 0;
// console.log("motion_count set in values.js:", window.motion_count);


// Make sure the DOM is fully loaded before running values.js:
document.addEventListener("DOMContentLoaded", () => {
    window.temperature_value = document.getElementsByClassName("temp-value")[0];
    window.movement_value = document.getElementsByClassName("move-value")[0];


    // Set initial text content based on saved values
    window.temperature_value.textContent = localStorage.getItem("temp_val") || "0";
    window.movement_value.textContent = window.motion_count;

});



// Initialize lastMotionTime to control motion detection updates
let lastMotionTime = 0;

socket.on('data', (data) => {
    if (data.includes("Temperature") && !data.includes("Motion")) {
        // Parse and update the temperature value
        window.temp_val = Math.ceil(parseInt(data.slice(13, data.length - 5)));
        // console.log("Current temp:", window.temp_val);

        // Update text content and save to localStorage
        window.temperature_value.textContent = window.temp_val;
        localStorage.setItem("temp_val", window.temp_val);


    }

    if (data.includes("Motion detected!")) {
        let currentTime = Date.now();
        if (currentTime - lastMotionTime > 500) { // 500 ms debounce time
            window.motion_count++;
            console.log("Current count:", window.motion_count);

            // Update text content and save to localStorage
            window.movement_value.textContent = window.motion_count;
            localStorage.setItem("motion_count", window.motion_count);
            lastMotionTime = currentTime;
        }
    }



});




// TIME AND DATE AUTO UPDATE

function updateDateValues() {
    const today = new Date();

    // Get current values
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1; // Months are 0-indexed
    const currentYear = today.getFullYear() % 100;

    // Select the elements
    const monthElement = document.querySelector('.month span:nth-child(1)');
    const dayElement = document.querySelector('.day span:nth-child(1)');
    const yearElement = document.querySelector('.year span:nth-child(1)');

    // Append the new values
    if (monthElement) monthElement.textContent += ` ${currentMonth}`;
    if (dayElement) dayElement.textContent += ` ${currentDay}`;
    if (yearElement) yearElement.textContent += ` ${currentYear}`;

    // Schedule update for midnight
    const now = today.getTime();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now;

    setTimeout(updateDateValues, timeUntilMidnight);
}

// Call the function to initialize
updateDateValues();





// used global variables to share data between file variables with "window." are global variables

// public/script/values.js
const socket = io();

document.addEventListener("DOMContentLoaded", () => {

    localStorage.setItem('babyStatus', "Currently Asleep");
    const babyStatus = document.querySelector(".baby-status");
    let storedStatus = localStorage.getItem("babyStatus");
    babyStatus.innerText = storedStatus;


    const babyName = document.querySelector(".baby-name");
    const babyNameMoved = document.querySelector(".name-moved");


    // Retrieve data from localStorage
    const storedData = localStorage.getItem("babyRegistrationData");


    if (storedData) {
        const parsedData = JSON.parse(storedData);

        babyName.innerText = parsedData.name;
        babyNameMoved.innerText = parsedData.name;

    } else {
        babyName.innerText = "User";
        babyNameMoved.innerText = "User";
    }
});




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

// Initialize intervalMs value
window.iMs = parseInt(localStorage.getItem("intervalMs"));
console.log("Window iMs " + typeof window.iMs)
console.log(parseInt(window.iMs))


// Get updated intervalMs value
// setInterval(() => {
//     window.iMs = parseInt(localStorage.getItem("intervalMs"))
// }, 1000)



// =================================================================

// Initialize lastMotionTime to control motion detection updates
let lastMotionTime = 0;



// Function to reset motion_count every 49800ms (49.8 seconds)
setInterval(() => {
    window.motion_count = 0; // Reset the count
    console.log("Motion count reset to zero");
    // Optionally, update the text content here if needed
    window.movement_value.textContent = window.motion_count;
    localStorage.setItem("motion_count", window.motion_count); // Save reset value to localStorage

}, parseInt(window.iMs)); // 49800 ms = 49.8 seconds


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










document.addEventListener("DOMContentLoaded", function () {
    // Retrieve values from localStorage (if available)
    window.motion_count = parseInt(localStorage.getItem("motion_count")) || 0;
    window.temperature_value = document.getElementsByClassName("temp-value")[0];
    window.movement_value = document.getElementsByClassName("move-value")[0];

    // Set initial text content based on saved values
    window.temperature_value.textContent = (localStorage.getItem("temp_val") || "0");
    window.movement_value.textContent = window.motion_count;

    // Get the clear storage button
    const clearButton = document.getElementById("clear-storage-btn");

    // Add event listener to the clear storage button
    clearButton.addEventListener("click", () => {
        // Clear specific items from localStorage
        localStorage.removeItem("temp_val");
        localStorage.removeItem("motion_count");

        // Optionally, reset values on the page as well
        window.motion_count = 0;

        // Re-fetch elements to avoid undefined errors
        window.temperature_value = document.getElementsByClassName("temp-value")[0];
        window.movement_value = document.getElementsByClassName("move-value")[0];

        // Reset text content on button click
        if (window.temperature_value) {
            window.temperature_value.textContent = "0";
        }

        if (window.movement_value) {
            window.movement_value.textContent = "0";
        }

        console.log("LocalStorage cleared");
    });
});



const how_it_works = document.querySelector('.how-this-works');
const popup_modal = document.querySelector('.pop-up-container');
const body = document.querySelector('body');

// Show modal on button click
how_it_works.addEventListener('click', function (e) {
    popup_modal.style.display = 'block';
});

// Close modal when clicking outside of it
document.addEventListener('click', function (e) {
    // Check if the click happened outside of the modal
    if (popup_modal.style.display === 'block' && !popup_modal.contains(e.target) && e.target !== how_it_works) {
        popup_modal.style.display = 'none';
    }
});







// Select all interval boxes
const intervalBoxes = document.querySelectorAll('.interval-boxes');

// Define a global variable to store the selected interval
window.selectedInterval = localStorage.getItem('selectedInterval') || "10"; // Default to 10mins if no selection

// Add 'active' class to the saved interval box on page load
intervalBoxes.forEach((box) => {
    const intervalValue = box.querySelector('span:nth-child(1)').textContent.trim(); // Get the value of the interval
    if (intervalValue === window.selectedInterval) {
        box.classList.add('active'); // Highlight the selected box
    }
});

// Loop through each interval box and add a click event listener
intervalBoxes.forEach((box) => {
    box.addEventListener('click', function () {
        // Get the selected interval value
        window.selectedInterval = box.querySelector('span:nth-child(1)').textContent.trim();

        // Save the selected interval to window and localStorage
        localStorage.setItem('selectedInterval', window.selectedInterval);

        // Dispatch custom event to notify other scripts
        const event = new CustomEvent('intervalChanged', { detail: window.selectedInterval });
        window.dispatchEvent(event);

        // Update the UI to reflect the selected interval
        intervalBoxes.forEach((b) => b.classList.remove('active')); // Remove 'active' from all
        box.classList.add('active'); // Add 'active' class to the clicked box

        console.log(`Selected Interval: ${window.selectedInterval}`); // Debug log
    });
});


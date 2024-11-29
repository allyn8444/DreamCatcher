const temp = document.getElementById('temp-chart');
const move = document.getElementById('move-chart');



const intervals = {

    // update every 49.8 seconds: 
    "10": Array.from({ length: 12 }, (_, i) => `${((10 / 12) * (i + 1)).toFixed(1)} mins`),

    // update every 1min & 15seconds:
    "15": Array.from({ length: 12 }, (_, i) => `${((15 / 12) * (i + 1)).toFixed(1)} mins`),

    // update every 2mins & 30 secs:
    "30": Array.from({ length: 12 }, (_, i) => `${((30 / 12) * (i + 1)).toFixed(1)} mins`),

    // update every 5 mins:
    "1": Array.from({ length: 12 }, (_, i) => `${((60 / 12) * (i + 1)).toFixed(1)} mins`),

    // update every 10 mins:    
    "2": Array.from({ length: 12 }, (_, i) => `${((120 / 12) * (i + 1)).toFixed(1)} mins`),
};

// Load the saved interval from localStorage

// alert(localStorage.getItem('selectedInterval'));
let chosenInterval = localStorage.getItem('selectedInterval') || "1"; // default is 1hr interval
let labels = intervals[chosenInterval];


// TODO: the data refreshes every time u refresh the tab
let temp_data = []; // append getTemp
let move_data = []; // append getMotion

// Global variables to store the latest values
window.getTemp = null;
window.getMotion = null;

// Function to update the global variables every second
setInterval(() => {
    // Fetch the latest values from localStorage
    window.getTemp = localStorage.getItem("temp_val");
    window.getMotion = localStorage.getItem("motion_count");

    // Log the updated values (for debugging purposes)
    // console.log("Updated temp:", window.getTemp, "Updated motion:", window.getMotion);
}, 1000); // 1000ms = 1 second

// Example of how to access the values outside the setInterval scope
// console.log("Temp outside interval:", window.getTemp);
// console.log("Motion outside interval:", window.getMotion);




// ------ TEMP CHART ----
let tempChart = new Chart(temp, {
    // type of chart:
    type: 'line',

    // DATA INFO
    data: {
        labels: labels,
        datasets: [{
            label: 'temperature chart history',
            // INSERT DATA HERE
            data: temp_data,
            // how thick the LINE connecting the data points
            borderWidth: 3,
            // color of the line
            borderColor: 'rgb(162, 145, 253)',
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        // Add plugins to options.
        plugins: {
            legend: {
                display: false // This hides all text in the legend and also the labels.
            }
        },
        scales: {
            x: {
                grid: {
                    color: '#404040'
                },
                ticks: {
                    autoSkip: false,
                    maxRotation: 60,
                    minRotation: 30
                }

            },
            y: {
                grid: {
                    color: '#404040'
                },

                min: 15,
                max: 40,
                ticks: {
                    // forces step size to be 50 units
                    stepSize: 1
                }



            }
        }
    }
});


// ----- MOVEMENT CHART ------
let moveChart = new Chart(move, {
    // type of chart:
    type: 'line',

    // DATA INFO
    data: {
        labels: labels,
        datasets: [{
            label: 'movement chart history',
            // INSERT DATA HERE
            data: move_data,
            // how thick the LINE connecting the data points
            borderWidth: 3,
            // color of the line
            borderColor: 'rgb(162, 145, 253)',
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        // Add plugins to options.
        plugins: {
            legend: {
                display: false // This hides all text in the legend and also the labels.
            }
        },

        scales: {
            x: {
                grid: {
                    color: '#404040'
                }
            },
            y: {

                min: 0,
                max: 10,
                ticks: {
                    // forces step size to be 5 units
                    stepSize: 1
                },
                grid: {
                    color: '#404040'
                },
                beginAtZero: true

            }
        }
    }
});





function appendValue() {
    // Check if the length of the arrays is less than 12
    if (temp_data.length < 12 && move_data.length < 12) {
        console.log('Appending value...');

        // Add new data
        temp_data.push(window.getTemp);
        move_data.push(window.getMotion);

        // Store the updated arrays in localStorage
        localStorage.setItem('temp_data', JSON.stringify(temp_data));
        localStorage.setItem('move_data', JSON.stringify(move_data));

        // Update chart with new data
        tempChart.update();
        moveChart.update();
    } else {
        // Reset the arrays if their length exceeds or equals 12
        console.log("RESET THE ARRAYS");

        // Clear the data in the arrays
        temp_data = [];
        move_data = [];

        // Store the reset arrays in localStorage
        localStorage.setItem('temp_data', JSON.stringify(temp_data));
        localStorage.setItem('move_data', JSON.stringify(move_data));

        // Reset the chart data
        tempChart.data.datasets[0].data = temp_data;
        moveChart.data.datasets[0].data = move_data;

        // Update the charts with the reset data
        tempChart.update();
        moveChart.update();
    }
}

// To retrieve the data when the page loads or whenever you need it
function retrieveStoredData() {
    let storedTempData = JSON.parse(localStorage.getItem('temp_data')) || [];
    let storedMoveData = JSON.parse(localStorage.getItem('move_data')) || [];

    // Assign the retrieved data back to the arrays
    temp_data = storedTempData;
    move_data = storedMoveData;

    // Update the charts with the retrieved data
    tempChart.data.datasets[0].data = temp_data;
    moveChart.data.datasets[0].data = move_data;

    // Update the charts with the retrieved data
    tempChart.update();
    moveChart.update();
}

// Call retrieveStoredData when the page loads or after a reset
retrieveStoredData();



// Function to convert the interval to milliseconds and start appending
function startAppending() {
    let intervalMs;


    // TODO: calibrate the intervalMS (chart.js)
    // Determine the interval based on the chosen value
    switch (chosenInterval) {
        case "10":
            intervalMs = 49800; // 10 mins = 49.8 seconds
            break;
        case "15":
            intervalMs = 75000; // 15 mins = 1 min 15 secs
            break;
        case "30":
            intervalMs = 150000; // 30 mins = 2 mins 30 secs
            break;
        case "1":
            intervalMs = 300000; // 1 hour = 5 mins
            break;
        case "2":
            intervalMs = 600000; // 2 hours = 10 mins
            break;
        default:
            console.log('Invalid interval value.');
            return;
    }

    // Save in local storage for later use
    localStorage.setItem('intervalMs', intervalMs);
    console.log('Interval set to:', intervalMs / 1000, 'seconds');

    // Start appending values based on the calculated interval
    setInterval(appendValue, intervalMs);
}

// Initialize the appending process
startAppending();

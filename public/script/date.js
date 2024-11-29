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
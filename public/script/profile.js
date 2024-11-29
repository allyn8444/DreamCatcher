// Generate 50 blank rows for the Room Temperature Table
const temperatureTableBody = document.querySelector("#temperatureTable tbody");
for (let i = 1; i <= 50; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td></td>
    <td></td>
    <td></td>
  `;
    temperatureTableBody.appendChild(row);
}

// Generate 50 blank rows for the Movement Count Table
const movementTableBody = document.querySelector("#movementTable tbody");
for (let i = 1; i <= 50; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td></td>
    <td></td>
    <td></td>
  `;
    movementTableBody.appendChild(row);
}


document.addEventListener("DOMContentLoaded", () => {
    const dataSection = document.querySelector(".data");
    const babyStatus = document.querySelector(".baby-status");
    const babyName = document.querySelector(".b-name");
    const babyGender = document.querySelector(".b-gender");
    const babyAge = document.querySelector(".b-age");
    const babyWeight = document.querySelector(".b-weight");
    const babyNationality = document.querySelector(".b-nationality");
    const babyGuardian = document.querySelector(".b-guardian");
    const babyCharacter = document.querySelector(".b-character");

    // Retrieve data from localStorage
    const storedData = localStorage.getItem("babyRegistrationData");
    let storedStatus = localStorage.getItem("babyStatus");



    babyStatus.innerText = storedStatus;
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        babyName.innerText = parsedData.name;
        babyAge.innerText = parsedData.age + " months";
        babyWeight.innerText = parsedData.weight + " kg";
        babyNationality.innerText = parsedData.nationality;
        babyGuardian.innerText = parsedData.guardian;
        babyCharacter.innerText = parsedData.character + " " + parsedData.gender;

        if (parsedData.gender == "Girl")
            babyGender.innerText = "She";
        else babyGender.innerText = "He";

    } else {
        babyName.innerText = "User";
        babyGender.innerText = "NaN";
        babyAge.innerText = "NaN";
        babyWeight.innerText = "NaN";
        babyNationality.innerText = "NaN";
        babyGuardian.innerText = "NaN";
        babyCharacter.innerText = "NaN";
    }


});

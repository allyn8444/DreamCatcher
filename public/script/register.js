// alert("test") // working



document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    // Wait for the initial animations to complete
    setTimeout(() => {

        // Display the form without animation for 1s pause
        form.classList.add("show");

        // Trigger the form's rise animation after 1 second
        setTimeout(() => {
            form.classList.add("animate");
        }, 1000);
    }, 2500); // Adjust this based on your left-side animation timing



    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from submitting traditionally

        // Gather form data
        const formData = {
            name: document.getElementById("name").value,
            gender: document.getElementById("gender").value,
            weight: document.getElementById("weight").value,
            nationality: document.getElementById("nationality").value,
            age: document.getElementById("age").value,
            guardian: document.getElementById("guardian-name").value,
            character: document.getElementById("baby-character").value,
        };

        // Save form data to local storage
        localStorage.setItem("babyRegistrationData", JSON.stringify(formData));

        alert("Registration data saved successfully!");
        form.reset(); // Clear the form after saving


        const savedData = JSON.parse(localStorage.getItem("babyRegistrationData"));
        console.log(savedData);


        // Redirect to home page
        window.location.href = "http://localhost:3000/index.html";

    });
});



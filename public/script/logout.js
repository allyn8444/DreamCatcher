let logoutBTN = document.querySelector('#logout');


logoutBTN.addEventListener('click', function () {
    clearLocalStorage();
    clearRegistrationCookie();
    // window.location.href = '/';
});


function clearLocalStorage() {
    localStorage.removeItem("babyRegistrationData"); // or use localStorage.clear() to remove everything
    alert("Data cleared!");
}

function clearRegistrationCookie() {
    // Clear the registration cookie
    document.cookie = "isRegistered=false; path=/; max-age=0";
}
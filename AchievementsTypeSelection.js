function YearlyAchievements() {

    window.location.href = "YearlyAchievements.html";
}

function FortnightlyAchievements() {

    window.location.href = "data.html";
}

function init() {
    document.getElementById("loggedInUserName").innerHTML = "Hello " + window.name + "!";
}

function Logout() {
    window.location.href = "login.html";
}

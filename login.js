function Login() {

    var Uid = document.getElementById("LoginUserID").value;
    var Upwd = document.getElementById("LoginPassword").value;

    if (Uid == "" || Upwd == "") {
        alert("Please fill the Mandatory fields UserID and Password");
    } else {
        if (CheckIsValidUser(Uid, Upwd)) {
            window.name = Uid;//localStorage.setItem("UserName", Uid);
            window.location.href = "AchievementsTypeSelection.html";
        } else {
            alert("Not a registered user!.");
        }
    }
}

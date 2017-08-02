var fso;
var sw;
var uid;
var timeSheetValue;
var isFortNightTypeSelected;
var dataBaseFilePath = "C:\\Users\\n.chowdary.nelluri\\Desktop\\Progress\\Code\\DataBase - Copy.txt";

function init(isfortNightTypeSelected) {

    isFortNightTypeSelected = isfortNightTypeSelected;
    if (window.name == "Gokul" | window.name == "Blesston") {

        addList();
        uid = window.name;
        //uid = window.usersCbx.value;

    } else {
        uid = window.name; //localStorage.getItem("UserName");
    }
    if (!isFortNightTypeSelected) {
        timeSheetValue = new Date().getFullYear();
        AddDate("", "", timeSheetValue);
    }
    else {
        UpdateDatesComboBox();
        timeSheetValue = window.DatesCbx.value;
    }
    ShowLoggedUser();
    ShowSavedData();
}

function ShowLoggedUser() {
    document.getElementById("loggedInUserName").innerHTML = "Hello " + uid + "!";
}

function UserIdChanged() {

    uid = window.usersCbx.value;

    ShowSavedData();
}

function UpdateDatesComboBox() {

    var d = new Date();
    var year = d.getFullYear();

    var m = d.getMonth(); // value is 0-jan, 1- feb.... 5-june.

    for (var i = 0; i <= m; i++) {

        var fifteenthDay = new Date(year, i, 15);

        AddDate(fifteenthDay, i + 1, year);

        var lastDay = new Date(year, i + 1, 0);

        AddDate(lastDay, i + 1, year);
    }
    // dates cbx is second item in select input type, first is users cbx that's visible for admins.
    var select = document.getElementsByTagName('select')[1];

    if (d.getDate() < 16) //remove last item which is last day of current month, thats added in above for loop.
        select.remove(select.options.length - 1);

    select.selectedIndex = select.options.length - 1;// default selection to lastday of current month

    //select.selectedIndex = select.options.length - 2;  // default selection to 15thday of current month item in cbx.
}

function AddDate(date, month, year) {

    var datesCbx = document.getElementById("DatesCbx");
    var option = document.createElement('option');
    if (isFortNightTypeSelected) {
        var day = date.getDate();
        option.text = day + "/" + month + "/" + year;
    }
    else {
        option.text = year;
    }
    datesCbx.add(option);
}

function addList() {

    var select = document.getElementById("usersCbx");
    var registeredUserIds = GetRegisteredUserIds();
    for (var i = 0; i < registeredUserIds.length; i++) {
        var option = document.createElement('option');
        option.text = registeredUserIds[i];
        select.add(option);
    }
    select.hidden = false;
}

function DateChanged() {

    timeSheetValue = window.DatesCbx.value;
    ShowSavedData();
}

function ShowSavedData() {
    var existingData;
    fso = new ActiveXObject("Scripting.FileSystemObject");

    sw = fso.OpenTextFile(dataBaseFilePath, 1, false);

    if (!sw.AtEndOfLine) {
        var jsondata = sw.ReadAll();
        if (jsondata.trim().length > 0) {
            var jsonArray = JSON.parse(jsondata);
            existingData = GetPreviousSavedData(jsonArray);
            if (existingData != undefined) {
                ShowSubmittedData(existingData);
            } else {
                ClearTextBoxes();
            }
        }
    }
    //if (existingData != undefined) {
    //    ShowSubmittedData(existingData);
    //} else {
    //    {
    //        ClearTextBoxes();
    //    }
    //}
    sw.close();
}

function GetPreviousSavedData(jsonArray) {

    for (var i = 0; i < jsonArray.length; i++) {
        if (jsonArray[i].LoginId == uid && timeSheetValue == jsonArray[i].TimeSheetId) {
            return jsonArray[i];
        }
    }
    return undefined;
}

function DeletePreviouslySavedData(jsonArray) {

    for (var i = 0; i < jsonArray.length; i++) {
        if (jsonArray[i].LoginId == uid && timeSheetValue == jsonArray[i].TimeSheetId) {
            jsonArray.splice(i, 1);
            break;
        }
    }
}

function InsertDetails() {
    var jsondata;
    sw = fso.OpenTextFile(dataBaseFilePath, 1, false);

    if (!sw.AtEndOfLine) {
        jsondata = sw.ReadAll();

        sw.close();
        fso.DeleteFile(dataBaseFilePath);

        sw = fso.OpenTextFile(dataBaseFilePath, 2, true);

        var jsonArray = JSON.parse(jsondata);

        /*
         var existingData = GetPreviousSavedData(jsonArray);
         if (existingData != undefined) {
         delete jsonArray[existingData];
         }
         jsondata =  jsonArray.slice(0, -1);
         */


        DeletePreviouslySavedData(jsonArray);

        if (jsonArray.length > 0) {
            //sw.Write(JSON.stringify(jsonArray).replace(/\s*,\s*/, '').slice(0, -1));
            sw.Write(JSON.stringify(jsonArray).replace('[,', '[').replace(',,', ',').slice(0, -1));
            createJson(false, isFortNightTypeSelected);
        } else {
            createJson(true, isFortNightTypeSelected);
        }

    } else {

        sw.close();
        sw = fso.OpenTextFile(dataBaseFilePath, 2, false);
        createJson(true, isFortNightTypeSelected);
    }
    sw.close();
    alert("Data Saved successfully.");
    //disableSubmitBtn(true);
}

function ShowSubmittedData(data) {

    document.getElementById("scriptBuildCount").value = data["scriptBuildCount"];
    document.getElementById("executionCount").value = data["executionCount"];
    document.getElementById("dataCreationCount").value = data["dataCreationCount"];
    document.getElementById("batCount").value = data["batCount"];
    document.getElementById("ktcount").value = data["ktcount"];
    document.getElementById("defectsCount").value = data["defectsCount"];
    document.getElementById("achievements").value = data["achievements"];
    document.getElementById("milestones").value = data["milestones"];
    document.getElementById("beyondWorkTasks").value = data["beyondWorkTasks"];

    if (isFortNightTypeSelected) {
        document.getElementById("scriptBuildTCs").value = data["scriptBuildTCs"];
        document.getElementById("executionTCs").value = data["executionTCs"];
        document.getElementById("dataCreationTCs").value = data["dataCreationTCs"];
        document.getElementById("batTCs").value = data["batTCs"];
        document.getElementById("ktTCs").value = data["ktTCs"];
        document.getElementById("defectsTCs").value = data["defectsTCs"];
    }
}

function ClearTextBoxes() {
    document.getElementById("scriptBuildCount").value = '';
    document.getElementById("executionCount").value = '';
    document.getElementById("dataCreationCount").value = '';
    document.getElementById("batCount").value = '';
    document.getElementById("ktcount").value = '';
    document.getElementById("defectsCount").value = '';
    document.getElementById("achievements").value = '';
    document.getElementById("milestones").value = '';
    document.getElementById("beyondWorkTasks").value = '';

    if (isFortNightTypeSelected) {
        document.getElementById("scriptBuildTCs").value = '';
        document.getElementById("executionTCs").value = '';
        document.getElementById("dataCreationTCs").value = '';
        document.getElementById("batTCs").value = '';
        document.getElementById("ktTCs").value = '';
        document.getElementById("defectsTCs").value = '';
    }
}

function writeToFile(name) {
    sw.write("\"" + name + "\" : \"" + document.getElementById(name).value + "\",");
}

function writeTextAreaDataToFileWithoutComa(name) {
    sw.write("\"" + name + "\" : \"" + GetFormattedTextForTextArea(name) + "\"");
}

function writeTextAreaDataToFile(name) {
    sw.write("\"" + name + "\" : \"" + GetFormattedTextForTextArea(name) + "\",");
}

function GetFormattedTextForTextArea(name) {
    var str = document.getElementById(name).value;
    return str.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
}

function createTimeSheetId() {
    sw.write("\"TimeSheetId\" : \"" + timeSheetValue + "\",");
}

function disableSubmitBtn(shouldDisable) {

    document.getElementById("insertrecord").disabled = shouldDisable;
}

function createJson(isFileEmpty, isFortNightTypeSelected) {

    if (isFileEmpty) {
        sw.Write("[");
    } else {

        sw.Write(",");
    }

    sw.Write("{\"LoginId\" : \"" + uid + "\",");

    createTimeSheetId();

    writeToFile("scriptBuildCount");
    writeToFile("executionCount");
    writeToFile("dataCreationCount");
    writeToFile("batCount");
    writeToFile("ktcount");
    writeToFile("defectsCount");

    if (isFortNightTypeSelected) {
        writeToFile("scriptBuildTCs");
        writeToFile("executionTCs");
        writeToFile("dataCreationTCs");
        writeToFile("batTCs");
        writeToFile("ktTCs");
        writeToFile("defectsTCs");
    }

    writeTextAreaDataToFile("achievements");
    writeTextAreaDataToFile("milestones");
    writeTextAreaDataToFileWithoutComa("beyondWorkTasks");

    sw.write("}]");
}

function Logout() {
    window.location.href = "login.html";
}


var Excel;
var numberOfRowsInExcel = 100;

function CheckIsValidUser(uid, upwd) {
    var isValidUser = false;

    var activeSheet = ReadExcel();

    for (var i = 2; i < numberOfRowsInExcel; i++) {
        var fromExcel = activeSheet.Cells(i, 1);
        if (fromExcel.value != undefined && fromExcel.value == uid) {
            var password = activeSheet.Cells(i, 2);
            if (password.value == upwd) {
                isValidUser = true;
                break;
            }
        }
    }

    CloseExcel();

    return isValidUser;
}

function ReadExcel() {
    Excel = new ActiveXObject("Excel.Application");
    Excel.Visible = false;
    return Excel.Workbooks.Open("C:\\Users\\n.chowdary.nelluri\\Desktop\\Progress\\Code\\Login1.xlsx").ActiveSheet;
}

function GetRegisteredUserIds() {

    var activeSheet = ReadExcel();
    var uids = [];
    for (var i = 2; i < numberOfRowsInExcel; i++) {
        var userName = activeSheet.Cells(i, 1).value;

        if(userName != undefined && (userName != "Gokul" && userName != "Blesston"))
            uids.push(userName);
    }

    CloseExcel();
    //uids.sort();
    return uids;
}

function CloseExcel() {
    Excel.Application.Quit();
}



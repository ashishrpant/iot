/**
 * Action Class
 *
 * All the post/fetch functions will be added in this file.
 */

class Actions {
    constructor() {

    }

    saveKeys(){
        let addKeys = {};
        utility.ShowHideLoader(true);
        addKeys['fleetpoint']               = document.querySelector('select[id="fleetPoint"]').value;
        addKeys['site']                     = document.querySelector('select[id="site"]').value;
        addKeys['serialno']                 = document.querySelector('select[id="deviceSerial"]').value;
        addKeys['tenant']                 = document.querySelector('input[id="operator"]').value;
        addKeys['note']                     = document.querySelector('input[id="note"]').value;

        var formvalue = document.querySelector("form#addDatasharings");
        var validationResult = formvalue.checkValidity();
        var validationReport = formvalue.reportValidity();


        var expirationDate = document.querySelector("#expirationDate");
        var expirationDateValue = expirationDate.value;
        var currentDate = new Date();
        var currenttime = currentDate.getTime();
        var usertime = new Date(expirationDateValue).getTime();
        /**
         * Date validatioms
         */
        let shareDataDropDown = document.querySelector("#share_data");
        var shareDataValue = shareDataDropDown.value;

        if (usertime < currenttime && shareDataValue == "pickDate") {
            validationResult = false;
            let errorContainer = document.querySelector('#displayMsg');
            errorContainer.style.display = 'block';
            errorContainer.innerHTML = "Please select a future date. Past dates are not allowed.";
            var classname1 = "alert alert-danger  mt-2 ml-2";
            errorContainer.className = classname1;
            setTimeout(function () {
                document.querySelector('#displayMsg').style.display = 'none';
            }, 6000);

            var classname1 = "is-invalid form-control";
            expirationDate.className = classname1;
            utility.ShowHideLoader(false);
        }else {
            validationResult = true;
            var classname1 = "form-control";
            expirationDate.className = classname1;
        }
        if(shareDataValue == "pickDate"){
            addKeys['expirydate']               = document.querySelector('input[id="expirationDate"]').value;
        }else{
            addKeys['expirydate']               = "forever";
        }
        var dataCommand = {
            'arg_action': "add",
            'arg_cid': tenantId,
            'arg_modify': { 'user':sessionUser,'ip':sessionUserIp,'fullname':sessionUserFullname },
            'arg_store': addKeys['fleetpoint'] + '~' + addKeys['site'] ,
            'arg_subtype': "",
            'arg_userinput': addKeys,
        }

        if (validationResult == true && validationReport == true && multipleClick == false) {
            multipleClick=true;
            fetch(baseUrl+"/classes/ManageDataSharingKeys.php", {
                method: "POST",
                body: JSON.stringify(dataCommand),
            }).then((r) => {
                return r.text();
            })
                .then((t) => {
                    utility.ShowHideLoader(false);
                    var response = JSON.parse(t);
                    if(response.status=="success"){
                        multipleClick=false;

                        let formData = document.querySelector('#addDatasharings');
                        formData.reset();
                        render.returnBackAfterAction();
                        var succResp = {
                            "status":'raw-success',
                            "result": "Keys has been added successfully"
                        }
                        addKeys['key'] = response.key;
                        if(sessionStorage.getItem("history")){
                            sessionStorage.setItem("history",JSON.stringify(addKeys)+','+sessionStorage.getItem("history"));
                        }else{
                            sessionStorage.setItem("history",JSON.stringify(addKeys))
                        }

                        buttonAction.renderButton("saveKeys",'Generate Keys',"fa fa-floppy-o",false);
                        message.renderMessage("displayMsg",JSON.stringify(succResp));
                    }else{
                        var errResponse = {
                            "status":'failure',
                            "result": response.status
                        };
                        multipleClick=false;
                        buttonAction.renderButton("saveKeys",'Generate Keys',"fa fa-floppy-o",false);
                        message.renderMessage("displayMsg",JSON.stringify(errResponse));
                    }
                })
                .catch(function(e){
                    console.log(e);
                    var response = {
                        "status":false,
                        "result":"Something went wrong, please try again later."
                    };
                    multipleClick=false;
                    buttonAction.renderButton("saveKeys",'Generate Keys',"fa fa-floppy-o",false);
                    message.renderMessage("displayMsg",JSON.stringify(response));
                });
        }else{
            utility.ShowHideLoader(false);
            buttonAction.renderButton("saveKeys",'Generate Keys',"fa fa-floppy-o",false);
        }
    }

    pairKeys(){

        let addKeys = {};
        addKeys['fleetpoint']               = document.querySelector('select[id="fleetPoint"]').value;
        addKeys['site']                     = document.querySelector('select[id="site"]').value;
        addKeys['key']                      = document.querySelector('input[id="key"]').value;
        addKeys['serialno']                 = document.querySelector('input[id="serialno"]').value;
        addKeys['source']                   = document.querySelector('input[id="source"]').value;
        addKeys['operator']                 = tenantId;

        var dataCommand = {
            'arg_action': "pair",
            'arg_cid': tenantId,
            'arg_modify': { 'user':sessionUser,'ip':sessionUserIp,'fullname':sessionUserFullname },
            'arg_subtype': "",
            'arg_userinput': addKeys,
        }

        var formvalue = document.querySelector("form#addKeys");
        var validationResult = formvalue.checkValidity();
        var validationReport = formvalue.reportValidity();

        if(multipleClick==false && validationResult==true && validationReport==true){
            utility.ShowHideLoader(true);
            multipleClick=true;
            fetch(baseUrl+"/classes/ManageDataSharingKeys.php", {
                method: "POST",
                body: JSON.stringify(dataCommand),
            }).then((r) => {
                return r.text();
            })
                .then((t) => {
                    utility.ShowHideLoader(false);
                    var response = JSON.parse(t);
                    if(response.success!="" && response.hasOwnProperty("success")){
                        multipleClick=false;
                        render.returnBackAfterAction();

                        var succResp = {
                            "status":'raw-success',
                            "result": response.success
                        }
                        buttonAction.renderButton("pairKey",'Pair Keys',"fa fa-floppy-o",false);
                        message.renderMessage("displayMsg",JSON.stringify(succResp));
                    }else{
                        var errResponse = {
                            "status":'failure',
                            "result": response.error
                        }
                        multipleClick=false;
                        buttonAction.renderButton("pairKey",'Pair Keys',"fa fa-floppy-o",false);
                        message.renderMessage("displayMsg",JSON.stringify(errResponse));
                    }
                })
                .catch(function(){
                    var response = {
                        "status":false,
                        "result":"Something went wrong, please try again later."
                    };
                    multipleClick=false;
                    buttonAction.renderButton("pairKey",'Save',"fa fa-floppy-o",false);
                    message.renderMessage("displayMsg",JSON.stringify(response));
                });
        }else{
            utility.ShowHideLoader(false);
            buttonAction.renderButton("pairKey",'Pair Keys',"fa fa-floppy-o",false);

        }
    }

    listKeys(mode,type,appendTo=null){
        var dataCommand = {
            'arg_action': "list",
            'arg_cid': tenantId,
            'arg_type': type,
        }

        return fetch(baseUrl+"classes/ManageDataSharingKeys.php", {
            method: "POST",
            body: JSON.stringify(dataCommand),
        }).then((r) => {
            return r.json();
        }).catch(function(e){
            console.log(e);
            var response = {
                "status":false,
                "result":"Something went wrong, please try again later."
            };
            message.renderMessage("displayMsg",JSON.stringify(response));
        });
    }

    listHistory(data,tbody){
        var rowCount = 1;
        utility.ShowHideLoader(false);

        if(sessionStorage.getItem("history")){
            data.forEach((e) => {
                let statusValue = parseInt(e.status);
                let row = document.createElement('tr');
                row.id = e.serialno;

                if(statusValue==0){
                    row.classList = "table-danger";
                }
                tbody.append(row);

                let tdRow = document.createElement('td');
                tdRow.innerHTML = rowCount;
                row.appendChild(tdRow);
                if(!e.hasOwnProperty("key")){
                    e.key="Not available";
                }

                delete e.key;
                elements.createTd(false,false,e.serialno,row);
                elements.createTd(false,false,e.fleetpoint+'~'+e.site,row);
                elements.createTd(false,false,e.tenant,row);
                rowCount++;
            });
        }else{
            let row = document.createElement('tr');
            tbody.append(row);

            let tdRow = document.createElement('td');
            tdRow.innerHTML = "No records available";
            tdRow.colSpan = 4;
            row.appendChild(tdRow);
            tbody.appendChild((tdRow))
        }
        return tbody;
    }

    changeKeys(mode,dataset){
        var noData = "";
        let checkboxes = document.querySelectorAll('input[type=checkbox]');
        var dataset = [];
        checkboxes.forEach(function (boxescheck) {
            var dataset_in = new Array();
            if (boxescheck.checked == true) {
                dataset.push({
                    'key' :boxescheck.dataset.key,
                    'serialno': boxescheck.dataset.serialno,
                    'source': boxescheck.dataset.source,
                    'destination': boxescheck.dataset.destination
                });
            }
        });



        if (!(Object.keys(dataset).length === 0)) {
            buttonAction.renderButton(mode, 'Please wait', "fa fa-spinner fa-spin", true);
            if(mode=="revoke"){
                render.showRevokeReasonForm(dataset,mode);
            }else{
                this.updateKeyStatus(dataset,mode);
            }
        }else {
            var response = {
                "status": "failure",
                "result": "Please select the checkboxes before proceeding"
            };
            message.renderMessage("displayMsg", JSON.stringify(response));
            utility.ShowHideLoader(false);
        }
    }


    updateKeyStatus(dataset,mode,note=false){
        var prevMode = mode;
        var key = null;
        var source = null;
        var serialno = null;
        var destination = null;
        var i = 0;
        dataset.forEach(function (e) {
            if (i == 0) {
                key = e.key;
                serialno = e.serialno;
                destination = e.destination;
            } else {
                key = key + "," + e.key;
                serialno = serialno + "," + e.serialno;
                destination = destination + "," + e.destination;
            }
            i++;
        });

        var dataCommand = {
            'arg_cid': tenantId,
            'arg_action': mode,
            'arg_modify': { 'user':sessionUser,'ip':sessionUserIp,'fullname':sessionUserFullname },
            'arg_userinput': {'sharedkey': key,'serialno':serialno,'destination':destination},
        }

        if(mode=="revoke"){
            dataCommand.arg_userinput['note'] = note;
        }
        if(multipleClick==false){
            multipleClick=true;
            fetch(baseUrl+"/classes/ManageDataSharingKeys.php", {
                method: "POST",
                body: JSON.stringify(dataCommand),
            }).then((r) => {
                return r.text();
            })
            .then((t) => {
                document.querySelector('#hiddenspin').style.display = 'none';
                var response = JSON.parse(t);
                if(response.success!="success"){
                    multipleClick=false;
                    if(mode=="reject") {
                        response.success = "Pair key request has been denied.";
                        let row = document.querySelector('#row_' + dataset[0].key);
                        row.style.display = "none";
                        render.returnBackAfterAction();
                    }else {
                        dataset.forEach(function (e) {
                            let row = document.querySelector('#row_' + e.key);
                            row.style.display = "none";
                        });
                        render.returnBackAfterAction();
                    }
                    var messageResponse = {
                        "status":'raw-success',
                        "result": response.success
                    }
                }else{
                    var messageResponse = {
                        "status":'failure',
                        "result": response.status
                    };
                    multipleClick=false;
                    var errResponse = {
                        "status":'failure',
                        "result": response.success
                    }
                }
                if(!sessionStorage.getItem("dataset")){
                    switch(mode){
                        case "revoke":
                            buttonAction.renderButton(mode,'Revoke',"fa fa-ban",false);
                            break;
                        case "renew":
                            buttonAction.renderButton(mode,'Renew',"fa fa-circle-o-notch",false);
                            break;
                        case "delete":
                            buttonAction.renderButton(mode,'Delete',"fa fa-trash",false);
                            break;
                    }
                }
                sessionStorage.removeItem("dataset");
                utility.ShowHideLoader(false);
                message.renderMessage("displayMsg",JSON.stringify(messageResponse));
            })
            .catch(function(e){
                console.log(e);
                utility.ShowHideLoader(false);
                var response = {
                    "status":false,
                    "result":"Something went wrong, please try again later."
                };
                multipleClick=false;
                if(!sessionStorage.getItem("dataset")) {
                    switch (mode) {
                        case "revoke":
                            buttonAction.renderButton(mode, 'Revoke', "fa fa-ban", false);
                            break;
                        case "renew":
                            buttonAction.renderButton(mode, 'Renew', "fa fa-circle-o-notch", false);
                            break;
                        case "delete":
                            buttonAction.renderButton(mode, 'Delete', "fa fa-trash", false);
                            break;
                    }
                }
                message.renderMessage("displayMsg",JSON.stringify(response));
            });
        }
    }


    listFleetPoint(mode,fleetpoint=null,site=null){
        var url = "";
        switch(mode){
            case "list-fleetpoints":
                url = complianceAPI+"overview/"+tenantId;
            break;
            case "list-sites":
                url = masterDataAPI+"list/stores/"+fleetpoint;
            break;
            case "site-devices":
                url = masterDataAPI+"list/devices/"+tenantId+"/"+fleetpoint+"/"+site;
                break;
        }

        return fetch(url).then((r) => {
            return r.text();
        })

    }
    setToggle(switch_param) {
        if (switch_param == "on") {
            $('#toggleonoff_1').removeClass("fa-toggle-off").addClass("fa-toggle-on");
            $('#toggleonoff').removeClass('btn-light').addClass('btn-primary');

        } else {
            $('#toggleonoff_1').removeClass("fa-toggle-on").addClass("fa-toggle-off");
            $('#toggleonoff').removeClass('btn-primary').addClass('btn-light');
        }
    }
}
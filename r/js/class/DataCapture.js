/**
 * Metrics Class
 *
 * A template for loading data into the p/device/template.html
 */

class DataCapture {
    constructor() {

        this.loadDeviceTemplate().then(() => {

            /**
             * IF-5489
             * Calling a function to add/remove classes based on screensize.
             */
            dataCapture.ResizeScreen();
            if (usertype != "admin") {
                document.querySelector('#datasharing').style.display = "none";
            }
        });
    }

    loadDeviceTemplate() {
        return fetch('p/main/template.html')
            .then((r) => r.text())
            .then((t) => {
                let selector = document.querySelector('#mainContent');
                selector.innerHTML = t;

                var params = {};
                document.querySelector('#homepage').append(links.generateLinks(" Home",true,true,true,"/bin/base/basemenu.php",params));
                document.querySelector('#datacapture').append(links.generateLinks("Data Capture",false));
                document.addEventListener('click', function (e) {
                    /**
                     * Reset the nav bar colors
                     */
                    var getLists = document.querySelectorAll("#myTab li a");
                    Object.entries(getLists).forEach(([key, value]) => {
                        var nav_value = value;
                        nav_value.classList = "nav-link secondary_menu  ";
                    });

                    if(e.target.tagName != 'HTML' && e.target.tagName != 'BODY' ) {
                        if (e.target.parentElement.nodeName == "BUTTON") {
                            var getStatus = e.target.parentElement.id;
                        } else  if (e.target.parentElement.nodeName == "A") {
                            var getStatus = e.target.parentElement.id;
                        } else if (e.target.parentElement.parentElement.nodeName == "LI") {
                            var getStatus = e.target.parentElement.parentElement.dataset.utility;
                        } else {
                            var getStatus = e.target.id;
                        }
                    }
                    switch (getStatus) {
                        /**
                         * start here
                         * Dash board menu event handling
                         */
                        case 'toggle_date':
                            let toggle_date = document.querySelector("#toggle_date");
                            let show_date = document.querySelector("#show_date");
                            if (toggle_date.checked == true) {
                                show_date.style.display="";
                            }else{
                                show_date.style.display="none";
                            }
                            break;
                        case 'nav-receive-tab':
                                render.ReturnToThisTab("nav-receive-tab");
                                dataCapture.ShowHideButtons(false,false,false,false);
                                if(multiclick == false){
                                    actions.listKeys("list","receive").then((responseData)=>{
                                        render.loadDataSharingTabs("/p/dataSharing/receivedData.html","receive",responseData,"list-data-receive tbody");
                                    });
                                }
                            break;
                        case 'nav-revoked-tab':
                            render.ReturnToThisTab("nav-revoked-tab");
                            dataCapture.ShowHideButtons(true,true,false,false);
                            if(multiclick == false){
                                actions.listKeys("list","revoked").then((responseData)=>{
                                    render.loadDataSharingTabs("/p/dataSharing/revoked.html","revoked",responseData,"list-data-revoked tbody");
                                });
                            }
                            break;
                        case 'nav-pending-assignment-tab':
                            render.ReturnToThisTab("nav-pending-assignment-tab");
                            dataCapture.ShowHideButtons(false,false,false,false);
                            if(multiclick == false){
                                actions.listKeys("list","pending").then((responseData)=>{
                                    render.loadDataSharingTabs("/p/dataSharing/pending.html","pending",responseData,"list-data-pending tbody");
                                });
                            }
                            break;
                        case 'nav-expired-tab':
                            render.ReturnToThisTab("nav-expired-tab");
                            dataCapture.ShowHideButtons(true,true,true,false);
                            if(multiclick == false){
                                actions.listKeys("list","expired").then((responseData)=>{
                                    render.loadDataSharingTabs("/p/dataSharing/expired.html","expired",responseData,"list-data-expired tbody");
                                });
                            }
                            break;
                        case 'nav-rejected-tab':
                            render.ReturnToThisTab("nav-rejected-tab");
                            dataCapture.ShowHideButtons(true,true,false,false);
                            if(multiclick == false){
                                actions.listKeys("list","rejected").then((responseData)=>{
                                    render.loadDataSharingTabs("/p/dataSharing/rejected.html","rejected",responseData,"list-data-rejected tbody");
                                });
                            }
                            break;
                        case 'nav-history-tab':
                            render.ReturnToThisTab("nav-history-tab");
                            dataCapture.ShowHideButtons(false,false,false,false);
                            var history = JSON.parse('[' + sessionStorage.getItem("history") + ']');
                            fetch(portalUrl+"/p/dataSharing/history.html")
                                .then((r) => r.text())
                                .then((t) => {
                                    let selector = document.querySelector('#dataSharingLists');
                                    selector.innerHTML = t;

                                    var historyTable = document.querySelector('#list-data-history tbody');
                                    historyTable.innerHTML="";
                                    actions.listHistory(history, historyTable);
                                }).then((j) => {
                                /**
                                 * IF-5439
                                 * Adding datatables to history tab
                                 */
                                if(sessionStorage.getItem("history")){
                                    render.useDataTables("list-data-history",{"bPaginate": false});
                                }
                            });

                            break;
                        case 'nav-share-tab':
                            render.ReturnToThisTab("nav-share-tab");
                            dataCapture.ShowHideButtons(false,true,false,true);
                            if(multiclick == false){
                                actions.listKeys("list","send").then((responseData)=>{
                                    render.listDataSharing("/p/dataSharing/sharedData.html","send",responseData,"list-data tbody");
                                });
                            }
                            break;
                        case 'toggleonoff':
                            dataCapture.ToggleOnOff();
                            break;

                        case 'collapsed':
                            console.log(collapsed);
                            if (collapsed == true) {
                                dataCapture.ExpandMenu();
                            } else {
                                dataCapture.CollapseMenu();
                            }
                            break;
                        case 'home':
                            utility.ShowHideLoader(true);
                            document.querySelector("#home").classList = "nav-link secondary_menu_active active";
                            render.showHomePage();
                            break;
                        case "cancel":
                        case 'datasharing':
                            utility.ShowHideLoader(true);
                            render.ReturnToThisTab("nav-share-tab");
                            if(multiclick == false){
                                actions.listKeys("list","send").then((responseData)=>{
                                    render.listDataSharing("/p/dataSharing/sharedData.html","send",responseData,"list-data tbody");
                                });
                            }
                            document.querySelector("#datasharing").classList = "nav-link secondary_menu_active active";
                            break;
                        case 'sites':
                            utility.ShowHideLoader(true);
                            document.querySelector("#sites").classList = "nav-link secondary_menu_active active";
                            render.showSites();
                            break;
                        case 'configs':
                            utility.ShowHideLoader(true);
                            document.querySelector("#configs").classList = "nav-link secondary_menu_active active";
                            render.showConfigs();
                            break;
                        /**
                         * Data Sharing module
                         */
                        case 'generate_keys':
                            utility.ShowHideLoader(true);
                            render.showGenerateKeyForm();
                            document.querySelector("#datasharing").classList = "nav-link secondary_menu_active active";
                            break;
                        case"enterKey":
                            var dataset = e.target.dataset;
                            utility.ShowHideLoader(true);
                            render.showEnterKeyForm(dataset);
                            document.querySelector("#datasharing").classList = "nav-link secondary_menu_active active";
                            break;
                        case "reject":
                            render.ReturnToThisTab("nav-pending-assignment-tab");
                            utility.ShowHideLoader(true);
                            var dataset = [];
                            dataset.push({
                                'key' :e.target.dataset.key,
                                'serialno': e.target.dataset.serialno,
                                'source': e.target.dataset.source,
                                'destination': ""
                            });
                            actions.updateKeyStatus(dataset,"reject");
                            document.querySelector("#datasharing").classList = "nav-link secondary_menu_active active";
                            break;
                        case "cancelKeys":
                            utility.ShowHideLoader(true);
                            render.returnBackAfterAction();
                            document.querySelector("#datasharing").classList = "nav-link secondary_menu_active active";
                            break;
                        case "saveKeys":
                            utility.ShowHideLoader(true);
                            actions.saveKeys();
                            document.querySelector("#datasharing").classList = "nav-link secondary_menu_active active";
                            break;
                        case "pairKey":
                            buttonAction.renderButton('pairKey','Please wait',"fa fa-spinner fa-spin",true);
                            actions.pairKeys();
                            document.querySelector("#datasharing").classList = "nav-link secondary_menu_active active";
                            break;
                        case "revoke":
                            utility.ShowHideLoader(true);
                            actions.changeKeys("revoke",e.target.dataset);
                            document.querySelector("#datasharing").classList = "nav-link secondary_menu_active active";
                            break;
                        case "delete":
                            utility.ShowHideLoader(true);
                            actions.changeKeys("delete");
                            document.querySelector("#datasharing").classList = "nav-link secondary_menu_active active";
                            break;
                        case "renew":
                            utility.ShowHideLoader(true);
                            actions.changeKeys("renew");
                            document.querySelector("#datasharing").classList = "nav-link secondary_menu_active active";
                            break;
                        /*
                        * Add Keys
                        */
                        case 'revokedevice':
                            render.ReturnToThisTab("nav-share-tab");
                            buttonAction.renderButton("revokedevice", 'Please wait', "fa fa-spinner fa-spin", true);
                            var revokeDataShareForm = document.querySelector("form#revokeDataShare");
                            var validationResult = revokeDataShareForm.checkValidity();
                            var validationReport = revokeDataShareForm.reportValidity();
                            var note = document.querySelector("#revoke_confirmation_reason").value;
                            var revokeConfirmation = document.querySelector("#revoke_confirmation");
                            if(revokeConfirmation.value.toUpperCase()!="REVOKE"){
                                validationResult = false;
                                utility.ShowHideLoader(false);
                                var response = {
                                    "status":"failure",
                                    "result":"Please enter <strong>REVOKE</strong> in the text box below as a confirmation."

                                };
                                message.renderMessage("displayMsg",JSON.stringify(response));
                                var classname1 = "is-invalid form-control";
                                revokeConfirmation.className = classname1;
                            }else{
                                validationResult = true;
                                var classname1 = "form-control";
                                revokeConfirmation.className = classname1;
                            }

                            var dataSet = JSON.parse(sessionStorage.getItem("dataset"));

                            if (validationResult == true && validationReport == true && multipleClick == false) {
                                actions.updateKeyStatus(dataSet,"revoke",note);
                            }
                            break;
                        case 'delete_share':
                            var keys = e.target.dataset.key;
                            let deleteRow = document.querySelector('#row_'+keys);
                            deleteRow.style.display = "none";

                            let totalRecord= document.querySelector('#totalRecord');
                            var totalData =totalRecord.dataset.datacount - 1;
                            totalRecord.setAttribute("data-datacount",totalData);
                            if(totalData==0){
                                render.returnBackAfterAction();
                            }
                            var dataSet = JSON.parse(sessionStorage.getItem("dataset"));
                            dataSet.forEach((index,e) => {
                                if(index.key == keys){
                                    dataSet.splice(e,1);
                                }
                            });
                            sessionStorage.setItem("dataset",JSON.stringify(dataSet));
                            break;
                        case 'compliance':
                            utility.ShowHideLoader(true);
                            document.querySelector("#compliance").classList = "nav-link secondary_menu_active active";
                            const d = new Date();
                            let time = d.getTime();
                            import('./Compliance.js?v='+time)
                                .then(module => {
                                    let compliance = new module.Compliance();
                                });
                            if(trackerMenu==false){
                                dataCapture.CollapseMenu();
                            }

                            break;
                    }
                    /**
                     * IF-5489
                     * Adding a listener to add/remove classed based on screen size.
                     */
                    window.addEventListener('resize',dataCapture.ResizeScreen);
                });
            });
    }

    /**
     * Expand menu
     */
    ExpandMenu(){
        collapsed = false;
        if(document.documentElement.clientWidth==820 || document.documentElement.clientWidth==768 || document.documentElement.clientWidth==1024 || document.documentElement.clientWidth==1180){
            document.querySelector("div.leftSideCollapsed").classList = ['leftSideExpanded  col-3'];
            document.querySelector("div.rightSideCollapsed").classList = ['rightSideExpanded col-9']
        }else{
            document.querySelector("div.leftSideCollapsed").classList = ['leftSideExpanded  col-2'];
            document.querySelector("div.rightSideCollapsed").classList = ['rightSideExpanded col-10'];
        }
        let leftColl = document.querySelector('i.fa-chevron-right');
        leftColl.classList = "fa fa-chevron-left fa-2x";
        Object.entries(document.querySelectorAll('.hideText')).forEach(([key, value]) => {
            value.style.display = "";
        });
    }

    /**
     * collapse the left menu
     */

    CollapseMenu(){
        collapsed = true;
        let leftColl = document.querySelector('i.fa-chevron-left');
        leftColl.classList = "fa fa-chevron-right fa-2x";
        document.querySelector("div.leftSideExpanded").classList = ['leftSideCollapsed'];
        document.querySelector("div.rightSideExpanded").classList = ['rightSideCollapsed col-12 ml-5'];
        Object.entries(document.querySelectorAll('.hideText')).forEach(([key, value]) => {
            value.style.display = "none";
        });
    }
    /**
     * IF-5489
     * This function will add/remove css based on size of the screen.
     * @constructor
     */
    ResizeScreen(){
        let leftSideExpanded = document.querySelector("div.leftSideExpanded");
        if(document.documentElement.clientWidth==820 || document.documentElement.clientWidth==768 || document.documentElement.clientWidth==1024 || document.documentElement.clientWidth==1180) {
            if(leftSideExpanded != null){
                document.querySelector("div.leftSideExpanded").classList = ['leftSideExpanded  col-3'];
                document.querySelector("div.rightSideExpanded").classList = ['rightSideExpanded col-9']
            }
        }else{
            if(leftSideExpanded != null) {
                document.querySelector("div.leftSideExpanded").classList = ['leftSideExpanded  col-2'];
                document.querySelector("div.rightSideExpanded").classList = ['rightSideExpanded col-10'];
            }
        }
    }
    ToggleOnOff(onlyOff=false){
        var i = 0;
        let checkboxes = document.querySelectorAll('input[type=checkbox]');
        checkboxes.forEach(function (boxescheck) {
            if (boxescheck.checked == true) {
                boxescheck.checked = false;
                actions.setToggle('off');
             } else {
                boxescheck.checked = true;
                actions.setToggle('on');
            }
        });
    }

    /**
     * Function to manipulate different buttons in the data sharing module
     * @param deletebutton = true ; show the button else hide
     * @param showtoggle = true ; show the button else hide
     * @param renewbutton = true ; show the button else hide
     * @param revokebutton = true ; show the button else hide
     * @constructor
     */

    ShowHideButtons(deletebutton,showtoggle,renewbutton,revokebutton){
        if(!deletebutton){
            document.querySelector('.deletebutton').style.display = "none";
        }else{
            document.querySelector('.deletebutton').style.display = "";
        }
        if(!showtoggle){
            document.querySelector('.showtoggle').style.display = "none";
        }else{
            document.querySelector('.showtoggle').style.display = "";
        }
        if(!renewbutton){
            document.querySelector('.renewbutton').style.display = "none";
        }else{
            document.querySelector('.renewbutton').style.display = "";
        }
        if(!revokebutton){
            document.querySelector('.revokebutton').style.display = "none";
        }else{
            document.querySelector('.revokebutton').style.display = "";
        }
        /**
         * Utility helper function to show/hide the loader spin based off different event
         * pass True if we need to display loading spinner; else false
         */
        utility.ShowHideLoader(true);
    }

}
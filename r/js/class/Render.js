/**
 * Device Class
 *
 * A template for loading data into the p/device/template.html
 */
class Render {
	baseUrl = "/bin/mqtt/api/v1/";
	constructor() {

	}
	showNotifications(){
		return fetch(portalUrl+'/p/dataSharing/notifications.html')
			.then((r) => r.text())
			.then((t) => {
				utility.ShowHideLoader(false);
				let selector = document.querySelector('#subcontainer');
				selector.innerHTML = t;
			});
	}
	showHomePage(){
		return fetch(portalUrl+'/p/main/dashboard.html')
			.then((r) => r.text())
			.then((t) => {
				utility.ShowHideLoader(false);
				let selector = document.querySelector('#subcontainer');
				selector.innerHTML = t;
			});
	}
	showCompliance(){
		return fetch(portalUrl+'/p/compliance/template.html')
			.then((r) => r.text())
			.then((t) => {
				utility.ShowHideLoader(false);
				let selector = document.querySelector('#subcontainer');
				selector.innerHTML = t;
			});
	}
	showSites(){
		return fetch(portalUrl+'/p/sites/template.html')
			.then((r) => r.text())
			.then((t) => {
				utility.ShowHideLoader(false);
				let selector = document.querySelector('#subcontainer');
				selector.innerHTML = t;
			});
	}
	showConfigs(){
		return fetch(portalUrl+'/p/configs/template.html')
			.then((r) => r.text())
			.then((t) => {
				utility.ShowHideLoader(false);
				let selector = document.querySelector('#subcontainer');
				selector.innerHTML = t;
			});
	}
	listDataSharing(fetchUrl,mode,responseData,appendTo) {
		multiclick = true;
		return fetch(portalUrl+'/p/dataSharing/listDataSharing.html')
			.then((r) => r.text())
			.then((t) => {
				let selector = document.querySelector('#subcontainer');
				multiclick = false;
				selector.innerHTML = t;
				render.loadDataSharingTabs(fetchUrl,mode,responseData,appendTo);
			}).then((j)=>{
				let pending_items_span = document.querySelector("#pending_items");
				pending_items_span.innerHTML = 0;
			});
	}
	loadDataSharingTabs(fetchUrl,mode,responseData,appendTo){
		/**
		 * Updates the Pending counter
		 */
		render.updatePendingCounter();

		let selector = document.querySelector('#dataSharingLists');
		selector.innerHTML = "";
		return fetch(portalUrl+fetchUrl)
			.then((r) => r.text())
			.then((t) => {
				selector.innerHTML = t;
				render.renderDataSharingTablesDatas(responseData,mode,appendTo)
			}).then((j) => {
				/**
				 * IF-5439
				 * Add datatables to all of the tables, if there are data available
				 */
				if(!responseData.hasOwnProperty('error')) {
					var tableName = appendTo.split(' ');
					render.useDataTables(tableName[0],{"bPaginate": true});
				}
			});
	}

	showGenerateKeyForm(){
		return fetch(portalUrl+'/p/dataSharing/addDataSharingAccess.html')
			.then((r) => r.text())
			.then((t) => {
				utility.ShowHideLoader(false);
				let selector = document.querySelector('#subcontainer');
				selector.innerHTML = t;

				actions.listFleetPoint("list-fleetpoints").then((k) => {
					let responseData = JSON.parse(k);
					this.appendSelect(responseData.overview,"fleetPoint");
				});

				const fleetPointSelect = document.querySelector('#fleetPoint');
				var fleetPointValue = null;
				fleetPointSelect.addEventListener('change', (event) => {
					fleetPointValue = event.target.value;
					this.populateSelect("list-sites",fleetPointValue);
					fleetPointSelect.removeEventListener('change',event);
				});

				const siteSelect = document.querySelector('#site');
				var siteValue = null;
				siteSelect.addEventListener('change', (event) => {
					siteValue = event.target.value;
					this.populateSelect("site-devices",fleetPointValue,siteValue);
					siteSelect.removeEventListener('change',event);
				});

				const datePickerSelect = document.querySelector('#share_data');
				var dateValue = null;
				datePickerSelect.addEventListener('change', (event) => {
					dateValue = event.target.value;
					let show_date = document.querySelector("#show_date");
					if (dateValue == "pickDate") {
						show_date.style.display="";
						let expireationDateBox = document.querySelector('#expirationDate').setAttribute("required","required");

					}else{
						show_date.style.display="none";
						let expireationDateBox = document.querySelector('#expirationDate').removeAttribute("required");

					}

				});

			});
	}

	showEnterKeyForm(dataset){
		return fetch(portalUrl+'/p/dataSharing/addEnterKeyForm.html')
			.then((r) => r.text())
			.then((t) => {
				utility.ShowHideLoader(false);
				let selector = document.querySelector('#subcontainer');
				selector.innerHTML = t;

				actions.listFleetPoint("list-fleetpoints").then((k) => {
					let responseData = JSON.parse(k);
					this.appendSelect(responseData.overview,"fleetPoint");
				});

				const fleetPointSelect = document.querySelector('#fleetPoint');
				var fleetPointValue = null;
				fleetPointSelect.addEventListener('change', (event) => {
					fleetPointValue = event.target.value;
					this.populateSelect("list-sites",fleetPointValue);
					fleetPointSelect.removeEventListener('change',event);
				});

				const siteSelect = document.querySelector('#site');
				var siteValue = null;
				siteSelect.addEventListener('change', (event) => {
					siteValue = event.target.value;
					siteSelect.removeEventListener('change',event);
				});

				document.querySelector('#key').value = dataset.key;
				document.querySelector('#serialno').value = dataset.serialno;
				document.querySelector('#source').value = dataset.source
			});
	}

	appendSelect(responseData,identifier){
		let selectIdentifier = "";
		selectIdentifier = document.querySelector('#'+identifier);

		var param = "";
		switch(identifier){
			case "site":
				param = "site";
				break;
			case "deviceSerial":
				param = "device";
				break;
			case "fleetPoint":
				param = "fleetpoint";
		}
		selectIdentifier.innerHTML ="<option value=\"\">Please select a "+param+"</option>";
		responseData.forEach((e) => {
			var optionEl = null;
			if(identifier=="fleetPoint") {
				optionEl = elements.createSelectOption(e.fleetpoint);
			}else if(identifier=="site") {
				optionEl = elements.createSelectOption(e.site);
			}
			else if(identifier=="deviceSerial") {
				optionEl = elements.createSelectOption(e.serialno);
			}
			selectIdentifier.appendChild((optionEl))
		});
	}

	populateSelect(mode,fleetPoint,site=null){
		if(site!=null){
			actions.listFleetPoint(mode,fleetPoint,site).then((k) => {
				let responseData = JSON.parse(k);
				if(responseData.devices!="No records found"){
					this.appendSelect(responseData.devices,"deviceSerial");
				}
			});
		}else{
			actions.listFleetPoint(mode,fleetPoint).then((k) => {
				let responseData = JSON.parse(k);
				if(responseData.stores!="No records found"){
					this.appendSelect(responseData.stores,"site");;
				}
			});
		}

	}

	renderDataSharingTablesDatas(responseData,type,appendTo){
		utility.ShowHideLoader(false);
		let tbody = document.querySelector('#'+appendTo);
		tbody.innerHTML = "";
		var rowCount = 1;
		if(!responseData.hasOwnProperty('error')){
			responseData.forEach((e) => {
				var dataSet  = {
					"serialno": e.serialno,
					"key": e.key,
					"source":e.source
				}

				let statusValue = parseInt(e.status);
				let row = document.createElement('tr');
				row.id = "row_"+e.key;

				if(statusValue==0){
					row.classList = "table-danger";
				}
				tbody.append(row);

				let tdRow = document.createElement('td');
				tdRow.innerHTML = rowCount;
				row.appendChild(tdRow);
				if(e.destination==""){
					e.destination = e.tenant;
				}
				if(type == "send" || type == "revoked" || type=="expired" || type=='rejected'){
					let tdToggle = document.createElement('td');
					elements.createToggle({'key':e.key,'serialno':e.serialno,'destination':e.destination,'source':e.source},tdToggle);
					row.appendChild(tdToggle);
				}

				if(type != "revoked"){
					delete e.modified;
					delete e.committed;
				}
				var revokeNotes = "";
				if(type=="revoked") {
					revokeNotes = e.note;
				}
				delete e.note
				delete e.operator;
				delete e.status;
				delete e.tenant;
				delete e.key;

				if(type != "send"){
					delete e.created;
				}
				elements.createRow(e,tbody,row);
				if(type != "pending"){
					elements.createStatus(statusValue,row);
				}else{
					let tdButtons = document.createElement('td');
					elements.createButton(tdButtons,dataSet,"enterKey","Approve","btn btn-success btn-sm",true,"fa fa-check-circle ml-1");
					elements.createButton(tdButtons,dataSet,"reject","Reject","btn btn-danger btn-sm ml-1",true,"fa fa fa-minus-circle ml-1");
					row.appendChild(tdButtons);
				}
				if(type=="revoked"){
					let tdNote = document.createElement('td');
					tdNote.innerHTML = revokeNotes;
					row.appendChild(tdNote);
				}
				rowCount++;
			});
		}else{
			let row = document.createElement('tr');
			tbody.append(row);

			let tdRow = document.createElement('td');
			tdRow.innerHTML = "No records available";
			tdRow.colSpan = 9;
			row.appendChild(tdRow);
			tbody.appendChild((tdRow))
		}
	}

	updatePendingCounter(data=null){
		let pending_items_span = document.querySelector("#pending_items");
		actions.listKeys("list","pending").then((pendingData)=>{
			if(!pendingData.hasOwnProperty('error')) {
				var pending_items = pendingData.length;
			}else{
				var pending_items = 0;
			}
			if(pending_items>0){
				pending_items_span.innerHTML= pending_items;
			}else{
				pending_items_span.innerHTML= pending_items;
			}
		});
	}
	/**
	 * IF-5439
	 * Function to add datables to all of the tables.
	 */
	useDataTables(tableName,params=null){
		$('#'+tableName).DataTable(params);
	}
	returnBackAfterAction(){
		var returnUrl = sessionStorage.getItem("returnUrl");
		var mode = "";
		var fetchUrl = '';
		var appendTo = "";
		switch(returnUrl){
			case "nav-share-tab":
				fetchUrl = "/p/dataSharing/sharedData.html";
				mode = "send";
				appendTo = "list-data tbody";
				break;
			case "nav-receive-tab":
				fetchUrl = "/p/dataSharing/receivedData.html";
				mode = "receive";
				appendTo = "list-data-receive tbody";
				break;
			case "nav-revoked-tab":
				fetchUrl = "/p/dataSharing/revoked.html";
				appendTo = "list-data-revoked tbody";
				mode = "revoked";
				break;
			case "nav-pending-assignment-tab":
				fetchUrl = "/p/dataSharing/pending.html";
				appendTo = "list-data-pending tbody";
				mode = "pending";
				break;
			case "nav-expired-tab":
				fetchUrl = "/p/dataSharing/expired.html";
				appendTo = "list-data-expired tbody";
				mode = "expired";
				break;
			case "nav-history-tab":
				fetchUrl = "/p/dataSharing/history.html";
				appendTo = "list-data-history tbody";
				mode = "history";
				break;
			case "nav-rejected-tab":
				fetchUrl = "/p/dataSharing/rejected.html";
				appendTo = "list-data-rejected tbody";
				mode = "rejected";
				break;
			default:
				fetchUrl = "/p/dataSharing/sharedData.html";
				appendTo = "list-data tbody";
				mode = "send";
				break;
		}

		fetch(portalUrl+'/p/dataSharing/listDataSharing.html')
			.then((r) => r.text())
			.then((t) => {
				let selector = document.querySelector('#subcontainer');
				multiclick = false;
				selector.innerHTML = t;
				document.querySelector('#'+returnUrl).click();
			});
	}

	ReturnToThisTab(returnUrl){
		sessionStorage.setItem("returnUrl",returnUrl);
	}

	/**
	 * IF-5435
	 * Add "reason" field in revoke form
	 */
	showRevokeReasonForm(dataSet,mode){
		var i = 0;
		let keysMode = {};
		let serialno = {};
		let destination = {}
		return fetch(portalUrl+'/p/dataSharing/revokeReason.html')
			.then((r) => r.text())
			.then((t) => {
				utility.ShowHideLoader(false);
				let selector = document.querySelector('#subcontainer');
				selector.innerHTML = t;
				document.querySelector('#reconfirm_dialogue').style.display = 'block';
			})
			.then((j) => {

				let revokeTableTist = document.querySelector('#table_list');
				revokeTableTist.style.display="block";

				let deviceIdHolder= document.querySelector('#device_id');
				deviceIdHolder.style.display="none";
				let revokeListSites = document.querySelector('#revoke_list_sites tbody');

				let totalRecord= document.querySelector('#totalRecord');
				totalRecord.setAttribute("data-datacount", dataSet.length);

				sessionStorage.setItem("dataset",JSON.stringify(dataSet));
				sessionStorage.setItem("mode","revoke");
				dataSet.forEach((e) => {
					var row = document.createElement('tr');
					row.id = "row_"+e.key;
					if (i == 0) {
						keysMode = e.key;
						serialno = e.serialno;
						destination = e.destination;
					} else {
						keysMode = keysMode + "," + e.key;
						serialno = serialno + "," + e.serialno;
						destination = destination + "," + e.destination;
					}

					let buttonDataset = {};
					buttonDataset = {'key':e.key,'serialno':e.serialno,'destination':e.destination,'source':e.source};
					delete e.key;
					elements.createRow(e,null,row);
					let tdButtonDelete = document.createElement('td');

					elements.createButton(tdButtonDelete,buttonDataset,"delete_share","Delete","btn btn-danger btn-sm",true,"fa fa-trash ml-1",'delete_share_1');
					row.appendChild(tdButtonDelete);
					revokeListSites.append(row);
					i++;
				});
			});
	}

	/**
	 * IF-5283
	 * Compliance V2
	 */
	fleetView(){
		fetch("/bin/iot/datacapture/p/compliance/fleetview.html")
			.then((r) => r.text())
			.then((t) => {

				let selector = document.querySelector("#subcontainer");
				selector.innerHTML = t;
			});
	}
}

export class Compliance {

	constructor() {

		this.ListFleet(tenantId);
		document.addEventListener('click', function (e) {

			if(e.target.tagName != 'HTML' && e.target.tagName != 'BODY') {
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
				case 'refresh':
				case 'fleetview':
					var fleetpoint = null;
					if(getStatus=="refresh"){
						let refreshBut = document.querySelector("#refresh");
						fleetpoint = refreshBut.dataset.fleetpt;
					}else{
						fleetpoint = e.target.dataset.fleetpt;
					}
					const d = new Date();
					let time = d.getTime();
					if(multipleClick == false){
						multipleClick = true;
						import('./ComplianceActions.js?v='+time)
							.then(module => {
								let complianceActions = new module.ComplianceActions().FleetViewPoint(fleetpoint);
							});
					}
					break;
				case 'view':
				case 'manage':
				case 'viewgauges':
				case 'viewsales':
				case 'viewprices':
				case 'dataentry':
				case 'manageFleetView':
					var response = {
						"status":"failure",
						"result":"This module is under construction."
					};
					multipleClick=false;
					message.renderMessage("displayMsg",JSON.stringify(response));
					var classname1 = "is-invalid form-control";
				break;
			}
		});

		document.removeEventListener('click', function (e) {

		});
	}

	ListFleet(operator="",fleetpoint=""){
		return fetch("/bin/iot/datacapture/p/compliance/fleetlist.html", {
			mode: 'cors',
		})
			.then((r) => r.text())
			.then((t) => {
				let selector = document.querySelector("#subcontainer");
				selector.innerHTML = t;
				utility.ShowHideLoader(false);
				let table = document.querySelector("table#fleetlist");
				let tbody = document.querySelector("table>tbody");

				fetch(complianceAPI+"overview/"+operator)
					.then((r) => {
						return r.text();
					}).then((t) => {

					try {
						var operatorlist = JSON.parse(t);
						let countRow = 1;
						if(!operatorlist.hasOwnProperty("error")){
							operatorlist.overview.forEach((value) => {
								if(value.fleetpoint!=""){

									let row = document.createElement('tr');
									row.id = value.operator;
									tbody.append(row);

									let rowNumber = document.createElement('td');
									rowNumber.innerHTML = countRow;
									row.appendChild(rowNumber);

									let tdToggle = document.createElement('td');
									elements.createToggle({'key':value.fleetpoint,'fleetpt':value.fleetpoint,'operator':tenantId},tdToggle);
									row.appendChild(tdToggle);

									let fleetPoint = document.createElement('td');
									let linkCreationFleetPoint = links.generateLinks(value.fleetpoint.toUpperCase(),false,true,false,"javascript:void(0)",null,null ,{'fleetpt':value.fleetpoint,'operator':tenantId},"fleetview");
									fleetPoint.appendChild(linkCreationFleetPoint);
									row.appendChild(fleetPoint);

									let siteNotReporting = document.createElement('td');
									siteNotReporting.innerHTML = value.total_sites;
									row.appendChild(siteNotReporting);

									let status = document.createElement('td');
									status.innerHTML = value.total_devices;
									row.appendChild(status);

									let action = document.createElement('td');
									let linkCreationManageIndividual = links.generateLinks("Manage",false,true,false,"javascript:void(0)",null,null ,{'fleetpt':value.fleetpoint,'operator':tenantId},"manageFleetView");
									action.appendChild(linkCreationManageIndividual);
									row.appendChild(action);
									tbody.appendChild(row);
									countRow++;
								}
							});
						}
						render.useDataTables("fleetlist",{
							"bPaginate":false,
							"bInfo": false,
							"language": {
								"zeroRecords": "No records to display"
							}
						});

					} catch(e) {
						console.log(e);
						var response = {
							"status":false,
							"result":"Something went wrong, please try again later."
						};
						multipleClick=false;
						message.renderMessage("displayMsg",JSON.stringify(response));
					}
				});
			})
	}
}

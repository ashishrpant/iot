export class ComplianceActions {
    FleetViewPoint(fleetpoint) {
        var fleetDetails = "";
        utility.ShowHideLoader(true);

        this.GetJsonAction(complianceAPI + "stores/"+fleetpoint).then((response) => {
            this.RenderFleetView().then((k)=>{
                var table = document.querySelector("table#fleetview");
                var tbody = document.querySelector("table>tbody");

                let refreshBut = document.querySelector("#refresh");
                refreshBut.setAttribute("data-fleetpt",fleetpoint);
                trackerMenu = true;

                let fleetPtContainer = document.querySelector("#fleetpoint");
                fleetPtContainer.innerHTML = fleetpoint;
                fleetDetails = JSON.parse(response);
                if(!fleetDetails.hasOwnProperty("error")) {
                    let storesArray = null;
                    var storeArrayLength = fleetDetails.stores.length;
                    for(var i=0;i<storeArrayLength;i++){
                        var storeArray = fleetDetails.stores[0];
                        this.RenderFleetSite(storeArray,tbody);
                    }
                }

            }).then((r)=> {
                var table = document.querySelector("table#fleetview");
                var newTh = document.createElement('th');
                table.rows[0].appendChild(newTh); // inser new th in node in the first row of thead
                newTh.innerHTML = 'Products';
                this.GetJsonAction(complianceAPI + "products/"+fleetpoint).then((response) => {
                    this.RenderProduct(JSON.parse(response),table.tBodies[0].childNodes)
                });


                /**
                 * Displays gauges , tanks and volumns
                 */

                var lastSales = null;
                this.GetJsonAction(complianceAPI + "gauges/"+fleetpoint).then((responseGauges) => {
                    var table = document.querySelector("table#fleetview");
                    var newTh = document.createElement('th');
                    table.rows[0].appendChild(newTh); // inser new th in node in the first row of thead
                    newTh.innerHTML = 'Tanks  <span style="width:75px" class="pull-right">Volume</span>';
                    this.GetJsonAction(complianceAPI + "tanks/"+fleetpoint).then((responseTanks) => {
                        this.GetProductVolume(JSON.parse(responseTanks),JSON.parse(responseGauges), table.tBodies[0].childNodes);
                    }).then((k)=>{
                        var table = document.querySelector("table#fleetview");
                        var newTh = document.createElement('th');
                        table.rows[0].appendChild(newTh);
                        newTh.innerHTML = 'Last Gauge';
                        this.RenderGauge(JSON.parse(responseGauges), table.tBodies[0].childNodes);
                    }).then((j)=>{
                        this.GetJsonAction(complianceAPI + "sales/"+fleetpoint).then((responseSales) => {
                            lastSales = responseSales;
                            this.RenderSalesEntry(JSON.parse(responseSales), table.tBodies[0].childNodes);
                        }).then((k)=>{
                            var table = document.querySelector("table#fleetview");
                            var newTh = document.createElement('th');
                            table.rows[0].appendChild(newTh);
                            newTh.innerHTML = 'Last Sales Entry';
                        }).then((r)=>{
                            this.RenderSales(JSON.parse(lastSales), table.tBodies[0].childNodes);
                        }).then((k)=>{
                            var table = document.querySelector("table#fleetview");
                            var newTh = document.createElement('th');
                            table.rows[0].appendChild(newTh);
                            newTh.innerHTML = 'Last Sales';
                        });
                    }).then((j)=>{
                        this.GetJsonAction(complianceAPI + "totalizers/"+fleetpoint).then((totalizerSales) => {
                            this.RenderTotalizer(JSON.parse(totalizerSales), table.tBodies[0].childNodes);
                        }).then((k)=>{
                            var table = document.querySelector("table#fleetview");
                            var newTh = document.createElement('th');
                            table.rows[0].appendChild(newTh); 
                            newTh.innerHTML = 'Last Master Totalizer';
                        })
                    });
                })
            });

        }).then((k)=>{

            multipleClick = false;

        });
    }

    /**
     * Used to render fleetview part
     */

    RenderFleetView() {
        return fetch("/bin/iot/datacapture/p/compliance/fleetview.html", {
            mode: 'cors',
        })
            .then((r) => r.text())
            .then((t) => {
                let selector = document.querySelector("#subcontainer");
                selector.innerHTML = t;

            })
    }

    GetJsonAction(url){
        return fetch(url)
            .then((r) => {
                return r.text();
            });
    }

    /**
     * @param storeArray list of all fleet and site
     * @param appendTo - where the data will be append the column
     * @constructor
     */

    RenderFleetSite(storeArray,appendTo){
        let countRow = 1;
        Object.entries(storeArray.site).forEach(([k, storeInfo]) => {
            var row = document.createElement('tr');

            let tdRow = document.createElement('td');
            tdRow.innerHTML = countRow;
            row.appendChild(tdRow);
            var infoStore = Object.assign({}, storeInfo.data[0]);

            var fleetpoint = storeArray.fleetpoint;
            var siteId = null;
            var phoneNumber =  infoStore.sitephoneno;
            siteId = storeInfo.id;
            row.setAttribute("data-siteid",siteId);
            row.setAttribute("data-fleetpoint",fleetpoint);
            if(phoneNumber !== ""){
                phoneNumber = ' PH: '+this.FormatPhone(phoneNumber);
            }else{
                phoneNumber = "";
            }

            elements.createTd(false, false, fleetpoint, row);
            elements.createTd(false, false, siteId+" "+infoStore.corpsite + '<div>'+infoStore.sitename+' </div><div>'+infoStore.siteaddr1+'</div><div>'+phoneNumber+' </div>', row);

            countRow++;
            appendTo.appendChild(row);
        });
    }

    /**
     * this will render the product
     * @param productArray list of all products
     * @param gaugeArray -  contains the last gauge volume
     * @param appendTo - where the data will be append the column
     * @constructor
     */

    RenderProduct(productArray,appendTo) {
        var availableSiteIds = [];
        Object.entries(productArray.products).forEach(([k, v]) => {
            var siteid = null;
            Object.entries(v.site).forEach(([siteIndex, siteList]) => {
                siteid = siteList.id;
                var productColumn = document.createElement('td');

                Object.entries(siteList.data).forEach(([productIndex, productList]) => {
                    var productDiv = document.createElement('div');
                    productDiv.innerHTML = productList.prodname1;
                    productColumn.appendChild(productDiv);

                });

                Object.entries(appendTo).forEach(([rowIndex, rows]) => {
                    var rowsiteid = rows.dataset.siteid;
                    if(siteid == rowsiteid){
                        availableSiteIds.push(rowsiteid);
                        appendTo[rowIndex].appendChild(productColumn);
                    }

                });
            });
        });

        this.RenderNotApplciable(availableSiteIds,appendTo,"N/A");
    }

    /**
     * This will display the last sales column
     * @param salesEntryArray - data that's used to render
     * @param appendTo - where the data will be append the column
     * @constructor
     */

    RenderSalesEntry(salesEntryArray,appendTo){
        var availableSiteIds = [];
        Object.entries(salesEntryArray.sales).forEach(([salesIndex, salesList]) => {
            var siteid = null;
            Object.entries(salesList.site).forEach(([gaugeIndex, lastGauge]) => {
                var dataSet = '';
                var gaugeState = lastGauge.status.nature;
                var gaugeStateCss = "";
                siteid = lastGauge.id;
                switch(gaugeState){
                    case "bad":
                        gaugeStateCss = "btn-danger";
                        break;
                    case "good":
                        gaugeStateCss = "btn-success";
                        break;
                    case "warning":
                        gaugeStateCss = "btn-warning";
                        break;
                }
                if(gaugeState ==  "none"){
                    dataSet = "Not applicable"
                }else{
                    dataSet = '<button style="width:140px" class="btn btn-sm  '+gaugeStateCss+'">'+lastGauge.status.readingdate+'</button>';
                }
                let tdLastGauge = document.createElement('td');
                tdLastGauge.innerHTML = dataSet;

                Object.entries(appendTo).forEach(([rowIndex, rows]) => {
                    var rowsiteid = rows.dataset.siteid;
                    if(siteid == rowsiteid){
                        availableSiteIds.push(rowsiteid);
                        appendTo[rowIndex].appendChild(tdLastGauge);
                    }
                });
            });
        });
        this.RenderNotApplciable(availableSiteIds,appendTo,"N/A");
    }

    /**
     * This will display the sales column
     * @param salesArray - data that's used to render
     * @param appendTo - where the data will be append the column
     * @constructor
     */

    RenderSales(salesArray,appendTo) {
        var availableSiteIds = [];
        Object.entries(salesArray.sales).forEach(([salesIndex, salesList]) => {
            var siteid = null;
            Object.entries(salesList.site).forEach(([siteIndex, siteList]) => {
                siteid = siteList.id;
                var productColumn = document.createElement('td');

                Object.entries(siteList.data).forEach(([salesDataIndex, salesLists]) => {
                    var productDiv = document.createElement('div');
                    productDiv.innerHTML = salesLists.volume;
                    productColumn.appendChild(productDiv);
                });

                Object.entries(appendTo).forEach(([rowIndex, rows]) => {
                    var rowsiteid = rows.dataset.siteid;
                    if(siteid == rowsiteid){
                        availableSiteIds.push(rowsiteid);
                        appendTo[rowIndex].appendChild(productColumn);
                    }

                });
            });
        });

        this.RenderNotApplciable(availableSiteIds,appendTo,"N/A");
    }

    /**
     * This will display the totalizer column
     * @param totalizerArray - data that's used to render
     * @param appendTo - where the data will be append the column
     * @constructor
     */

    RenderTotalizer(totalizerArray,appendTo) {
        var availableSiteIds = [];
        Object.entries(totalizerArray.totalizers).forEach(([totalizerInd, listTotalizer]) => {
            var siteid = null;
            Object.entries(listTotalizer.site).forEach(([totalizerIndex, totalizerData]) => {
                var dataSet = '';
                var gaugeState = totalizerData.status.nature;
                var gaugeStateCss = "";
                siteid = totalizerData.id;
                switch(gaugeState){
                    case "bad":
                        gaugeStateCss = "btn-danger";
                        break;
                    case "good":
                        gaugeStateCss = "btn-success";
                        break;
                    case "warning":
                        gaugeStateCss = "btn-warning";
                        break;
                }
                if(gaugeState ==  "none"){
                    dataSet = "Not applicable"
                }else{
                    dataSet = '<button style="width:140px" class="btn btn-sm  '+gaugeStateCss+'">'+totalizerData.status.readingdate+'</button>';
                }
                let tdLastGauge = document.createElement('td');
                tdLastGauge.innerHTML = dataSet;

                Object.entries(appendTo).forEach(([rowIndex, rows]) => {
                    var rowsiteid = rows.dataset.siteid;
                    if(siteid == rowsiteid){
                        availableSiteIds.push(rowsiteid);
                        appendTo[rowIndex].appendChild(tdLastGauge);
                    }
                });
            });
        })
        this.RenderNotApplciable(availableSiteIds,appendTo,"N/A");
        utility.ShowHideLoader(false);
    }

    /**
     * This will display the tank and volume column
     * @param tanksArray - data that's used to render tank
     * @param gaugeArray - data that's used to render volume
     * @param appendTo - wwhere the data will be append the column
     * @constructor
     */

    GetProductVolume(tanksArray,gaugeArray,appendTo){
        var availableSiteIds = [];
        Object.entries(tanksArray.tanks).forEach(([k, v]) => {
            var siteid = null;
            Object.entries(v.site).forEach(([siteIndex, siteList]) => {
                var threasholdCss = "badge-secondary";
                var volume = null;
                var newTd = document.createElement('td');
                var productDiv = document.createElement('div');
                siteid = siteList.id;
                var threasholdCss = "badge-secondary";
                var rowCnt = 0;
                Object.entries(siteList.data).forEach(([tankIndex, tankList]) => {
                    var tankid = tankList.tankid;
                    var tanklowlevel = tankList.tanklowlevel;
                    var tanksafeheight = tankList.tanksafeheight;
                    var tankheight = tankList.tankheight;
                    var volume = null;
                    Object.entries(gaugeArray.gauges).forEach(([k, listGauge]) => {
                        Object.entries(listGauge.site).forEach(([siteIndex, siteList]) => {
                            Object.entries(siteList.data).forEach(([gaugeIndex, gaugeList]) => {
                                if(siteList.id ==siteid){
                                    Object.entries(siteList.data).forEach(([gaugeIndex, gaugeList]) => {
                                       if(tankid === gaugeList.tank){
                                           volume = gaugeList.volume;
                                       }
                                    });
                                }
                            });
                        });
                    });

                    if(volume < tanklowlevel && volume!= null){
                        threasholdCss = "badge-danger";
                    }else if(volume > tanklowlevel && volume < tanksafeheight && volume!= null){
                        threasholdCss = "badge-warning";
                    }else if(volume > tanksafeheight && volume < tankheight && volume!= null){
                        threasholdCss = "badge-success";
                    }

                    var productDiv = document.createElement('div');
                    if(volume == null){
                         volume = "N/a";
                        if(rowCnt==0){
                            productDiv.innerHTML = "N/A";
                            newTd.appendChild(productDiv);
                         }
                    }else{
                        productDiv.innerHTML = tankid +'<span style="width:75px" class="pull-right badge '+threasholdCss+'">'+volume+'</span>';;
                        newTd.appendChild(productDiv);
                     }

                    Object.entries(appendTo).forEach(([rowIndex, rows]) => {
                        var rowsiteid = rows.dataset.siteid;
                        if(siteid == rowsiteid){
                            appendTo[rowIndex].appendChild(newTd);
                            availableSiteIds.push(rowsiteid);
                        }
                    });
                rowCnt++;
                });
            });
        });
        this.RenderNotApplciable(availableSiteIds,appendTo,"N/A");

    }

    /**
     * This will render the last gauge date
     * @param gaugeArray - data that's used to gauge
     * @param appendTo - where the data will be append the column
     * @constructor
     */

    RenderGauge(gaugeArray,appendTo) {
        var availableSiteIds = [];
        Object.entries(gaugeArray.gauges).forEach(([k, listGauge]) => {
            var siteid = null;
            Object.entries(listGauge.site).forEach(([gaugeIndex, gaugeData]) => {
                var dataSet = '';
                var gaugeState = gaugeData.status.nature;
                var gaugeStateCss = "";
                siteid = gaugeData.id;
                switch(gaugeState){
                    case "bad":
                        gaugeStateCss = "btn-danger";
                        break;
                    case "good":
                        gaugeStateCss = "btn-success";
                        break;
                    case "warning":
                        gaugeStateCss = "btn-warning";
                        break;
                }
                if(gaugeState ==  "none"){
                    dataSet = "Not applicable"
                }else{
                     dataSet = '<button style="width:140px" class="btn btn-sm  '+gaugeStateCss+'">'+gaugeData.status.readingdate+'</button>';
                }
                let tdLastGauge = document.createElement('td');
                tdLastGauge.innerHTML = dataSet;

                Object.entries(appendTo).forEach(([rowIndex, rows]) => {
                    var rowsiteid = rows.dataset.siteid;
                    if(siteid == rowsiteid){
                        availableSiteIds.push(rowsiteid);
                        appendTo[rowIndex].appendChild(tdLastGauge);
                    }
                });
            });
        })
        this.RenderNotApplciable(availableSiteIds,appendTo,"N/A");
    }

    /**
     * Function used add N/A if data is not available
     * @param availableSiteIds - array of the site that has been processed
     * @param appendTo - where the data will be append the column
     * @param errorMessage - custom error message
     * @constructor
     */

    RenderNotApplciable(availableSiteIds,appendTo,errorMessage){
        Object.entries(appendTo).forEach(([rowIndex, rows]) => {
            var newTd = document.createElement('td');
            var rowsiteid = rows.dataset.siteid;
            if(!availableSiteIds.includes(rowsiteid)){
                var renderDiv = document.createElement('div');
                renderDiv.innerHTML = errorMessage;
                newTd.appendChild(renderDiv);
                appendTo[rowIndex].appendChild(newTd);
            }
        });
    }

    /**
     * Function used to format the function
     * @param phone - number that needs to be formatted
     * @constructor
     */

    FormatPhone(phone) {
        phone = phone.replace(/[^\d]/g, "");
        if (phone.length == 10) {
            return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        }
        return null;
    }
}
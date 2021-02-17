$(function () {




    const siteEdit_selectedEl = document.getElementById("site_id_edit");
    const site_edit_name_Edit = document.getElementById("site_name_edit");
    const site_loc_lat_Edit = document.getElementById("site_lat_edit");
    const site_loc_long_Edit = document.getElementById("site_long_edit");
    const site_status_Edit = document.getElementById("site_status_edit");



    const addLink = document.getElementById("add_new_site");
    if (addLink){
        addLink.addEventListener("click", function (event) {
            event.preventDefault();
            const linkId = event.target.id;
            showLinkBox(linkId);
            resetAddForm();

        })

    }



    const viewAllLink = document.getElementById("view_all_sites");
    if (viewAllLink){
        getData();
        viewAllLink.addEventListener("click", function (event) {
            event.preventDefault();
            const linkId = event.target.id;
            showLinkBox(linkId);
            getData();
            if (window.site_data && window.site_data.length > 0) {
                let dataSet = window.site_data;
                let tableRows = "";
                let tableHead = `<tr>
                    <td>Site ID</td> 
                    <td>Site Name</td>
                    <td>Site Status</td>
                    <td>Site Loc. Latitude</td>
                    <td>Site Loc. Longitude</td>
                    </tr>`;
                tableRows+=tableHead;
                dataSet.forEach(function (data) {
                    const {site_id, site_name, status, loc_latitude, loc_longitude} = data;
                    let tableRow = `<tr>
                    <td>${site_id}</td> 
                    <td>${site_name}</td>
                    <td class=${status==="online"?"status_online":"status_offline"}>${status}</td>
                    <td>${loc_latitude}</td>
                    <td>${loc_longitude}</td>
                    <td><i class="far fa-edit btn-table edit" data-siteid=${site_id} ></i></td>
                    <td><i class="far fa-trash-alt delete" data-siteid=${site_id} ></i></td>
                    </tr>`;
                    tableRows+=tableRow;
                })
                const tableBody = document.getElementById("view-allSites-tbody");
                tableBody.innerHTML = tableRows;
                addListenerEdits();
                addListenerDeletes();
            }

        })

    }


    const editLink = document.getElementById("edit_site");

    if (editLink){
        editLink.addEventListener("click", function (event) {
            event.preventDefault();
            const linkId = event.target.id;
            showLinkBox(linkId);
            resetEditForm();
            addOptionSelectEdit();


        })

    }



    function showLinkBox(linkId) {
        const boxes = document.querySelectorAll(".link-box");
        for (const box of boxes) {
            if (box.classList.contains(linkId)){
                box.style.display="block"

            }else {
                box.style.display="none"

            }

        }

        const navLinks = document.querySelectorAll(".nav-list-group__item");
        for (const navLink of navLinks) {
            if (navLink.classList.contains(linkId)){
                navLink.classList.add("active-link")

            }else {
                navLink.classList.remove("active-link")

            }

        }

    }

    if (siteEdit_selectedEl){
        siteEdit_selectedEl.addEventListener("change", function (event) {
         let selEl = event.target;
         let selectedValue =selEl.options[selEl.selectedIndex].value
            populateEditForm(selectedValue)


        })
    }

    function addListenerEdits() {
        const editElements = document.querySelectorAll(".edit");
        if (editElements){

            editElements.forEach(function (editElement) {
                editElement.addEventListener("click", function (event) {
                    showLinkBox("edit_site");
                    resetEditForm();
                    addOptionSelectEdit();
                    let siteId =editElement.dataset.siteid;
                    let index = window.site_data.findIndex(data =>data.site_id ===siteId );
                    const selectEditEl = document.getElementById("site_id_edit");
                    selectEditEl.selectedIndex =++index;
                    populateEditForm(siteId)



                })

            })
        }

    }

    function addListenerDeletes() {
        const deleteElements = document.querySelectorAll(".delete");
        if (deleteElements){

            deleteElements.forEach(function (deleteElement) {
                deleteElement.addEventListener("click", function (event) {
                    let siteId =deleteElement.dataset.siteid;
                    const banner = document.getElementById("banner");
                    const messageBox = document.getElementById("message-box");
                    messageBox.dataset.siteid= siteId;
                    messageBox.innerHTML =`Are you sure you want to delete <span class="message-box-siteId">"${siteId}"</span> &nbsp;?`;
                    banner.style.display="block";


                })

            })
        }

    }

    function addOptionSelectEdit() {
        if (window.site_data && window.site_data.length >0){
            let dataSet = window.site_data;
            const selectOptions = dataSet.map(function (data) {
                return data.site_id;
            })
            let optionRows=`<option value=""></option>`
            selectOptions.forEach(function (option) {
                let optionRow =  `<option value=${option}>${option}</option>`
                optionRows+=optionRow;
            });

            const selectElement = document.getElementById("site_id_edit");
            selectElement.innerHTML=optionRows;
        }

    }

    function populateEditForm(selectedValue) {
        if (window.site_data && window.site_data.length >0){
            let dataSet = window.site_data;
            const current_site = dataSet.find(data => data.site_id ===selectedValue);
            site_edit_name_Edit.value = current_site.site_name;
            site_loc_lat_Edit.value = current_site.loc_latitude;
            site_loc_long_Edit.value = current_site.loc_longitude;
            site_status_Edit.selectedIndex=current_site.status==="online"?1:2;
        }

    }

    function resetEditForm() {
        site_edit_name_Edit.value = "";
        site_loc_lat_Edit.value = ""
        site_loc_long_Edit.value = ""
        site_status_Edit.selectedIndex=0;
        successBoxEdit.style.display="none";
        errorBoxEdit.style.display="none";
    }

    function resetAddForm() {
        document.getElementById("site_id").value ="";
        document.getElementById("site_name").value ="";
        document.getElementById("site_status").value =0;
        document.getElementById("site_lat").value ="";
        document.getElementById("site_long").value ="";
        successBoxAdd.style.display="none";
        errorBoxAdd.style.display="none";

    }

    const canDelBtn = document.getElementById("cancel-btn");
    if (canDelBtn){
        canDelBtn.addEventListener("click", function (event) {
            const banner = document.getElementById("banner");
            banner.style.display = "none";
            window.location.href ="/";

        })
    }



    const deleteBtn = document.getElementById("proceed-btn");
    const errorBoxDel = document.getElementById("error-box-delete");
    const errorMessageDel = document.querySelector("#error-box-delete small");
    const progressIndicatorDel = document.getElementById("progressIndicator-delete");

    const successBoxDel = document.getElementById("success-box-delete");

    if (deleteBtn){
        deleteBtn.addEventListener("click", function (event) {

            progressIndicatorDel.style.display="block";
            errorMessageDel.innerText ="";
            errorBoxDel.style.display="none";
            successBoxDel.style.display="none";

            const messageBox = document.getElementById("message-box");
            let site_id = messageBox.dataset.siteid;
            let postData = {site_id};
            $.post("/delete", postData)
                .done(function (data) {
                    progressIndicatorDel.style.display="none"
                    if (data.status ===0 && data.dataSet.length >0){
                        window.site_data = data.dataSet;
                        successBoxDel.style.display="block";
                    }else {
                        errorMessageDel.innerHTML =data.reason.toString();
                        errorBoxDel.style.display="block";

                    }

                }).fail(function (error) {
                progressIndicatorDel.style.display="none";
                errorMessageDel.innerHTML ="No Network. Please check internet connection and try again"
                errorBoxDel.style.display="block";
            })

        })
    }

    function getData() {
        $.get("/site_data")
            .done(function (data) {
                if (data.status ===0 && data.dataSet.length>0){
                    window.site_data=data.dataSet;
                    if (window.site_data && window.site_data.length > 0) {
                        let dataSet = window.site_data;
                        let tableRows = "";
                        let tableHead = `<tr>
                    <td>Site ID</td> 
                    <td>Site Name</td>
                    <td>Site Status</td>
                    <td>Site Loc. Latitude</td>
                    <td>Site Loc. Longitude</td>
                    </tr>`;
                        tableRows+=tableHead;
                        dataSet.forEach(function (data) {
                            const {site_id, site_name, status, loc_latitude, loc_longitude} = data;
                            let tableRow = `<tr>
                    <td>${site_id}</td> 
                    <td>${site_name}</td>
                    <td class=${status==="online"?"status_online":"status_offline"}>${status}</td>
                    <td>${loc_latitude}</td>
                    <td>${loc_longitude}</td>
                    <td><i class="far fa-edit btn-table edit" data-siteid=${site_id}></i></td>
                    <td><i class="far fa-trash-alt delete" data-siteid=${site_id}></i></td>
                    </tr>`;
                            tableRows+=tableRow;
                        })
                        const tableBody = document.getElementById("view-allSites-tbody");
                        tableBody.innerHTML = tableRows;
                        showLinkBox("view_all_sites");
                        addListenerEdits();
                        addListenerDeletes();


                    }
                }

            }).fail(function (error) {
            console.log(error)
        })


    }

    const errorBoxAdd = document.getElementById("error-box-add");
    const errorMessageAdd = document.querySelector("#error-box-add small");
    const progressIndicatorAdd = document.getElementById("progressIndicator-add");

    const successBoxAdd = document.getElementById("success-box-add");

    const addFormEl = document.getElementById("add_site_form");
    function addSiteForm(event) {
        event.preventDefault();

        progressIndicatorAdd.style.display="block";
        errorMessageAdd.innerText ="";
        errorBoxAdd.style.display="none";
        successBoxAdd.style.display="none";


        const site_id = document.getElementById("site_id").value;
        const site_name = document.getElementById("site_name").value;
        const site_status = document.getElementById("site_status").value;
        const lat = document.getElementById("site_lat").value;
        const long = document.getElementById("site_long").value;

        const postData = {site_id, site_status,site_name,lat,long};

        $.post("/add", postData)
            .done(function (data) {
                progressIndicatorAdd.style.display="none"
                if (data.status ===0 && data.dataSet.length >0){
                    window.site_data = data.dataSet;
                    successBoxAdd.style.display="block";
                }else {
                    errorMessageAdd.innerHTML =data.reason.toString();
                    errorBoxAdd.style.display="block";

                }

            }).fail(function (error) {
            progressIndicatorAdd.style.display="none";
            errorMessageAdd.innerHTML ="No Network. Please check internet connection and try again"
            errorBoxAdd.style.display="block";
        })



    }

    if (addFormEl){
        addFormEl.addEventListener("submit", addSiteForm)
    }

    const errorBoxEdit = document.getElementById("error-box-edit");
    const errorMessageEdit = document.querySelector("#error-box-edit small");
    const progressIndicatorEdit = document.getElementById("progressIndicator-edit");

    const successBoxEdit = document.getElementById("success-box-edit");
    const editFormEl = document.getElementById("edit_site_form");
    function editSiteForm(event) {
        event.preventDefault();
        progressIndicatorEdit.style.display="block";
        errorMessageEdit.innerText ="";
        errorBoxEdit.style.display="none";
        successBoxEdit.style.display="none";

        const site_id = document.getElementById("site_id_edit").value;
        const site_name = document.getElementById("site_name_edit").value;
        let site_status = document.getElementById("site_status_edit").value;

        const lat = document.getElementById("site_lat_edit").value;
        const long = document.getElementById("site_long_edit").value;

        const postData = {site_id, site_status,site_name,lat,long};

        $.post("/save", postData)
            .done(function (data) {
                progressIndicatorEdit.style.display="none"
                if (data.status ===0 && data.dataSet.length >0){
                    window.site_data = data.dataSet;
                    successBoxEdit.style.display="block";

                }else {
                    errorMessageEdit.innerHTML =data.reason.toString();
                    errorBoxEdit.style.display="block";

                }

            }).fail(function (error) {
            progressIndicatorEdit.style.display="none";
            errorMessageEdit.innerHTML ="No Network. Please check internet connection and try again"
            errorBoxEdit.style.display="block";

        })



    }



    if (editFormEl){
        editFormEl.addEventListener("submit", editSiteForm)
    }

    const timeButtons = document.querySelectorAll(".times-button");
    if (timeButtons){
        timeButtons.forEach(function (timeButton){
            timeButton.addEventListener("click", function (event) {
                const wrapper = event.target.closest("div");
                wrapper.style.display = "none";

            })
        })
    }






})

let selected_program = jQuery('#db_table_name').val();
let selected_program_th = selected_program;
let select_BORRNAME = jQuery('#BORRNAME');
let select_BORRCITY = jQuery('#BORRCITY');
let select_BORRZIP = jQuery('#BORRZIP');
let select_BANKNAME = jQuery('#BANKNAME');
let datastring = "";

/* This function makes a select autocomplete */
function make_autocomplete(select_autocompleted_param, filterMinChars = 4) {
    selected_program = jQuery('#db_table_name').val();
    select_autocompleted_param.autocomplete({
        "filterMinChars": filterMinChars,
        "maxResult": 100,
        "filter": yso_ajax_link + "/?q=#QUERY#&action=yso_snowflake_autocomplete&program=" +
            selected_program + "&input=" + select_autocompleted_param.attr('name')
    });
}

/* This function resets the filter link */
/* ########################################################
    Edit ajax link with table name on select change
######################################################## */
function reset_autocomplete(select_autocompleted_param, forzip = '') {
    selected_program = jQuery('#db_table_name').val();
    const autocompleteConfig = select_autocompleted_param.data('bs.autocomplete')?._config;

    if (autocompleteConfig) {
        autocompleteConfig.filter = `${yso_ajax_link}/?q=#QUERY#&action=yso_snowflake_autocomplete&program=${selected_program}&input=${select_autocompleted_param.attr('name')}${forzip}`;
    }
}

/* Create table rows */
function createRow(data) {
    const table_body = jQuery("#snowflake-datatable .list");
    table_body.empty();

    //Iterate over each item in the data array
    let tableRow = data.map(row => {
        return `<tr>${
            // Iterate over each column in the table head
            jQuery("#table-head th").map(function() {
                const col_name = jQuery(this).data('sort');
                return `<td>${row[col_name] || ''}</td>`;
            }).get().join('')
        }</tr>`;
    }).join('');

    table_body.append(tableRow);
}


function spinToggle(){
    jQuery("#yso-spinner").toggleClass("d-none");
    jQuery("#snowflake-datatable").toggleClass("d-none");
}

function yso_get_data_pagination(pn = "&pn=1") {
    if (typeof selected_program === 'string' && selected_program.length === 0) {
        alert('Select a program first');
        return;
    }
    spinToggle();
    var yso_state_field_name = "BORRSTATE";
    if (selected_program == "SBARRF_F")
        yso_state_field_name =  "BORRRSTATE";

    datastring = jQuery('#snowflake-filter-form').serialize() +
    "&action=yso_snowflake_data";

    if(user_current_state == '')
        user_current_state = 'CA';

    console.log(user_current_state);

    jQuery.ajax({
        method: "POST",
        url: yso_ajax_link,
        data: datastring + pn + "&" + yso_state_field_name + "=" + user_current_state,
        //data: datastring + pn,
        dataType: "json"
    }).done(function(data) {
        spinToggle();
        createRow(data["data"]);
        jQuery("#pagination").html(data["pagination"]);
        jQuery(".list-pagination-page-first").html(data["fromrow"]);
        jQuery(".list-pagination-page-last").html(data["torow"]);
        jQuery(".list-pagination-pages").html(data["last"]);
        change_table_head();
        newTableObject = document.getElementById("snowflake-datatable");
        sorttable.makeSortable(newTableObject);
        
    }).fail(function(xhr, status, error) {
        console.log('fail callback');
        console.log(error);
    });
}

// For each page number link
function yso_page_link_click(current_element) {
    var pagenum = "&pn=" + current_element.getAttribute("data-page");
    yso_get_data_pagination(pagenum);
}

// Define table headers for each program in an object
const tableHeaders = {
    SBA7A_F: `
        <th class="text-muted list-sort" data-sort="BORRNAME">Borrower Name</th>
        <th class="text-muted list-sort" data-sort="BORRSTREET">Borrower street</th>
        <th class="text-muted list-sort" data-sort="BORRCITY">Borrower city</th>
        <th class="text-muted list-sort" data-sort="BORRSTATE">Borrower state</th>
        <th class="text-muted list-sort" data-sort="BORRZIP">Borrower zip</th>
        <th class="text-muted list-sort" data-sort="BANKNAME">Bank Name</th>
        <th class="text-muted list-sort" data-sort="GROSSAPPROVAL">Gross Approval</th>
        <th class="text-muted list-sort" data-sort="APPROVALDATE">Approval Date</th>
        <th class="text-muted list-sort" data-sort="TERMINMONTHS">Term</th>
        <th class="text-muted list-sort" data-sort="NAICSCODE">NAICS Code</th>
        <th class="text-muted list-sort" data-sort="NAICSDESCRIPTION">NAICS Description</th>
        <th class="text-muted list-sort" data-sort="LOANSTATUS">Loan Status</th>
        <th class="text-muted list-sort" data-sort="JOBSSUPPORTED">Jobs Supported</th>
    `,
    SBA504_F: `
        <th class="text-muted list-sort" data-sort="BORRNAME">Borrower Name</th>
        <th class="text-muted list-sort" data-sort="BORRSTREET">Borrower street</th>
        <th class="text-muted list-sort" data-sort="BORRCITY">Borrower city</th>
        <th class="text-muted list-sort" data-sort="BORRSTATE">Borrower state</th>
        <th class="text-muted list-sort" data-sort="BORRZIP">Borrower zip</th>
        <th class="text-muted list-sort" data-sort="BANKNAME">Bank Name</th>
        <th class="text-muted list-sort" data-sort="GROSSAPPROVAL">Gross Approval</th>
        <th class="text-muted list-sort" data-sort="APPROVALDATE">Approval Date</th>
        <th class="text-muted list-sort" data-sort="TERMINMONTHS">Term</th>
        <th class="text-muted list-sort" data-sort="NAICSCODE">NAICS Code</th>
        <th class="text-muted list-sort" data-sort="NAICSDESCRIPTION">NAICS Description</th>
        <th class="text-muted list-sort" data-sort="LOANSTATUS">Loan Status</th>
        <th class="text-muted list-sort" data-sort="JOBSSUPPORTED">Jobs Supported</th>
    `,
    SBAPPP_F: `
        <th class="text-muted list-sort" data-sort="BORRNAME">Borrower Name</th>
        <th class="text-muted list-sort" data-sort="BORRADDRESS">Borrower Address</th>
        <th class="text-muted list-sort" data-sort="BORRCITY">Borrower city</th>
        <th class="text-muted list-sort" data-sort="BORRSTATE">Borrower state</th>
        <th class="text-muted list-sort" data-sort="BORRZIP">Borrower zip</th>
        <th class="text-muted list-sort" data-sort="ORIGINATINGLENDER">Bank Name</th>
        <th class="text-muted list-sort" data-sort="CURRENTAPPROVALAMOUNT">Gross Approval</th>
        <th class="text-muted list-sort" data-sort="DATEAPPROVED">Approval Date</th>
        <th class="text-muted list-sort" data-sort="TERM">Term</th>
        <th class="text-muted list-sort" data-sort="NAICSCODE">NAICS Code</th>
        <th class="text-muted list-sort" data-sort="LOANSTATUS">Loan Status</th>
        <th class="text-muted list-sort" data-sort="JOBSREPORTED">Jobs Supported</th>
        <th class="text-muted list-sort" data-sort="PAYROLL_PROCEED">Payroll Processed</th>
        <th class="text-muted list-sort" data-sort="HEALTH_CARE_PROCEED">Health Care Processed</th>
    `,
    SBARRF_F: `
        <th class="text-muted list-sort" data-sort="BORRRNAME">Borrower Name</th>
        <th class="text-muted list-sort" data-sort="BORRADDRESS">Borrower Address</th>
        <th class="text-muted list-sort" data-sort="BORRRCITY">Borrower city</th>
        <th class="text-muted list-sort" data-sort="BORRRSTATE">Borrower state</th>
        <th class="text-muted list-sort" data-sort="BORRRZIP">Borrower zip</th>
        <th class="text-muted list-sort" data-sort="GRANTAMOUNT">Gross Approval</th>
        <th class="text-muted list-sort" data-sort="APPROVALDATE">Approval Date</th>
        <th class="text-muted list-sort" data-sort="GRANT_PURPOSE_COVERED_SUPPLIER">Grant Purpose Covered</th>
        <th class="text-muted list-sort" data-sort="GRANT_PURPOSE_PAYROLL">Grant Purpose Payroll</th>
    `,
    SBA_LEADS_COMBINED: `
        <th class="text-muted list-sort" data-sort="PROGRAM">Program Name</th>
        <th class="text-muted list-sort" data-sort="BORRNAME">Borrower Name</th>
        <th class="text-muted list-sort" data-sort="BORRSTREET">Borrower street</th>
        <th class="text-muted list-sort" data-sort="BORRCITY">Borrower city</th>
        <th class="text-muted list-sort" data-sort="BORRSTATE">Borrower state</th>
        <th class="text-muted list-sort" data-sort="BORRZIP">Borrower zip</th>
        <th class="text-muted list-sort" data-sort="GROSSAPPROAL">Gross Approval</th>
    `,
};

// Function to change table head based on the selected program
function changeTableHead(selectedProgram) {
    // Get the header HTML for the selected program
    const headers = tableHeaders[selectedProgram];

    // If headers exist for the selected program, update the table head
    if (headers) {
        jQuery("#table-head").html(headers);
    } else {
        console.warn(`No headers defined for program: ${selectedProgram}`);
    }
}


function toFinalNumberFormat(controlToCheck) {
    if (typeof controlToCheck.value === 'string' && controlToCheck.value !== '') {
        jQuery("input[name='" + controlToCheck.id + "']").val(controlToCheck.value);

        var enteredNumber = '' + controlToCheck.value;
        enteredNumber = enteredNumber.replace(/[^0-9\.]+/g, ''); 
        controlToCheck.value = Number(enteredNumber).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        jQuery(controlToCheck).addClass("text-end");
    }
    else{
        jQuery(controlToCheck).removeClass("text-end");
    }
}


jQuery(document).ready(function() {
    const autoCompleteFields = [select_BORRCITY, select_BORRNAME, select_BORRZIP, select_BANKNAME];

    autoCompleteFields.forEach(field => make_autocomplete(field, field === select_BORRZIP ? 2 : 4));


    jQuery('#BORRCITY').on('pick.bs.autocomplete', function(el, item){
        let zip_str_filter = '';
            
        if (typeof jQuery('#BORRCITY').val() === 'string' && jQuery('#BORRCITY').val() !== '') {
            zip_str_filter = "&BORRCITY=" + jQuery('#BORRCITY').val();
            reset_autocomplete(select_BORRZIP, zip_str_filter);
        }
    });


    jQuery('#db_table_name').change(function() {
        reset_autocomplete(select_BORRCITY);
        reset_autocomplete(select_BORRNAME);
        reset_autocomplete(select_BORRZIP);
        reset_autocomplete(select_BANKNAME);


        change_table_head();

        jQuery(".card-header-title").text(jQuery(this).find("option:selected").text());
    });

    // Get data on load
    //yso_get_data_pagination();

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    jQuery('#snowflake-filter-form').submit(function(event) {
        event.preventDefault();
        yso_get_data_pagination();
    });

    //Reset form fields
    jQuery("#reset-form").click(function(){
        jQuery('#snowflake-filter-form').each(function(){
            jQuery(this).find(':input').val("").blur(); //<-- Should return all input elements in that specific form.
        });
        jQuery("#db_table_name").val(jQuery("#db_table_name option:first").val());
    });


    // Number validity
    // Accept numbers only on key press
    jQuery("#grossapprovalfrom").keypress(function(event){
        return event.charCode >= 48 && event.charCode <= 57;
    });

    jQuery("#grossapprovalto").keypress(function(event){
        return event.charCode >= 48 && event.charCode <= 57;
    });

    // Format number to us currency
    jQuery("#grossapprovalfrom").blur(function(){
        toFinalNumberFormat(this);
    });

    jQuery("#grossapprovalto").blur(function(){
        toFinalNumberFormat(this);
    });
});

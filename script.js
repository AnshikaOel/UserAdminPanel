// CALLING API
var size,data
flag =true// for only 1 update at a time
async function basic() 
{
  var a=await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
  if(a)
  {
    data=await a.json() 
    size=data.length
    var tab=""
    for( i=0;i<size;i++)
    {
      tab+=
        `<table border="1" >
        <tr class="user-admin-row user-admin-row-group-${Math.ceil((i+1)/10)}" id="user-admin-row-${i}">
          <td><input type="checkbox" id="checkbox-${i}" class="row-checkbox"></td>
          <td>${data[i].name}</td>
          <td>${data[i].email}</td>
          <td>${data[i].role}</td>
          <td><i class="fa fa-edit user-admin-row-edit" data-record-identifier="${i}"></i></td>
        </tr>
        <tr class="editor editor-hide user-admin-row-group-${Math.ceil((i+1)/10)}"id ="user-adminEdit-row-${i}">
            <td><input type="text" name="user-admin-name" value="${data[i].name}"/></td>
            <td><input type="email" name="user-admin-email" value="${data[i].email}"/></td>
            <td><input type="text" name="user-admin-role" value="${data[i].role}"/></td>
            <td><input type="submit" onclick="updateRecord()" value="Update Record"/></td>
        </tr>
      </table>`
    }
    document.querySelector("#apidata").innerHTML=tab

      attachListener(currentEditedRow);
      loadPagination(size);
  }else{
    console.log("Some Error occured")
  }
}

// FOR SEARCHING
function searchdata()
{
  var s=document.querySelector("#searchInput");
  var tab="";
  var count = 0;
  for(j=0;j<size;j++)
  {
    if(data[j].name.includes(s.value) || data[j].email.includes(s.value) || data[j].role.includes(s.value))
    {
        count++;
      tab+=
          `<tr class="user-admin-row user-admin-row-group-${Math.ceil((j+1)/10)}" id="user-admin-row-${j}">
          <td><input type="checkbox" id="checkbox-${i}" class="row-checkbox"></td>
          <td>${data[j].name}</td>
          <td>${data[j].email}</td>
          <td>${data[j].role}</td>
          <td><i class="fa fa-edit user-admin-row-edit" data-record-identifier="${j}"></i></td>
        </tr>`
    }
  }
  if(tab!="")
      document.querySelector("#apidata").innerHTML=tab
  else
      document.querySelector("#apidata").innerHTML="Data Not Found"

    // attachListener();
    loadPagination(count);
}

//For Deleting
function deleteSelected() {
    var selectedRows = getSelectedRows();
    Array.from(document.querySelectorAll('.user-admin-row')).filter(function (adminRow){
        return selectedRows.includes(adminRow.children[0].children[0].id);
    }).forEach(function(selectedAdminRow) {
        selectedAdminRow.remove();
    })
    getSelectedRows().forEach(function (rowId){
        document.querySelector('.user-admin-row+#'+rowId);
        document.getElementById(rowId).delete();
    });
}

function getSelectedRows() {
    var rows = document.querySelectorAll('.row-checkbox');
    return Array.from(rows).filter(function(row) {
        return row.checked;
    }).map(function(row){
        return row.id;
    });
}

function toggleSelectAll() {
  var selectAllCheckbox = document.getElementById('selectAll');
  var checkboxes = document.querySelectorAll('.user-admin-row-group-' + currentPage + ' .row-checkbox');
  checkboxes.forEach(function (checkbox) {
    checkbox.checked = selectAllCheckbox.checked;
    toggleRowStyle(checkbox);
  });
}

//  grey background for selected row
function toggleRowStyle(checkbox) {
  var row = checkbox.closest('tr');
  if (checkbox.checked) {
    row.classList.add('selected');
  } else {
    row.classList.remove('selected');
  }
}

// FOR UPDATING RECORD
var currentEditedRow = -1;
function updateRecord() {
    if(currentEditedRow === -1) {  
        alert("this is bull shit")
        return;
    }

    var name=document.getElementsByName('user-admin-name')[0].value
    var email=document.getElementsByName('user-admin-email')[0].value
    var role=document.getElementsByName('user-admin-role')[0].value
    console.log(name+email+role)

    var editedRow = document.querySelector('#user-admin-row-' + currentEditedRow);

    editedRow.children.item(1).innerHTML=name;
    editedRow.children.item(2).innerHTML=email;
    editedRow.children.item(3).innerHTML=role;
    flag=true
    hideRowEditor(currentEditedRow);
}

// Attach event listeners to individual checkboxes
function attachListener() {
    var checkboxes = document.querySelectorAll('.user-admin-row');
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('click', function (e) {
            toggleRowStyle(document.querySelector('#'+e.currentTarget.id+' .row-checkbox'));
        });
    });

document.querySelectorAll('.user-admin-row-edit').forEach(function (edit) {
        edit.addEventListener('click', function (e) {
            if(flag===true)
            {
                flag=false
                var identifier = e.currentTarget.dataset.recordIdentifier;
                showRowEditor(identifier);
                console.log(identifier)
                currentEditedRow = identifier;
            }else{
            alert("Please Edit one row at a time")
            }
        });
    });
}

// to show the edit part
function showRowEditor(x) {
    console.log("this "+Math.ceil((x+1)/10))
    
    document.querySelector(`#user-admin-row-${x}`).classList.add('editor-hide');
    document.querySelector(`#user-adminEdit-row-${x}`).classList.remove('editor-hide');
}

// to hide the edit part
function hideRowEditor(x) {
    var p=document.querySelector(`#user-adminEdit-row-${x}`).classList.add('editor-hide')
    document.querySelector(`#user-admin-row-${x}`).classList.remove('editor-hide');
}

//Pagination
var currentPage = 1;
var maxPages = 1;
function loadPagination(size) {
    console.log(size);
    maxPages = Math.ceil(size/10);
    console.log("max pages="+maxPages)
    goToPage(1);
}

function goToPrevPage() {
    if (1 <= currentPage - 1) {
        goToPage(currentPage - 1);
    }
}

function goToNextPage() {
    if (maxPages >= currentPage + 1) {
        goToPage(currentPage + 1);
    }
}

function goToLastPage() {
    goToPage(maxPages);
}

function goToPage(pageNo) {
    hideAllPages();
    currentPage = pageNo;
    document.querySelectorAll('.user-admin-row-group-' + currentPage).forEach(function (e){
        e.classList.remove('pagination-hide-row');
    });
    document.querySelector('#currentPage').innerHTML = 'Page : ' + currentPage + '/' + maxPages;
}

function hideAllPages() {
    document.querySelectorAll('.user-admin-row').forEach(function (e){
         e.classList.add('pagination-hide-row');
    });
}

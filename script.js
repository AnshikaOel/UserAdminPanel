// CALLING API
var size,data
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
        `<tr class="user-admin-row user-admin-row-group-${Math.ceil((i+1)/10)}" id="user-admin-row-${i}">
          <td><input type="checkbox" id="checkbox-${i}" class="row-checkbox"></td>
          <td>${data[i].name}</td>
          <td>${data[i].email}</td>
          <td>${data[i].role}</td>
          <td><i class="fa fa-edit user-admin-row-edit" data-record-identifier="${i}"></i></td>
        </tr>`
    }
    document.querySelector("#apidata").innerHTML=tab
      hideRowEditor();
      attachListener();
      loadPagination(size);
  }else{
    console.log("err")
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

    attachListener();
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


function toggleRowStyle(checkbox) {
  var row = checkbox.closest('tr');
  if (checkbox.checked) {
    row.classList.add('selected');
  } else {
    row.classList.remove('selected');
  }
}

var currentEditedRow = -1;
function updateRecord() {
    if(currentEditedRow === -1) {
        return;
    }

    var name = document.querySelector('input[name="user-admin-name"]').value;
    var email = document.querySelector('input[name="user-admin-email"]').value;
    var role = document.querySelector('input[name="user-admin-role"]').value;

    var editedRow = document.querySelector('#user-admin-row-' + currentEditedRow);

    editedRow.children.item(1).innerHTML=name;
    editedRow.children.item(2).innerHTML=email;
    editedRow.children.item(3).innerHTML=role;

    hideRowEditor();
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
            var identifier = e.currentTarget.dataset.recordIdentifier;
            showRowEditor();
            currentEditedRow = identifier;
        });
    });
}

function showRowEditor() {
    document.querySelector('.editor').classList.remove('editor-hide');
}

function hideRowEditor() {
    document.querySelector('.editor').classList.add('editor-hide');
}

//Pagination
var currentPage = 1;
var maxPages = 1;
function loadPagination(size) {
    console.log(size);
    maxPages = Math.ceil(size/10);
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
        e.classList.add('pagination-show-row');
        e.classList.remove('pagination-hide-row');
    });
    document.querySelector('#currentPage').innerHTML = 'Page ' + currentPage + '/' + maxPages;
}

function hideAllPages() {
    document.querySelectorAll('.user-admin-row').forEach(function (e){
        e.classList.add('pagination-hide-row');
    });
}

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
        `<tr>
          <td><input type="checkbox" id="selectAll" ></td>
          <td>${data[i].name}</td>
          <td>${data[i].email}</td>
          <td>${data[i].role}</td>
        </tr>`
    }
    document.querySelector("#apidata").innerHTML=tab
  }else{
    console.log("err")
  }
}

// FOR SEARCHING
function searchdata()
{
  var s=document.querySelector("#searchInput")
  var tab=""
  for(j=0;j<size;j++)
  {
    if(data[j].name==s.value || data[j].email==s.value || data[j].role==s.value)
    {
      tab+=
        `<tr class="selectRow">
          <td><input type="checkbox" id="selectAll" onclick="toggleSelectAll()"></td>
          <td>${data[j].name}</td>
          <td>${data[j].email}</td>
          <td>${data[j].role}</td>
        </tr>`
    }
  }
  if(tab!="")
      document.querySelector("#apidata").innerHTML=tab
  else
    documnet.querySelector("#apidata").innerHTML="data NOt found"
}

function toggleSelectAll() {
  var selectAllCheckbox = document.getElementById('selectAll');
  var checkboxes = document.querySelectorAll('.selectRow');

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

// Attach event listeners to individual checkboxes
var checkboxes = document.querySelectorAll('.selectRow');
checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener('click', function () {
    toggleRowStyle(checkbox);
  });
});

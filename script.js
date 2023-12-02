async function basic()
{
  var a=await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
  if(a)
  {
    var data=await a.json()
    var size=data.length
    var tab=""
    for( i=0;i<size;i++)
    {
      tab+=
        `<tr">
          <th><input type="checkbox" id="selectAll" onclick="toggleSelectAll()"></th>
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

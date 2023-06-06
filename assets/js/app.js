
// get
//post
// patch
//put
// delete

let cl = console.log;
const postcontainer = document.getElementById("postcontainer");
const postForm =document.getElementById("postForm")
const titleControl =document.getElementById("title")
const contentControl =document.getElementById("body")
const creatBtn =document.getElementById("creatBtn")
const updateBtn =document.getElementById("updateBtn")

const baseUrl = `https://jsonplaceholder.typicode.com`;
const postUrl = `${baseUrl}/posts`;
const userUrl = `${baseUrl}/users`

let postarray = [];


function templating(arr) {
    let result = "";
    arr.forEach((ele) => {
      result += `
      <div class="card mb-4" id='${ele.id}'>
        <div class="card-header">
          <h3> ${ele.title}</h3>
        </div>
        <div class="card-body">
          <p> ${ele.body}</p>
        </div>
        <div class="card-footer d-flex justify-content-between ">
          <button class="btn btn-success" onclick="onEditbtn(this)">Edit</button>
          <button class="btn btn-danger" onclick="onDeletebtn(this)">delete</button>
        </div>
      </div>
    `;
     
    });
   
    postcontainer.innerHTML = result;
  }
 
 const makeApiCall =(method, url, body) =>{
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.onload = function () {
          if(xhr.status === 200 ||xhr.status === 201){
          if(method === "GET"){
              postarray = JSON.parse(xhr.response);
              if(Array.isArray(postarray)){
                  // cl(xhr.response);
                  templating(postarray);

              }else{
                  cl(postarray)
                  titleControl.value =postarray.title;
                contentControl.value =postarray.body;
              }      
          }else if(method === "POST"){
              cl(xhr.response)
              cl(body)
              let obj ={
                  ...JSON.parse(body),
                  ...JSON.parse(xhr.response)
              }
              cl(obj)
              postarray.push(obj) 
              templating(postarray)
          }else if(method === "PATCH"){
              cl(JSON.parse(xhr.response))
              cl(body)
              let res = JSON.parse(xhr.response)
              let id = res.id;

              let card =[...document.getElementById(id).children]
              cl(card)
              card[0].innerHTML = ` <h3>${JSON.parse(body).title}</h3>`
              card[1].innerHTML =`<p>${JSON.parse(body).body}</p>`
          }else if(method === "DELETE"){
              let deleteID = localStorage.getItem("deleteID")
              localStorage.removeItem("deleteID")
              document.getElementById(deleteID).remove()
          } 
          else{
              alert('something went wrong while fetching data')
          }
          }
          }; 
          xhr.send(body);
          }  
 
makeApiCall("GET", `${postUrl}`);

const onpostHandler =(eve)=>{
    eve.preventDefault();
    let obj ={
        title :titleControl.value,
        body : contentControl.value.trim(),
        userId :Math.ceil(Math.random()* 10)
    }
    makeApiCall("POST", postUrl, JSON.stringify(obj) )
  eve.target.reset();
}

const onEditbtn =(eve)=>{
  cl('clicked!!')
      let editId = eve.closest(".card").id;
      localStorage.setItem("editId", editId)
      let editUrl = `${baseUrl}/posts/${editId}`;
      updateBtn.classList.remove("d-none")
      creatBtn.classList.add("d-none")
      makeApiCall("GET", editUrl)


}

const onDeletebtn =(ele)=>{
    let deleteID = ele.closest(".card").id;
    localStorage.setItem("deleteID", deleteID);
    let deletURL =`${baseUrl}/posts/${deleteID}`
    makeApiCall("DELETE", deletURL)
    postForm.reset();
}

const onUpdatebtn =(eve)=>{
 let upadteId =localStorage.getItem("editId")
 let updatedUrl = `${baseUrl}/posts/${upadteId}`;

 let updatepost ={
     title : titleControl.value,
     body : contentControl.value
 }
 makeApiCall("PATCH", updatedUrl, JSON.stringify(updatepost))
 postForm.reset()
 updateBtn.classList.add("d-none")
 creatBtn.classList.remove("d-none")
}

postForm.addEventListener("submit", onpostHandler)
updateBtn.addEventListener("click", onUpdatebtn)

 
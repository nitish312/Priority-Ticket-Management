let filtercodes = {
    "Pink":"#ff4d4d",
    "Green":"#fffa65",
    "Blue":"#7d5fff",
    "Black":"#32ff7e"
}
let PriorityFilter = "Pink";
let allfilters = document.querySelectorAll(".ticket-filter div");
let ticketcontainer = document.querySelector(".ticket-container");
let ticketboxBtn = document.querySelector(".open-modal");
let closemodalBtn = document.querySelector(".close-modal")
function loadTickets(){
    if(localStorage.getItem("allTickets")){
        ticketcontainer.innerHTML ="";
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        for(let i=0;i<allTickets.length;i++){
            let {ticketId, ticketFilter, ticketContent} = allTickets[i];
            let ticketdiv = document.createElement("div");
            ticketdiv.classList.add("ticket");
            ticketdiv.innerHTML = `<div class="tickets-filter ${ticketFilter}"></div>
            <div class ="ticket-header">
            <div class ="ticket-id">#${ticketId}</div>
            <div class ="ticket-delete">
            <i class="fas fa-trash" id =${ticketId}></i>
            </div>
            </div>
            <div class="ticket-content">${ticketContent}</div>`;

            ticketdiv.querySelector(".ticket-delete i").addEventListener("click", deleteTicket);
            ticketcontainer.append(ticketdiv);
        }
    }
}
loadTickets();
closemodalBtn.addEventListener("click",closeModal);
function closeModal(e){
    if(document.querySelector(".ticket-box")){
        document.querySelector(".ticket-box").remove("ticket-box");
    }
    else
    alert("Modal Not Open");
    return;
}
ticketboxBtn.addEventListener("click",openticket);
function openticket(e){
    let modal = document.querySelector(".ticket-box");
    if(modal){
       alert("Submit Previous First");
    }
    let modalDiv = document.createElement("div");
    modalDiv.classList.add("ticket-box");
    modalDiv.innerHTML = `<div class="input-side" contenteditable="true" data-typed ="false">Enter Your Task Here !!!<br><br>Press Enter to Add Task</div>
    <div class="filter-side-options">
        <div class="filter-side Pink active-filter"></div>
        <div class="filter-side Green"></div>
        <div class="filter-side Blue"></div>
        <div class="filter-side Black"></div>
    </div>`;
    modalDiv.querySelector(".input-side").addEventListener("click",clearTextBox);
    modalDiv.querySelector(".input-side").addEventListener("keypress",addTicket);
    let allModalFilter = modalDiv.querySelectorAll(".filter-side");
    for(let i=0;i<allModalFilter.length;i++){
        allModalFilter[i].addEventListener("click", SelectModalFilter);
    }
    ticketcontainer.append(modalDiv);
}
function SelectModalFilter(e){
    let selectedModalFilter = e.target.classList[1];
    if(selectedModalFilter == PriorityFilter){
        return;
    }
    PriorityFilter = selectedModalFilter;
    document.querySelector(".filter-side.active-filter").classList.remove("active-filter");
    e.target.classList.add("active-filter");
}
function addTicket(e){
    if(e.key=="Enter"){
        let ticketId = uid();
        let modalText = e.target.textContent;
        let ticketdiv = document.createElement("div");
        ticketdiv.classList.add("ticket");
        ticketdiv.innerHTML = `<div class="tickets-filter ${PriorityFilter}"></div>
        <div class ="ticket-header">
        <div class ="ticket-id">#${ticketId}</div>
        <div class ="ticket-delete">
        <i class="fas fa-trash" id =${ticketId}></i>
        </div>
        </div>
        <div class="ticket-content">${modalText}</div>`;

        ticketdiv.querySelector(".ticket-delete").addEventListener("click", deleteTicket);
        ticketcontainer.append(ticketdiv);
        e.target.parentNode.remove();
        if(!localStorage.getItem('allTickets')){
            let allTickets =[];
            let ticketObject ={};
            ticketObject.ticketId = ticketId;
            ticketObject.ticketFilter = PriorityFilter;
            ticketObject.ticketContent = modalText;
            allTickets.push(ticketObject);
            localStorage.setItem("allTickets", JSON.stringify(allTickets));
        }
        else{
            let allTickets =JSON.parse(localStorage.getItem("allTickets"));
            let ticketObject ={};
            ticketObject.ticketId = ticketId;
            ticketObject.ticketFilter = PriorityFilter;
            ticketObject.ticketContent = modalText;
            allTickets.push(ticketObject);
            localStorage.setItem("allTickets", JSON.stringify(allTickets));
        }
        PriorityFilter ="Pink";
    }
}
function clearTextBox(e){
   if(e.target.getAttribute("data-typed")=="true"){
    return;
   }
   e.target.innerHTML = "";
   e.target.setAttribute("data-typed","true");
}
for(i=0;i<allfilters.length;i++){
    allfilters[i].addEventListener("click", chooseFilter);
}
function chooseFilter(e){
    if(e.target.classList.contains("active-filter")){
        e.target.classList.remove("active-filter");
        loadTickets();
        return;
    }
    if(document.querySelector(".filter.active-filter")){
        document.querySelector(".filter.active-filter").classList.remove("active-filter");
    }
    e.target.classList.add("active-filter");
    let ticketFilter = e.target.classList[1];
    //console.log(ticketFilter)
    openSelectedFilter(ticketFilter);
}
function openSelectedFilter(ticketFilter){
    if(localStorage.getItem("allTickets")){
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        let filteredTickets = allTickets.filter(function(filterObject){
            return filterObject.ticketFilter == ticketFilter;
        });
        ticketcontainer.innerHTML ="";
        for(let i=0;i<filteredTickets.length;i++){
            let {ticketId, ticketFilter, ticketContent} = filteredTickets[i];
            let ticketdiv = document.createElement("div");
            ticketdiv.classList.add("ticket");
            ticketdiv.innerHTML = `<div class="tickets-filter ${ticketFilter}"></div>
            <div class ="ticket-header">
            <div class ="ticket-id">#${ticketId}</div>
            <div class ="ticket-delete">
            <i class="fas fa-trash" id =${ticketId}></i>
            </div>
            </div>
            <div class="ticket-content">${ticketContent}</div>`;

            ticketdiv.querySelector(".ticket-delete").addEventListener("click", deleteTicket);
            ticketcontainer.append(ticketdiv);
        }
    }
}
function deleteTicket(e){
    confirm("Delete Ticket permanently");
    let ticketToBeDeleted = e.target.id;
    let allTickets = JSON.parse(localStorage.getItem("allTickets"));
    let filteredTickets = allTickets.filter(function(ticketObject){
      return ticketObject.ticketId != ticketToBeDeleted;
    })
    localStorage.setItem("allTickets" , JSON.stringify(filteredTickets));
    loadTickets();
}
function searchtickets(){
    let input = document.getElementsByClassName(".Search-bar").value;
    input = input.toLowerCase();
    let x = document.getElementsByClassName(".ticket-id");
    for(let i=0;i<x.length;i++){
        if(!x[i].innerHTML.toLowerCase().includes(input)){
            x[i].style.display="none";
        }
        else{
            x[i].style.display="ticket";
        }
    }
}
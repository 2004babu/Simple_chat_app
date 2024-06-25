const socket = io();
// console.log(socket);
const total_clients = document.getElementById("total-clients");
const message_input = document.getElementById("input_field");
const message_container = document.getElementById("message_container");
const message_Form = document.getElementById("message_Form");
const name_user = document.getElementById("user_name");

const message_tone=new Audio('./public_message-tone.mp3')
socket.on("clients-total", (data) => {
  message_input.focus({preventScroll:true})
  if (data) {
    total_clients.innerText = `Total-Clients -${data}`;
  }
});

message_input.form.addEventListener("submit", (e) => {
  e.preventDefault();
 
  sendMessage();
});

function sendMessage() {
  if (message_input.value === "") {
    return;
  }
  const data = {
    name: name_user.value,
    Date: new Date().toLocaleString(),
    message: message_input.value,
  };
  socket.emit("message", data);
  message_input.value = "";
  addChat(true, data);
  scrollToBottom();
}

socket.on("chat-message", (data) => {
  addChat(false, data);
  message_tone.play()
  scrollToBottom();
});

function addChat(isOwnMessage, data) {
    removeOldFeedBack()
  message_container.innerHTML += ` 
  <div class="  d-flex justify-content-${
    isOwnMessage ? "end" : "start"
  }  row  p-1 mt-1 ">
  <div class="col-7 p-3 row rounded-4 m${isOwnMessage?'e':'s'}-2 text-bg-${isOwnMessage ? "success" : "primary"}">
  <p class="mb-0" style="font-size: Bold;">${data.message}</p>
   
  <span class="mt-1" style="font-size: xx-small;">${data.name} : ${data.Date}</span>
   </div>
</div>`;
}

function scrollToBottom() {
  message_container.scrollTo(0, message_container.scrollHeight);
}

message_input.addEventListener("focus", (e) => {
  let feedback = `${name_user.value} is typing .....`;
  socket.emit("feedBack", feedback);
});
message_input.addEventListener("keypress", (e) => {
  let feedback = `${name_user.value} is typing .....`;
  socket.emit("feedBack", feedback);
});
message_input.addEventListener("blur", (e) => {
  let feedback = `${name_user.value} is typing .....`;
  socket.emit("feedBack",feedback= '');
});


socket.on('feedBack',(data)=>{
    addFeedBack(data)
})

function addFeedBack(data){
    removeOldFeedBack()
    const element=`<div id="feedBack" class=" rounded-3 d-flex text-center  row  p-1 mt-1">
                      <p class="mb-0" style="font-size: small;">${data}</p>
                    </div>`;
message_container.innerHTML+=element
}

function removeOldFeedBack() {
    const feedBack=document.querySelectorAll('#feedBack')
    feedBack.forEach(element=>{
        element.parentNode.removeChild(element)
    })
    
}



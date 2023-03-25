const chatContainer = document.getElementById("chat_container");
const sendButton = document.getElementById("send_button");
const messageInput = document.getElementById("message_input");

let userMessages = [];
let assistantMessages = [];

function appendMessage(messageText, sender) {
  const messageElem = document.createElement("div");
  messageElem.classList.add("message");
  if (sender === "bot") {
    messageElem.innerHTML = `<p>${messageText}</p>`;
  } else {
    messageElem.innerHTML = `<p style="background-color: #d5f5e3;">${messageText}</p>`;
  }
  chatContainer.appendChild(messageElem);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendButton.addEventListener("click", async function () {
  const message = messageInput.value;
  if (message === "") return;

  appendMessage(message, "user");

  // userMessages 메세지 추가
  userMessages.push(message);
  messageInput.value = "";

  try {
    const response = await fetch("http://localhost:3000/fortuneTell", {
      method: "POST", // 또는 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userMessages: userMessages,
        assistantMessages: assistantMessages,
      }), // replace with your desired data
    });

    const data = await response.json();

    appendMessage(data.assistant, "bot");

    // assistantMessages 메세지 추가
    assistantMessages.push(data.assistant);
  } catch (error) {
    console.error(error);
  }
});
messageInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendButton.click();
  }
});

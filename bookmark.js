function init() {
  const mainContainer = document.createElement('div');
  mainContainer.className ='main-container';
  mainContainer.id = 'main-container';
  document.body.appendChild(mainContainer);

  const settingsPage = document.createElement('div');
  settingsPage.className = 'settings-page';
  mainContainer.appendChild(settingsPage);

  const settingsContainer = document.createElement('div');
  settingsContainer.className = 'settings-container';
  settingsPage.appendChild(settingsContainer);

const apiKey = document.createElement('input');
  apiKey.type = 'text';
  apiKey.className = 'api-key';
  apiKey.placeholder = 'API KEY HERE';
  settingsContainer.appendChild(apiKey);

const Prompt = document.createElement('input');
  Prompt.type = "text";
  Prompt.className = 'prompt';
  Prompt.placeholder = 'Type your prompt here...';
  settingsContainer.appendChild(Prompt);

  const close = document.createElement('button');
  close.className = 'close-button';
  close.textContent = "close";
  settingsContainer.appendChild(close);

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'buttons-container';
  mainContainer.appendChild(buttonContainer);
  
  
const chatContainer = document.createElement('div');
  chatContainer.className = 'chat-container';
  mainContainer.appendChild(chatContainer);



const menuContainer = document.createElement('div');
  menuContainer.className ='me-container';
  mainContainer.appendChild(menuContainer);

  const menuContainerButtons = document.createElement('div');
  menuContainerButtons.className ='menu-container-buttons';
  menuContainer.appendChild(menuContainerButtons);


  const settingsButton = document.createElement('button');
  settingsButton.className ='settings';
settingsButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="40px" width="40px" version="1.1" id="Capa_1" viewBox="0 0 489.802 489.802" xml:space="preserve">
<g>
	<path d="M20.701,281.901l32.1,0.2c4.8,24.7,14.3,48.7,28.7,70.5l-22.8,22.6c-8.2,8.1-8.2,21.2-0.2,29.4l24.6,24.9   c8.1,8.2,21.2,8.2,29.4,0.2l22.8-22.6c21.6,14.6,45.5,24.5,70.2,29.5l-0.2,32.1c-0.1,11.5,9.2,20.8,20.7,20.9l35,0.2   c11.5,0.1,20.8-9.2,20.9-20.7l0.2-32.1c24.7-4.8,48.7-14.3,70.5-28.7l22.6,22.8c8.1,8.2,21.2,8.2,29.4,0.2l24.9-24.6   c8.2-8.1,8.2-21.2,0.2-29.4l-22.6-22.8c14.6-21.6,24.5-45.5,29.5-70.2l32.1,0.2c11.5,0.1,20.8-9.2,20.9-20.7l0.2-35   c0.1-11.5-9.2-20.8-20.7-20.9l-32.1-0.2c-4.8-24.7-14.3-48.7-28.7-70.5l22.8-22.6c8.2-8.1,8.2-21.2,0.2-29.4l-24.6-24.9   c-8.1-8.2-21.2-8.2-29.4-0.2l-22.8,22.6c-21.6-14.6-45.5-24.5-70.2-29.5l0.2-32.1c0.1-11.5-9.2-20.8-20.7-20.9l-35-0.2   c-11.5-0.1-20.8,9.2-20.9,20.7l-0.3,32.1c-24.8,4.8-48.8,14.3-70.5,28.7l-22.6-22.8c-8.1-8.2-21.2-8.2-29.4-0.2l-24.8,24.6   c-8.2,8.1-8.2,21.2-0.2,29.4l22.6,22.8c-14.6,21.6-24.5,45.5-29.5,70.2l-32.1-0.2c-11.5-0.1-20.8,9.2-20.9,20.7l-0.2,35   C-0.099,272.401,9.201,281.801,20.701,281.901z M179.301,178.601c36.6-36.2,95.5-35.9,131.7,0.7s35.9,95.5-0.7,131.7   s-95.5,35.9-131.7-0.7S142.701,214.801,179.301,178.601z"/>
</g>
</svg>`;
  menuContainerButtons.appendChild(settingsButton);

  const ChatInput = document.createElement('input');
  ChatInput.type = "text";
  ChatInput.className = "chat-input";
  ChatInput.placeholder = "Type here...";
  menuContainerButtons.appendChild(ChatInput);



  


  





const stylesheet = document.createElement('style');
  document.head.appendChild(stylesheet);

  



  const marcopolo = document.createElement("script");
  marcopolo.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
  document.head.appendChild(marcopolo);
 
settingsButton.onclick = () => {
  settingsPage.style.visibility = "visible";
}

close.onclick = () => {
  settingsPage.style.visibility = "hidden";
}




  stylesheet.innerHTML = `
 
.main-container {
    background-color: #3d425c;
     right:0;
     bottom: 0;
    height: 410px;
    min-height: 200px;
    width: 300px;
    position: fixed; /* Or absolute, depending on your needs */
    overflow-y: auto;
    resize: both;
    border-radius: 5%;
    min-width: 300px;
    max-width: 1000px;
    border: 1px solid #ccc; /* Add a border for better visibility */
    z-index: 1000;
}

.buttons-container {
   background-color: rgb(78, 78, 78);
    width: 100%; 
    height: 40px;
    position: absolute;
    justify-content: center;
    display: flex;
    padding: 5px; 
    box-sizing: border-box; 
}



.chat-container {
    background-color:#3d425c;
    height: calc(100% - 70px); 
    width: 100%; 
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box; 
    padding: 10px;
    margin-top: 25px;
}


.botMessage  {
    color: rgb(255, 255, 255);
    font-family: 13px "monospace"; 
    font-weight: 600;
    background-color: rgb(32, 32, 32);
    border-radius: 10px;
    overflow-wrap: break-word; 
    margin-top: 10px;
    padding: 10px;

    }


.userMessage {
    color: rgb(255, 255, 255);
    font-weight: 600;
    background-color: rgb(32, 32, 32);
    border-radius: 10px;
    margin-top: 10px;
    padding: 10px;

}
.me-container {
    height: 20px;
    background-color: #3d425c;
    box-sizing: border-box; 
    padding: 5px;
    border-radius: 10px;
    display: flex;          
    flex-direction: row;
    justify-content: center;
    align-items: center;  
    
}
.menu-container-buttons{
    background-color: gray;
    position: relative;
    display:flex;
    justify-content:center;
    align-items: center;
    gap: 5px;
    padding: 5px;
    border-radius: 50px;
    border: 4px solid tan;

}

.me-container input[type="text"] {
    height: 100%;
    outline: none;
    padding: 5px;
    border: 1px tan solid;
    background-color: #242424;
    color: rgb(255, 255, 255);
    border-radius: 10px;
}








.settings{
background-position: center;
background-repeat: no-repeat;
background-size: contain;
    position: relative;
    display: flex;
    width: 40px;
    border-color: transparent;
    background-color: transparent;
}

.settings:hover {
    background-color: #ccc;
}
.settings-page{
    position: absolute;
    background-color: rgb(46, 46, 46);
width: 100%;
height: 60%;
visibility:hidden;

}


.settings-content {
    color: white;
    font-size: 25px;
    padding-top: 50px;
    padding-left: 20px;
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.settings-container {
    
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
    margin: 60px;
    
}



.custom-file-upload {
   
background-position: center;
background-repeat: no-repeat;
background-size: contain;
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 10px;
    width: 30px;
    height: 30px;

    border-color: transparent;
    background-color: transparent;
}

.custom-file-upload:hover {
    background-color: #ddd; 
}

.custom-file-upload input[type="file"] {  
    display: none;
}


p code {
    background-color: rgb(78, 78, 78);
display: inline-block;
color: rgb(228, 228, 228);
padding: 10px;
font-family: 'Times New Roman', Times, serif;

}


.hidden {
    display: none;
}
  






    
}

  `;

 

  function makeDraggable(element, handle) {
    let isDragging = false;
    let offsetX, offsetY;
  
    function handlePointerDown(e) {
      e.preventDefault(); // Prevent default touch behavior (scrolling)
      isDragging = true;
  
      const isTouch = e.type === "touchstart";
      const event = isTouch ? e.touches[0] : e; // Use touches for touch events
  
      offsetX = event.clientX - element.offsetLeft;
      offsetY = event.clientY - element.offsetTop;
  
      document.addEventListener("mousemove", handlePointerMove);
      document.addEventListener("touchmove", handlePointerMove);
      document.addEventListener("mouseup", handlePointerUp);
      document.addEventListener("touchend", handlePointerUp);
      document.addEventListener("mouseleave", handlePointerUp); // Important!
    }
  
    function handlePointerMove(e) {
      if (!isDragging) return;
  
      const isTouch = e.type === "touchmove";
      const event = isTouch ? e.touches[0] : e;
  
      const x = event.clientX - offsetX;
      const y = event.clientY - offsetY;
  
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    }
  
    function handlePointerUp() {
      isDragging = false;
      document.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("touchmove", handlePointerMove);
      document.removeEventListener("mouseup", handlePointerUp);
      document.removeEventListener("touchend", handlePointerUp);
      document.removeEventListener("mouseleave", handlePointerUp);
    }
  
    // Attach listeners to the specified handle element
    handle.addEventListener("mousedown", handlePointerDown);
    handle.addEventListener("touchstart", handlePointerDown);
  
      element.style.position = 'fixed'; // Important: Must be positioned!
      element.style.cursor = 'grab'; // Initial cursor style
      handle.style.cursor = 'grab'; // Initial cursor style for handle
  
  }
  
  
  
  // Example usage (assuming you have elements with these IDs):
  const mainContainers = document.getElementById("main-container");
  const buttonContainers = document.getElementById("button-container"); // Your "handle"
  
  if (mainContainer && buttonContainer) {
    makeDraggable(mainContainer, buttonContainer);
  }
  
  
  // For multiple elements with classes:
  const containers = document.querySelectorAll('.main-container');
  const handles = document.querySelectorAll('.button-container'); // Or a different class for handles
  
  containers.forEach((container, index) => {
      if (handles[index]) { // Ensure a handle exists for each container
          makeDraggable(container, handles[index]);
      } else {
          console.warn("No handle found for container", container);
      }
  });

  const hide = document.getElementById("main-container");
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "e") {
      if (document.activeElement !== ChatInput) {
        mainContainer.classList.toggle("hidden");
      }
    }

    ChatInput.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        const userInput = ChatInput.value.trim(); // Store and trim user input

        if (userInput !== "") {
          ChatInput.value = ""; // Clear input immediately

          const userMessage = document.createElement("p");
          userMessage.className = "userMessage";
          userMessage.textContent = "You: " + userInput;
          chatContainer.appendChild(userMessage);
          chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll immediately after adding user message

          const botMessage = document.createElement("p"); // Create bot message element *before* the API call
          botMessage.className = "botMessage";
          botMessage.textContent = "Bot: Thinking..."; // Indicate that the bot is processing
          chatContainer.appendChild(botMessage);
          chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll after adding placeholder
          fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: Prompt.value }]
                },

                contents: [
                  {
                    parts: [{ text: userInput }]
                  }
                ]
              })
            }
          )
            .then((response) => response.json())
            .then((data) => {
              chatContainer.removeChild(botMessage);
              if (
                data.candidates &&
                data.candidates.length > 0 &&
                data.candidates[0].content
              ) {
                const botResponse = data.candidates[0].content.parts[0].text
                  .toString()
                  .trim();
                const botMessage = document.createElement("p");
                botMessage.className = "botMessage";
                const parsedResponse = marked.parse(botResponse);

               
                {
                  botMessage.innerHTML = "Bot: " + parsedResponse;
                  console.log("not found");
                }

                chatContainer.appendChild(botMessage);
                ChatInput.value = ""; // Clear input
                chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
              } else {
                // Handle cases where the API doesn't return a valid response
                alert(console.error("Invalid API response:", data));

                const errorMessage = document.createElement("p");
                errorMessage.className = "botMessage error";
                errorMessage.textContent = "Error: Could not get a response.";
                chatContainer.appendChild(errorMessage);
                ChatInput.value = "";
                chatContainer.scrollTop = chatContainer.scrollHeight;
              }
            })
            .catch((error) => {
              console.error("API request failed:", error);
              const errorMessage = document.createElement("p");
              errorMessage.className = "botMessage error";
              errorMessage.textContent = "Error: API request failed.";
              chatContainer.appendChild(errorMessage);
              ChatInput.value = "";
              chatContainer.scrollTop = chatContainer.scrollHeight;
            });
        }
      }
    });

    apiKey.onchange = () => {
      alert("updated key");
localStorage.setItem("what", apiKey.value)
      if (localStorage.getItem("what")) {
        // Key already exists, update it
        localStorage.setItem("what", apiKey.value);
        console.log("API key updated in localStorage.");
      } else {
        // Key doesn't exist, create it
        localStorage.setItem("what", apiKey.value);
        console.log("API key created in localStorage.");
      }
    };

    Prompt.onchange = () => {
      alert("updated prompt");
    };
  });
}

init();

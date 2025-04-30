
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

  element.style.position = "fixed"; // Important: Must be positioned!
  element.style.cursor = "grab"; // Initial cursor style
  handle.style.cursor = "grab"; // Initial cursor style for handle
}

function sendMessage(user, text) {
  const main = document.getElementById("main-container");
  if (!main || !main.shadowRoot) {
    console.log("main or shadow root not found");
    return;
  }
  const chat = main.shadowRoot.getElementById("chat-container");

  // Check if the element exists before attempting to append a child.
  if (chat) {
    const message = document.createElement("p");
    message.className = "userMessage";
    message.innerHTML = user + ":  " + text;
    chat.appendChild(message);
  } else {
    console.error("Element with id 'chat-container' not found in shadow root.");
  }
}

function sendMessagepro() {
  const main = document.getElementById("main-container");
  if (!main || !main.shadowRoot) {
    console.log("main or shadow root not found");
    return;
  }
  const chat = main.shadowRoot.getElementById("chat-container");

  // Check if the element exists before attempting to append a child.
  if (chat) {
    const message = document.createElement("p");
    message.className = "userMessage";
    message.innerHTML = "Bot" + ":  " + "Is Thinking...";
    chat.appendChild(message);
    return message;
  } else {
    console.error("Element with id 'chat-container' not found in shadow root.");
  }
}

function removeBotThinking(thinkingElement) {
  if (thinkingElement && thinkingElement.parentNode) {
    thinkingElement.remove();
  }
}

function readfile(file){
  const reader = new FileReader()
  reader.onload = () => {
    const text = reader.result
 console.log(text);
 const blob = new Blob [{text} , {type: file.type}]
    // readAsDataURL is called here because text has now been defined

  }
reader.readAsDataURL(file);
return
}

async function getmodels() {
  const main = document.getElementById("main-container");
if(main || main.shadowRoot){
  const modelos = main.shadowRoot.getElementById("model");
  console.log("found main or shadow root")
  if(modelos){

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + localStorage.getItem("what"));
    if (response.ok) {
      console.log(response.date)
        const data = await response.json();
        if (data && data.models) {
            const models = data.models;
            const modelList = models.map(model => {
                return {
                    name: model.name, // Access 'name' directly from the 'model' object
                    temperature: model.generation_config ? model.generation_config.temperature : null, // Handle cases where generation_config might be missing
                    outputTokenLimit: model.generation_config ? model.generation_config.output_token_limit : null // Handle potential missing property
                };
            });
            localStorage.setItem("models", JSON.stringify(modelList)); // Store the extracted model information
    
            if (modelos) {
                models.forEach(element => {
                    const option = document.createElement("option");
                    option.value = element.name;
                    option.textContent = element.name.split("models/")[1];
                    modelos.appendChild(option);
                });
            } else {
                console.log("Error: 'model' select element not found.");
            }
        } else {
            console.log("No models found in the response data.");
        }
    } else {
        console.log("Failed to fetch models:", response.status);
    }


console.log("found getting models")
  }else {
    console.log("model not found")
  }
}else {

  console.log("main or shadow not found")
}


}

async function init() {
  const mainContainer = document.createElement("div");
  mainContainer.className = "main-container";
  mainContainer.id = "main-container";
  document.body.appendChild(mainContainer);

  // Attach Shadow DOM
  const shadowRoot = mainContainer.attachShadow({ mode: "open" });

  const settingsPage = document.createElement("div");
  settingsPage.className = "settings-page";
  shadowRoot.appendChild(settingsPage); // Append to shadowRoot

  const settingsContainer = document.createElement("div");
  settingsContainer.className = "settings-container";
  settingsPage.appendChild(settingsContainer);

  const apiKey = document.createElement("input");
  apiKey.type = "text";
  apiKey.className = "api-key";
  apiKey.placeholder = "API KEY HERE";
  settingsContainer.appendChild(apiKey);

  const Prompt = document.createElement("input");
  Prompt.type = "text";
  Prompt.className = "prompt";
  Prompt.placeholder = "Type your prompt here...";
  settingsContainer.appendChild(Prompt);

  const model = document.createElement("select");
  model.id = "model";
  settingsContainer.appendChild(model);

  const test = document.createElement("option");
  test.innerHTML = "gemini-2.0-flash";
  model.appendChild(test);

  const config = document.createElement("div");
  config.className = "config";
  settingsContainer.appendChild(config);

  const tempdiv = document.createElement("div");
  tempdiv.id = "rangeslides";
  settingsContainer.appendChild(tempdiv);

  const temptext = document.createElement("h3");
  temptext.id = "opttext";
  temptext.innerHTML = "Temperature";
  tempdiv.appendChild(temptext);

  const temprange = document.createElement("input");
  temprange.className = "temprange";
  temprange.type = "range";
  temprange.min = "0";
  temprange.max = "2";
  temprange.step = "0.05";
  tempdiv.appendChild(temprange);

  const temperaturenum = document.createElement("input");
  temperaturenum.id = "nums";
  temperaturenum.type = "number";
  tempdiv.appendChild(temperaturenum);

  const outdiv = document.createElement("div");
  outdiv.id = "rangeslides";
  settingsContainer.appendChild(outdiv);

  const outtext = document.createElement("h3");
  outtext.id = "opttext";
  outtext.innerHTML = "Output Length";
  outdiv.appendChild(outtext);

  const outputlengthdiv = document.createElement("input");
  outputlengthdiv.id = "nums";
  outputlengthdiv.type = "number";
  outputlengthdiv.value = "65536";
  outputlengthdiv.placeholder = "OUTPUT LENGTH";
  outdiv.appendChild(outputlengthdiv);

  const ks = document.createElement("div");
  ks.id = "rangeslides";
  settingsContainer.appendChild(ks);

  const topktext = document.createElement("h3");
  topktext.id = "opttext";
  topktext.innerHTML = "Top K";
  ks.appendChild(topktext);

  const topk = document.createElement("input");
  topk.type = "range";
  topk.value = "0.95";
  topk.min = "0";
  topk.max = "1";
  topk.step = "0.05";
  ks.appendChild(topk);

  const topknum = document.createElement("input");
  topknum.id = "nums";
  topknum.type = "number";
  ks.appendChild(topknum);

  const close = document.createElement("button");
  close.className = "close-button";
  close.textContent = "close";
  settingsContainer.appendChild(close);

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "buttons-container";
  shadowRoot.appendChild(buttonContainer); // Append to shadowRoot

  makeDraggable(mainContainer, buttonContainer);

  const chatContainer = document.createElement("div");
  chatContainer.className = "chat-container";
  chatContainer.id = "chat-container";

  shadowRoot.appendChild(chatContainer); // Append to shadowRoot

  const menuContainer = document.createElement("div");
  menuContainer.className = "me-container";
  shadowRoot.appendChild(menuContainer); // Append to shadowRoot

  const menuContainerButtons = document.createElement("div");
  menuContainerButtons.className = "menu-container-buttons";
  menuContainer.appendChild(menuContainerButtons);

  const filelabel = document.createElement("label");
  filelabel.className = "filess-label"
  filelabel.innerHTML = "📁"
 menuContainerButtons.appendChild(filelabel)

 const fileButton = document.createElement("input");
 fileButton.type = "file"
 fileButton.className = "filess"
filelabel.appendChild(fileButton)


  const settingsButton = document.createElement("button"); 
  settingsButton.className = "settings";
  settingsButton.innerHTML= "⚙️";
  menuContainerButtons.appendChild(settingsButton);




  const ChatInput = document.createElement("input");
  ChatInput.type = "text";
  ChatInput.className = "chat-input";
  ChatInput.placeholder = "Type here...";
  menuContainerButtons.appendChild(ChatInput);

  const stylesheet = document.createElement("style");
  shadowRoot.appendChild(stylesheet); // Append to shadowRoot

  const marcopolo = document.createElement("script");
  marcopolo.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
  document.head.appendChild(marcopolo);

  settingsButton.onclick = () => {
    settingsPage.style.visibility = "visible";
  };

  close.onclick = () => {
    settingsPage.style.visibility = "hidden";
  };

  model.oninput = () => {
    const list = localStorage.getItem("models");
    const parsedList = JSON.parse(list);
    const selectedModel = parsedList[model.selectedIndex];

    temperaturenum.value = selectedModel.temperature;
    temprange.value = selectedModel.temperature;
    console.log(selectedModel.outputTokenLimit);
    outputlengthdiv.value = selectedModel.outputTokenLimit;
    outputlengthdiv.max = selectedModel.outputTokenLimit;
  };
  apiKey.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      localStorage.setItem("what", apiKey.value);
      alert("API KEY SET: " + localStorage.getItem("what"));
    }
  });

  Prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      alert("prompt set ");
    }
  });

fileButton.addEventListener('change', () => {
  const files = fileButton.files;
  if (files && files.length > 0){
    readfile(files[0])
  }
})




  temprange.oninput = () => {
    temperaturenum.value = temprange.value;
  };

  topk.oninput = () => {
    topknum.value = topk.value;
  };
  stylesheet.innerHTML = `
    :host {
      background-color: #3d425c;
      position: fixed;
      right: 0;
      bottom: 0;
      width: 300px;
      min-width: 350px;
      max-width: 1000px;
      height: 410px;
      min-height: 250px;
      border: 1px solid #ccc;
      border-radius: 5%;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      resize: both;
    }
  
    
  

#opttext {
margin: 0;
padding: 10px;
}
  

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none; /* Chrome, Safari, Edge */
  margin: 0;
}

    #nums {
    width: 30%;
    background-color: gray;
    color:white;
    margin:0;
    text-align: center;
    }
  
    #rangeslides{
    text-align: center;
    margin:0;
    color: white;
    }



     .outs{
    text-align: left;
    margin:0;
    color: white;
    font-size: 17px;

    }
    
    .buttons-container {
      background-color: rgb(78, 78, 78);
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: center;
      padding: 5px;
      box-sizing: border-box;
    }
  
    .chat-container {
      background-color: #3d425c;
      height: calc(100% - 120px);
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      padding: 10px;
      margin-top: 25px;
      scrollbar-color:rgb(83, 90, 126) transparent;
scrollbar-gutter: stable;

    }
  
    
    .userMessage {
      color: rgb(255, 255, 255);
      font-weight: 600;
      background-color: rgb(32, 32, 32);
      border-radius: 10px;
      overflow-wrap: break-word;
      margin-top: 10px;
      padding: 10px;
    }
  
    .botMessage {
      font-family: 13px "monospace";
    }
  
  
    .me-container {
      height: 100px;
      background-color: #3d425c;
      box-sizing: border-box;
      padding: 5px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    .menu-container-buttons {
      background-color: gray;
      display: flex;
      justify-content: center;
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
      border: 1px solid tan;
      background-color: #242424;
      color: rgb(255, 255, 255);
      border-radius: 10px;
    }
  
  
    .settings {
      display: flex;
      width: 30px;
      font-size: 20px;
      border: none; /* Changed border-color to border:none */
      background-color: transparent;
      margin-bottom: 1px;
      cursor: pointer; /* Added cursor pointer for better UX */
    }



.settings,
.filess-label {
  display: flex; /* Use flexbox for potential centering or internal layout */
  justify-content: center; /* Center the emoji horizontally if container is wider than emoji */
  align-items: center; /* Center the emoji vertically */
  font-size: 20px; /* Controls the visual size of the emoji */
  border: none; /* Ensures no border is visible */
  background-color: transparent; /* Makes the background clear */
  cursor: pointer; /* Indicates the element is interactive */
  padding: 0; /* Remove default padding if element is a button */
  /* Add a smooth transition for effects */
  transition: opacity 0.2s ease-in-out, transform 0.1s ease-out;
}

.settings {
  width: 30px; /* Sets the container width */
  margin-bottom: 1px; /* Adds space below the element */
}

.filess-label {
  width: 15px; /* Sets the container width */
  margin-bottom: 4px; /* Adds space below the element */
  padding-left: 10px;
}


.settings:hover,
.filess-label:hover {
  opacity: 0.7; 
}


.settings:active,
.filess-label:active {
  transform: scale(0.9); 
}

.settings:focus,
.filess-label:focus {
  outline: 2px solid #007bff; 
  outline-offset: 2px; 
}

.settings:hover,
.filess-label:hover,
.settings:focus,
.filess-label:focus {
   opacity: 0.7; 
}

  .filess {
  display: none;
  
  }



    .settings:hover {
      background-color: #ccc;
    }
  
    .settings-page {
      position: absolute;
      background-color: rgb(46, 46, 46);
      width: 100%;
      height: 60%;
      margin-top: 36px;
      visibility: hidden;
      overflow-y: auto;
    }
  
    .settings-content {
      color: white;
      font-size: 25px;
      padding-top: 50px;
      padding-left: 20px;
      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;

    }
  
    .settings-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      justify-content: center;
      align-items: center;
      margin: 60px;
            overflow-y scroll;

    }
  
    .custom-file-upload {
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      display: flex;
      align-items: center;
      margin-top: 10px;
      width: 30px;
      height: 30px;
      border: none; /* Changed border-color to border:none */
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
  `;

  ChatInput.addEventListener("keypress", (key) => {
    if (key.key === "Enter") {
      sendMessage("You", ChatInput.value);
      input(
        model.value,
        localStorage.getItem("what"),
        Prompt.value,
        temprange.value,
        ChatInput.value
      );
      ChatInput.value = "";
    }
  });
}

// How to use the getmodels function

async function input(model, key, prompt, temperature, userinput) {
  const think = sendMessagepro();

  const reply = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        system_instruction: {
          parts: {
            text: prompt
          }
        },
        contents: {
          parts: {
            text: userinput
          } // Use the array of parts
        },
        generation_config: {
          temperature: temperature
        }
      })
    }
  )
    .then(async (response) => {
      if (!response.ok) {
        console.log("uh oh", response.status);
        removeBotThinking(think);
        sendMessage(
          "AI",
          `Error: Request failed with status ${response.status}`
        );
        return;
      }
      const data = await response.json();
      if (data) {
        const text = data.candidates[0].content.parts[0].text;
        removeBotThinking(think);
        sendMessage("AI", text);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      removeBotThinking(think);
    });
}

// ... (rest of your code)

init();

getmodels();
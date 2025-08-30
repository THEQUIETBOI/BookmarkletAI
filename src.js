function makeDraggable(element, handle) {
  let isDragging = false;
  let offsetX, offsetY;

  function handlePointerDown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return; 
    e.preventDefault(); 
    isDragging = true;

    const isTouch = e.type === "touchstart";
    const event = isTouch ? e.touches[0] : e; 

    const rect = element.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    element.style.cursor = "grabbing";
    if (handle !== element) { 
    }

    document.addEventListener("mousemove", handlePointerMove);
    document.addEventListener("touchmove", handlePointerMove, { passive: false }); 
    document.addEventListener("mouseup", handlePointerUp);
    document.addEventListener("touchend", handlePointerUp);
    document.addEventListener("mouseleave", handlePointerUp); 
  }

  function handlePointerMove(e) {
    if (!isDragging) return;

    if (e.type === "touchmove") {
        e.preventDefault();
    }

    const isTouch = e.type === "touchmove";
    const event = isTouch ? e.touches[0] : e;

    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  }

  function handlePointerUp() {
    if (!isDragging) return; 
    isDragging = false;

    element.style.cursor = "grab";
     if (handle !== element) {
        handle.style.cursor = "grab";
     }

    document.removeEventListener("mousemove", handlePointerMove);
    document.removeEventListener("touchmove", handlePointerMove);
    document.removeEventListener("mouseup", handlePointerUp);
    document.removeEventListener("touchend", handlePointerUp);
    document.removeEventListener("mouseleave", handlePointerUp);
  }

  handle.addEventListener("mousedown", handlePointerDown);
  handle.addEventListener("touchstart", handlePointerDown, { passive: true }); 

  const currentPosition = window.getComputedStyle(element).position;
  if (currentPosition !== 'fixed' && currentPosition !== 'absolute') {
      console.warn("Draggable element's position was not 'fixed' or 'absolute'. Setting to 'fixed'.");
      element.style.position = "fixed"; 
  }

  element.style.cursor = "grab";
  handle.style.cursor = "grab";
}

function sendMessage(user, text) {
  const main = document.getElementById("main-container");
  if (!main || !main.shadowRoot) {
    console.log("main or shadow root not found");
    return;
  }
  const chat = main.shadowRoot.getElementById("chat-container");

  if (chat) {
    const message = document.createElement("p");
    message.className = "userMessage";

    const sanitizedUser = user.replace(/</g, "<").replace(/>/g, ">");
    const sanitizedText = text.replace(/</g, "<").replace(/>/g, ">");
    message.innerHTML = `<strong>${sanitizedUser}:</strong> ${sanitizedText}`; 
    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;
  } else {
    console.error("Element with id 'chat-container' not found in shadow root.");
  }
}

function sendMessagepro() {
  const main = document.getElementById("main-container");
  if (!main || !main.shadowRoot) {
    console.log("main or shadow root not found");
    return null; 
  }
  const chat = main.shadowRoot.getElementById("chat-container");

  if (chat) {
    const message = document.createElement("p");
    message.className = "userMessage botThinking"; 
    message.innerHTML = "<strong>Bot:</strong> Is Thinking...";
    chat.appendChild(message);

     chat.scrollTop = chat.scrollHeight;
    return message; 
  } else {
    console.error("Element with id 'chat-container' not found in shadow root.");
    return null; 
  }
}

function removeBotThinking(thinkingElement) {

  if (thinkingElement && thinkingElement.parentNode) {
    thinkingElement.remove();
  } else if (thinkingElement) {
      console.warn("Thinking element passed to removeBotThinking has no parentNode.");
  } else {

      const main = document.getElementById("main-container");
      const shadow = main?.shadowRoot;
      const elementToRemove = shadow?.querySelector('.botThinking');
      elementToRemove?.remove();
  }
}

async function readFile(files) {
    if (!files || files.length === 0) {
        console.log('No files selected.');
        return null; 
    }

    const file = files[0]; 
    const reader = new FileReader();

    const maxSizeMB = 20;
    if (file.size > maxSizeMB * 1024 * 1024) {
         console.error(`File size exceeds ${maxSizeMB}MB limit.`);
         alert(`File is too large (max ${maxSizeMB}MB).`);
         return Promise.reject(new Error(`File size exceeds ${maxSizeMB}MB`)); 
    }

    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
          try {
            const fileContent = event.target.result; 
            const mimeType = file.type;

             const base64Marker = ";base64,";
             const base64StartIndex = fileContent.indexOf(base64Marker);

             if (base64StartIndex === -1) {
                 console.error('Could not find base64 marker in file content.');
                 reject(new Error('Invalid file data format'));
                 return;
             }

            const base64Data = fileContent.substring(base64StartIndex + base64Marker.length);

            if (!mimeType || !base64Data) {
                console.error('Failed to extract mime type or base64 data.');
                reject(new Error('File processing failed'));
                return;
            }

            const result = [mimeType, base64Data]; 
            console.log('File read successfully:', result[0]); 
            resolve(result); 
          } catch (error) {
              console.error('Error processing file data:', error);
              reject(error); 
          }

      };

      reader.onerror = (error) => {
        console.error('Error reading the file:', error);
        reject(error); 
      };

      reader.readAsDataURL(file); 
    });
}

async function getmodels() {
  const main = document.getElementById("main-container");

  if (!main || !main.shadowRoot) {
      console.log("Main container or shadow root not found for getmodels.");
      return;
  }
  const modelos = main.shadowRoot.getElementById("model");
  const apiKey = localStorage.getItem("what"); 

  if (!modelos) {
      console.log("Model select element not found.");
      return;
  }
  if (!apiKey) {
      console.log("API key not set. Cannot fetch models.");

      return;
  }

  console.log("Attempting to fetch models...");

  try {
    const response = await fetch(
      `https:
    );

    if (!response.ok) {

      const errorBody = await response.text(); 
      console.error(
          `Failed to fetch models: ${response.status} ${response.statusText}. Response: ${errorBody}`
          );

      alert(`Error fetching models: ${response.statusText}. Check console & API Key.`);
      return; 
    }

    console.log("Models fetched successfully. Processing...");
    const data = await response.json();

    if (data && data.models && Array.isArray(data.models)) {
      const models = data.models;

      const compatibleModels = models
            .filter(model => model.supportedGenerationMethods?.includes("generateContent"))
            .sort((a, b) => a.displayName.localeCompare(b.displayName)); 

      if(compatibleModels.length === 0){
          console.log("No compatible models found in the response.");

          return;
      }

       modelos.innerHTML = ''; 

      const modelListForStorage = compatibleModels.map((model) => {

        const config = model.generationConfig || {}; 
        return {
          name: model.name,
          displayName: model.displayName || model.name.split('/').pop(), 
          temperature: config.temperature ?? null, 
          topP: config.topP ?? null,
          topK: config.topK ?? null,
          maxOutputTokens: config.maxOutputTokens ?? null, 
        };
      });

      localStorage.setItem("models", JSON.stringify(modelListForStorage));

      compatibleModels.forEach((model) => {
        const option = document.createElement("option");
        option.value = model.name; 

        option.textContent = model.displayName || model.name.split("models/")[1];
        modelos.appendChild(option);
      });

      console.log("Model list populated and stored in localStorage.");

      if (modelos.options.length > 0) {
          modelos.selectedIndex = 16; 
          modelos.dispatchEvent(new Event('input')); 
      }

    } else {
      console.log("No models array found in the response data or data is malformed.");
    }
  } catch (error) {

    console.error("Error during model fetch or processing:", error);
    alert(`Network error or issue processing models. See console.`);
  }
}

async function init() {
  const mainContainer = document.createElement("div");
  mainContainer.className = "main-container";
  mainContainer.id = "main-container";
  document.body.appendChild(mainContainer);

  const shadowRoot = mainContainer.attachShadow({ mode: "open" });

  const settingsPage = document.createElement("div");
  settingsPage.className = "settings-page";
  shadowRoot.appendChild(settingsPage); 

  const settingsContainer = document.createElement("div");
  settingsContainer.className = "settings-container";
  settingsPage.appendChild(settingsContainer);

  const apiKey = document.createElement("input");
  apiKey.type = "password"; 
  apiKey.className = "api-key";
  apiKey.placeholder = "API KEY HERE";
  apiKey.value = localStorage.getItem("what") || ""; 
  settingsContainer.appendChild(apiKey);

  const Prompt = document.createElement("textarea"); 
  Prompt.rows = 3; 
  Prompt.className = "prompt";
  Prompt.placeholder = "Optional System Prompt...";
  Prompt.value = localStorage.getItem("systemPrompt") || ""; 
  settingsContainer.appendChild(Prompt);

  const model = document.createElement("select");
  model.id = "model";
  settingsContainer.appendChild(model);

  const loadingOption = document.createElement("option");
  loadingOption.textContent = "Loading models...";
  loadingOption.disabled = true;
  model.appendChild(loadingOption);

  const config = document.createElement("div");
  config.className = "config";
  settingsContainer.appendChild(config);

  const tempdiv = document.createElement("div");
  tempdiv.className = "rangeslides"; 
  settingsContainer.appendChild(tempdiv);

  const temptext = document.createElement("label"); 
  temptext.htmlFor = "temprange-input";
  temptext.className = "opttext"; 
  temptext.textContent = "Temperature (Randomness)"; 
  tempdiv.appendChild(temptext);

  const temprange = document.createElement("input");
  temprange.id = "temprange-input"; 
  temprange.className = "temprange";
  temprange.type = "range";
  temprange.min = "0";
  temprange.max = "2"; 
  temprange.step = "0.05";
  temprange.value = localStorage.getItem("temperature") || "0.9"; 
  tempdiv.appendChild(temprange);

  const temperaturenum = document.createElement("input");
  temperaturenum.id = "nums"; 
  temperaturenum.className = "num-input"; 
  temperaturenum.type = "number";
  temperaturenum.min = temprange.min; 
  temperaturenum.max = temprange.max;
  temperaturenum.step = temprange.step;
  temperaturenum.value = temprange.value; 
  tempdiv.appendChild(temperaturenum);

  const outdiv = document.createElement("div");
  outdiv.className = "rangeslides"; 
  settingsContainer.appendChild(outdiv);

  const outtext = document.createElement("label"); 
  outtext.htmlFor = "outputlength-input";
  outtext.className = "opttext";
  outtext.textContent = "Max Output Tokens"; 
  outdiv.appendChild(outtext);

  const outputlengthdiv = document.createElement("input");
  outputlengthdiv.id = "outputlength-input"; 
  outputlengthdiv.className = "num-input"; 
  outputlengthdiv.type = "number";
  outputlengthdiv.min = "1"; 
  outputlengthdiv.placeholder = "e.g., 2048";
  outputlengthdiv.value = localStorage.getItem("maxOutputTokens") || ""; 
  outdiv.appendChild(outputlengthdiv);

  const ks = document.createElement("div");
  ks.className = "rangeslides"; 
  settingsContainer.appendChild(ks);

  const topktext = document.createElement("label"); 
  topktext.htmlFor = "topkrange-input";
  topktext.className = "opttext";
  topktext.textContent = "Top-K Sampling";
  ks.appendChild(topktext);

  const topk = document.createElement("input");
  topk.id = "topkrange-input"; 
  topk.type = "range";
  topk.min = "1"; 
  topk.max = "40"; 
  topk.step = "1";
  topk.value = localStorage.getItem("topK") || "1"; 
  ks.appendChild(topk);

  const topknum = document.createElement("input");
  topknum.id = "nums"; 
  topknum.className = "num-input"; 
  topknum.type = "number";
  topknum.min = topk.min;
  topknum.max = topk.max;
  topknum.step = topk.step;
  topknum.value = topk.value; 
  ks.appendChild(topknum);

  const close = document.createElement("button");
  close.className = "close-button";
  close.textContent = "Close Settings";
  settingsContainer.appendChild(close);

  const buttonContainer = document.createElement("div"); 
  buttonContainer.className = "buttons-container";
  shadowRoot.appendChild(buttonContainer);

  makeDraggable(mainContainer, buttonContainer);

  const chatContainer = document.createElement("div");
  chatContainer.className = "chat-container";
  chatContainer.id = "chat-container";
  shadowRoot.appendChild(chatContainer);

  const menuContainer = document.createElement("div");
  menuContainer.className = "me-container";
  shadowRoot.appendChild(menuContainer);

  const menuContainerButtons = document.createElement("div");
  menuContainerButtons.className = "menu-container-buttons";
  menuContainer.appendChild(menuContainerButtons);

  const filelabel = document.createElement("label");
  filelabel.className = "filess-label";
  filelabel.innerHTML = "📁"; 
  filelabel.setAttribute("aria-label", "Upload file"); 
  filelabel.title = "Attach File (Image/PDF etc.)"; 
  menuContainerButtons.appendChild(filelabel);

  const fileButton = document.createElement("input");
  fileButton.type = "file";
  fileButton.id = "file-input"; 
  fileButton.className = "filess"; 
  fileButton.accept = "image/*,application/pdf,text/*"; 
  filelabel.htmlFor = "file-input"; 

  menuContainerButtons.appendChild(fileButton); 

  const settingsButton = document.createElement("button");
  settingsButton.className = "settings";
  settingsButton.innerHTML = "⚙️"; 
  settingsButton.setAttribute("aria-label", "Open settings"); 
  settingsButton.title = "Settings"; 
  menuContainerButtons.appendChild(settingsButton);

  const ChatInput = document.createElement("input");
  ChatInput.type = "text";
  ChatInput.className = "chat-input";
  ChatInput.placeholder = "Type message, press Enter to send";
  ChatInput.setAttribute("aria-label", "Chat input");
  menuContainerButtons.appendChild(ChatInput);

  const stylesheet = document.createElement("style");
  shadowRoot.appendChild(stylesheet);

  if (!window.marked) { 
      const marcopolo = document.createElement("script");
      marcopolo.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
      marcopolo.onload = () => console.log("Marked.js loaded.");
      marcopolo.onerror = () => console.error("Failed to load Marked.js");
      document.head.appendChild(marcopolo);
  }

  settingsButton.onclick = () => {
    settingsPage.style.visibility = settingsPage.style.visibility === "visible" ? "hidden" : "visible";

    if(settingsPage.style.visibility === "visible") {
        apiKey.focus();
    }
  };

  close.onclick = () => {
    settingsPage.style.visibility = "hidden";
  };

  temperaturenum.oninput = () => {
      temprange.value = temperaturenum.value;
      localStorage.setItem("temperature", temperaturenum.value); 
  };
  topknum.oninput = () => {
      topk.value = topknum.value;
      localStorage.setItem("topK", topknum.value); 
  };

  model.oninput = () => {
    const modelsData = localStorage.getItem("models");
    if (!modelsData) return; 

    try {
        const parsedList = JSON.parse(modelsData);

        const selectedModelData = parsedList.find(m => m.name === model.value);

        if (selectedModelData) {
             console.log("Selected Model Data:", selectedModelData);

            const defaultTemp = 0.9;
            const defaultTopK = 1; 
            const defaultMaxTokens = 2048; 

            temprange.value = selectedModelData.temperature ?? defaultTemp;
            temperaturenum.value = selectedModelData.temperature ?? defaultTemp;

            outputlengthdiv.value = selectedModelData.maxOutputTokens ?? (localStorage.getItem("maxOutputTokens") || ""); 
            outputlengthdiv.placeholder = selectedModelData.maxOutputTokens ? `Max: ${selectedModelData.maxOutputTokens}` : `e.g., ${defaultMaxTokens}`; 

             if(selectedModelData.maxOutputTokens) {
                 outputlengthdiv.max = selectedModelData.maxOutputTokens;
             } else {
                 outputlengthdiv.removeAttribute('max'); 
             }

            topk.value = selectedModelData.topK ?? defaultTopK;
            topknum.value = selectedModelData.topK ?? defaultTopK;

             localStorage.setItem("temperature", temprange.value);
             localStorage.setItem("maxOutputTokens", outputlengthdiv.value); 
             localStorage.setItem("topK", topk.value);

        } else {
             console.warn("Selected model name not found in stored data:", model.value);

        }
    } catch (e) {
        console.error("Error parsing models data from localStorage:", e);
    }
  };

  apiKey.addEventListener("change", () => { 
    const newKey = apiKey.value.trim();
    if (newKey) {
        localStorage.setItem("what", newKey);
        console.log("API KEY updated.");

        getmodels();
    } else {
        localStorage.removeItem("what");
        console.log("API KEY cleared.");
        model.innerHTML = '<option>Set API Key first</option>'; 
    }
  });

  Prompt.addEventListener("change", () => {
    localStorage.setItem("systemPrompt", Prompt.value);
    console.log("System prompt updated.");
  });

  let selectedfile = null; 
  fileButton.addEventListener('change', async (event) => {
      const files = event.target.files;

      selectedfile = null;
      filelabel.classList.remove("file-selected"); 

      try {
          const fileData = await readFile(files); 
          if (fileData) {
              selectedfile = fileData; 
              console.log(`File "${files[0].name}" processed and ready.`);

              filelabel.classList.add("file-selected"); 
              filelabel.title = `File attached: ${files[0].name}`; 
          }
      } catch (error) {
           console.error("Failed to read or process file:", error);

           event.target.value = null; 
           alert(`Error processing file: ${error.message}`); 
           filelabel.classList.remove("file-selected");
           filelabel.title = "Attach File (Image/PDF etc.)"; 
      }
  });

  temprange.oninput = () => {
    temperaturenum.value = temprange.value;
     localStorage.setItem("temperature", temprange.value); 
  };

  topk.oninput = () => {
    topknum.value = topk.value;
     localStorage.setItem("topK", topk.value); 
  };

   outputlengthdiv.onchange = () => { 
        localStorage.setItem("maxOutputTokens", outputlengthdiv.value);
        console.log("Max Output Tokens saved:", outputlengthdiv.value);
   };

  ChatInput.addEventListener("keypress", (key) => {
    if (key.key === "Enter" && ChatInput.value.trim() !== "") { 
      const userMessage = ChatInput.value.trim();
      sendMessage("You", userMessage); 

      const currentModel = model.value;
      const currentApiKey = localStorage.getItem("what");
      const currentSystemPrompt = Prompt.value;
      const currentTemperature = parseFloat(temperaturenum.value); 
      const currentTopK = parseInt(topknum.value, 10); 
      const currentMaxOutput = parseInt(outputlengthdiv.value, 10) || null; 

       if (!currentApiKey) {
           sendMessage("System", "Error: API Key is not set. Please set it in settings.");
           return; 
       }

       if (!currentModel || currentModel === "Loading models..." || currentModel === "Set API Key first") {
           sendMessage("System", "Error: Please select a valid model in settings.");
           return; 
       }

      input(
        currentModel,
        currentApiKey,
        currentSystemPrompt,
        currentTemperature,
        currentTopK, 
        currentMaxOutput, 
        userMessage,
        selectedfile 
      );

      ChatInput.value = "";
      selectedfile = null; 
      fileButton.value = null; 
      filelabel.classList.remove("file-selected"); 
       filelabel.title = "Attach File (Image/PDF etc.)"; 
    }
  });

  stylesheet.innerHTML = `
    :host { 

      background-color: #3d425c; 
      color: #e0e0e0; 
      border: 1px solid #5a617c; 
      border-radius: 8px; 

      position: fixed; 
      right: 10px; 
      bottom: 10px;
      width: 350px; 
      height: 450px; 
      min-width: 300px; 
      min-height: 250px; 
      max-width: 90vw; 
      max-height: 80vh;

      display: flex;
      flex-direction: column;
      overflow: hidden; 
      resize: both; 
      z-index: 10000; 
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); 
      font-family: sans-serif; 
    }

    .buttons-container {
      background-color: #4e4e4e; 
      width: 100%;
      height: 25px; 
      flex-shrink: 0; 
      cursor: grab; 
      border-bottom: 1px solid #5a617c; 
      display: flex; 
      align-items: center; 
      justify-content: center; 

       background-image: linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.1));
    }

     .buttons-container:active {
       cursor: grabbing; 
     }

    .chat-container {
      flex-grow: 1; 
      background-color: #3d425c; 
      overflow-y: auto; 
      overflow-x: hidden; 
      padding: 10px;
      scrollbar-width: thin; 
      scrollbar-color: #5a617c #3d425c; 
    }

    .chat-container::-webkit-scrollbar {
        width: 8px; 
    }
    .chat-container::-webkit-scrollbar-track {
        background: #3d425c; 
        border-radius: 4px;
    }
    .chat-container::-webkit-scrollbar-thumb {
        background-color: #5a617c; 
        border-radius: 4px;
        border: 2px solid #3d425c; 
    }
     .chat-container::-webkit-scrollbar-thumb:hover {
        background-color: #6b7394; 
     }

    .userMessage {
      color: #ffffff; 
      background-color: #4a4e69; 
      border-radius: 10px;
      padding: 8px 12px; 
      margin-bottom: 10px; 
      max-width: 90%; 
      word-wrap: break-word; 
      line-height: 1.4; 

      white-space: pre-wrap; 
    }
     .userMessage strong { 
         font-weight: bold;
         color: #9a8c98; 
         margin-right: 5px;
     }

    .botThinking {
        font-style: italic;
        color: #aaa; 
    }

    .me-container {
      height: auto; 
      min-height: 50px; 
      background-color: #3d425c; 
      padding: 5px 10px; 
      border-top: 1px solid #5a617c; 
      flex-shrink: 0; 
    }

    .menu-container-buttons {
      background-color: transparent; 
      display: flex;
      align-items: center; 
      gap: 8px; 
      width: 100%; 
      border: none; 
      border-radius: 0; 
      padding: 0; 
    }

    .chat-input {
      flex-grow: 1; 
      height: 36px; 
      outline: none;
      padding: 0 10px; 
      border: 1px solid #5a617c; 
      background-color: #2f334d; 
      color: #e0e0e0; 
      border-radius: 18px; 
      font-size: 14px;
    }
    .chat-input:focus {
        border-color: #7b88b1; 
        box-shadow: 0 0 0 2px rgba(123, 136, 177, 0.3); 
    }

    .settings,
    .filess-label {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 22px; 
      border: none;
      background-color: transparent;
      color: #a9b1d6; 
      cursor: pointer;
      padding: 5px; 
      border-radius: 50%; 
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .settings:hover,
    .filess-label:hover {
      background-color: rgba(255, 255, 255, 0.1); 
      color: #c0caf5; 
    }
    .settings:active,
    .filess-label:active {
      background-color: rgba(255, 255, 255, 0.2); 
    }

     .filess-label.file-selected {
         color: #86e1a8; 
         position: relative; 
     }

     .filess-label.file-selected::after {
         content: '';
         position: absolute;
         top: 4px;
         right: 4px;
         width: 6px;
         height: 6px;
         background-color: #f7768e; 
         border-radius: 50%;
     }

    .filess {
      display: none;
    }

    .settings-page {
      position: absolute;
      top: 25px; 
      left: 0;
      right: 0;
      bottom: 0; 
      background-color: rgba(40, 42, 54, 0.95); 
      backdrop-filter: blur(4px); 
      visibility: hidden; 
      opacity: 0; 
      transition: opacity 0.3s ease, visibility 0.3s ease; 
      overflow-y: auto; 
      z-index: 10; 
      scrollbar-width: thin;
      scrollbar-color: #5a617c #282a36;
    }

    .settings-page[style*="visibility: visible"] {
        visibility: visible;
        opacity: 1;
    }
    .settings-page::-webkit-scrollbar { width: 8px; }
    .settings-page::-webkit-scrollbar-track { background: #282a36; border-radius: 4px; }
    .settings-page::-webkit-scrollbar-thumb { background-color: #5a617c; border-radius: 4px; border: 2px solid #282a36; }
    .settings-page::-webkit-scrollbar-thumb:hover { background-color: #6b7394; }

    .settings-container {
      display: flex;
      flex-direction: column;
      gap: 15px; 
      padding: 20px; 
      color: #f8f8f2; 
    }

    .settings-container input[type="text"],
    .settings-container input[type="password"],
    .settings-container input[type="number"],
    .settings-container textarea,
    .settings-container select {
      width: 100%; 
      padding: 8px 10px;
      background-color: #2f334d;
      border: 1px solid #5a617c;
      color: #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box; 
    }
    .settings-container input:focus,
    .settings-container textarea:focus,
    .settings-container select:focus {
        outline: none;
        border-color: #7b88b1;
        box-shadow: 0 0 0 2px rgba(123, 136, 177, 0.3);
    }
    .settings-container textarea {
        resize: vertical; 
        min-height: 60px;
    }
    .settings-container select {
        cursor: pointer;
    }

    .rangeslides {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap; 
    }
    .opttext { 
      flex-basis: 100%; 
      margin-bottom: 5px; 
      color: #c0caf5; 
      font-size: 13px;
      font-weight: bold;
       text-align: left;
    }
     @media (min-width: 400px) { 
         .opttext { flex-basis: auto; flex-shrink: 0; margin-bottom: 0; }
         .rangeslides input[type="range"] { flex-grow: 1; }
     }

     .temprange, 
     .settings-container input[type="range"] { 
       flex-grow: 1; 
       height: 8px;
       cursor: pointer;
       appearance: none;
       background: linear-gradient(to right, #8f9aae, #5a617c); 
       border-radius: 4px;
       outline: none;
       opacity: 0.7;
       transition: opacity .2s;
     }
     .temprange:hover,
     .settings-container input[type="range"]:hover {
       opacity: 1;
     }

     .temprange::-webkit-slider-thumb,
     .settings-container input[type="range"]::-webkit-slider-thumb {
       appearance: none;
       width: 16px;
       height: 16px;
       background: #c0caf5; 
       border-radius: 50%;
       cursor: pointer;
     }
     .temprange::-moz-range-thumb,
     .settings-container input[type="range"]::-moz-range-thumb {
       width: 16px;
       height: 16px;
       background: #c0caf5;
       border-radius: 50%;
       cursor: pointer;
       border: none;
     }

    .num-input {
        width: 70px; 
        text-align: center;
        flex-shrink: 0; 

         appearance: textfield; 
    }
     .num-input::-webkit-outer-spin-button,
     .num-input::-webkit-inner-spin-button {
       -webkit-appearance: none;
       margin: 0;
     }

    .close-button {
      padding: 10px 15px;
      background-color: #7aa2f7; 
      color: #1a1b26; 
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.2s ease;
      margin-top: 10px; 
       align-self: flex-end; 
    }
    .close-button:hover {
      background-color: #8cb5f9;
    }

     .userMessage code {
       background-color: #2a2f41; 
       color: #c0caf5; 
       padding: 2px 6px; 
       border-radius: 4px;
       font-family: 'Courier New', Courier, monospace; 
       font-size: 0.9em; 
     }
     .userMessage pre {
       background-color: #2a2f41;
       color: #c0caf5;
       padding: 10px;
       border-radius: 5px;
       overflow-x: auto; 
       margin: 10px 0; 
       font-family: 'Courier New', Courier, monospace;
       white-space: pre; 
     }
     .userMessage pre code {
         padding: 0; 
         background-color: transparent; 
         white-space: inherit; 
     }

  `;

  if (localStorage.getItem("what")) {
      getmodels();
  } else {
      model.innerHTML = '<option disabled selected>Set API Key in Settings</option>';
  }

}

async function input(
    modelName, apiKey, systemPrompt, temperature, topK, maxOutputTokens,
    userInput, selectedFileData 
    ) {
  const thinkElement = sendMessagepro(); 

  try {

    const requestBody = {
        contents: [{
            role: "user", 
            parts: [{ text: userInput }]
        }],
        generationConfig: {

            ...(temperature !== null && !isNaN(temperature) && { temperature: temperature }),
            ...(topK !== null && !isNaN(topK) && topK >= 1 && { topK: topK }), 
            ...(maxOutputTokens !== null && !isNaN(maxOutputTokens) && maxOutputTokens > 0 && { maxOutputTokens: maxOutputTokens })
        },

        ...(systemPrompt && systemPrompt.trim() !== "" && {
             systemInstruction: {
                 role: "system", 
                 parts: [{ text: systemPrompt.trim() }]
             }
         })
    };

     if (selectedFileData && Array.isArray(selectedFileData) && selectedFileData.length === 2) {
         const [mimeType, base64Data] = selectedFileData;

          if (typeof mimeType === 'string' && mimeType.includes('/') && typeof base64Data === 'string' && base64Data.length > 0) {
              const filePart = {
                  inlineData: { 
                      mimeType: mimeType,
                      data: base64Data
                  }
              };

              requestBody.contents[0].parts.push(filePart);
              console.log("File data added to request:", mimeType);
          } else {
               console.warn("Invalid file data format received, skipping file.", selectedFileData);

               sendMessage("System", "Warning: Could not process the attached file data.");
          }
      } else if (selectedFileData) {

           console.warn("Received selectedFile data but it was not a valid [type, data] array:", selectedFileData);
           sendMessage("System", "Warning: Invalid file data detected, file not sent.");
      }

    console.log("API Request Body:", JSON.stringify(requestBody, null, 2)); 

    const response = await fetch(
      `https:
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );

    removeBotThinking(thinkElement); 

    if (!response.ok) {

      let errorDetails = `API request failed with status ${response.status} ${response.statusText}`;
      try {
          const errorData = await response.json();

           if (errorData.error && errorData.error.message) {
              errorDetails += `\nDetails: ${errorData.error.message}`;
           } else {
              errorDetails += `\nResponse: ${JSON.stringify(errorData)}`; 
           }

      } catch (e) {

          console.error("Could not parse error response JSON:", e);
      }
      throw new Error(errorDetails); 
    }

    const data = await response.json();

    if (data && data.candidates && data.candidates.length > 0 &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0 && data.candidates[0].content.parts[0].text)
    {
        let botText = data.candidates[0].content.parts[0].text;

         if (window.marked) {
             try {

                 marked.setOptions({
                   breaks: true, 
                   gfm: true,    

                 });
                 botText = marked.parse(botText); 

                  const botMessageElement = sendMessage("AI", botText); 
                  if(botMessageElement) { 

                     const textNode = botMessageElement.childNodes[botMessageElement.childNodes.length - 1]; 
                     if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                         textNode.nodeValue = ' '; 
                         botMessageElement.insertAdjacentHTML('beforeend', botText); 
                     } else {

                         botMessageElement.innerHTML = `<strong>AI:</strong> ${botText}`;
                     }
                  }

             } catch (markdownError) {
                 console.error("Markdown parsing error:", markdownError);
                  sendMessage("AI", data.candidates[0].content.parts[0].text); 
             }
         } else {
              sendMessage("AI", botText); 
         }

    } else if (data && data.promptFeedback && data.promptFeedback.blockReason) {

          const reason = data.promptFeedback.blockReason;
          const safetyRatings = data.promptFeedback.safetyRatings?.map(r => `${r.category}: ${r.probability}`).join(', ') || 'N/A';
          console.warn(`Prompt blocked. Reason: ${reason}. Safety Ratings: [${safetyRatings}]`);
          sendMessage("AI", `⚠️ **Content Blocked**\nReason: ${reason}.\n(Safety details logged to console)`);

    }
    else {
      console.log("API response received, but no valid candidate text found.", data);
      sendMessage("AI", "Received an empty or unexpected response from the AI.");
    }

  } catch (error) {
    console.error("Error during API call or processing:", error);
    removeBotThinking(thinkElement); 

    sendMessage("AI", `❌ **Error:** ${error.message}`); 
  }
}

init();

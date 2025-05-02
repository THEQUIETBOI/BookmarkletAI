function makeDraggable(element, handle) {
  let isDragging = false;
  let offsetX, offsetY;

  function handlePointerDown(e) {
    // Allow text selection in inputs within the draggable element
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return; // Don't start dragging if interacting with input fields
    }
    e.preventDefault(); // Prevent default touch behavior (scrolling) and text selection on handle
    isDragging = true;

    const isTouch = e.type === "touchstart";
    const event = isTouch ? e.touches[0] : e; // Use touches for touch events

    // Get element's current position relative to the viewport
    const rect = element.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    // Change cursor style during drag
    element.style.cursor = "grabbing";
    if (handle !== element) { // Only change handle cursor if it's different
        handle.style.cursor = "grabbing";
    }


    document.addEventListener("mousemove", handlePointerMove);
    document.addEventListener("touchmove", handlePointerMove, { passive: false }); // passive: false needed for preventDefault inside move
    document.addEventListener("mouseup", handlePointerUp);
    document.addEventListener("touchend", handlePointerUp);
    document.addEventListener("mouseleave", handlePointerUp); // Stop dragging if mouse leaves the window
  }

  function handlePointerMove(e) {
    if (!isDragging) return;

    // Prevent default touch behavior like scrolling while dragging
    if (e.type === "touchmove") {
        e.preventDefault();
    }

    const isTouch = e.type === "touchmove";
    const event = isTouch ? e.touches[0] : e;

    // Calculate new position based on viewport coordinates
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  }

  function handlePointerUp() {
    if (!isDragging) return; // Prevent unnecessary removals if not dragging
    isDragging = false;

    // Reset cursor style
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

  // Attach listeners to the specified handle element
  handle.addEventListener("mousedown", handlePointerDown);
  handle.addEventListener("touchstart", handlePointerDown, { passive: true }); // passive: true for down, let preventDefault happen explicitly if needed

  // --- Style Application ---
  // Ensure the element is positioned correctly for dragging
  const currentPosition = window.getComputedStyle(element).position;
  if (currentPosition !== 'fixed' && currentPosition !== 'absolute') {
      console.warn("Draggable element's position was not 'fixed' or 'absolute'. Setting to 'fixed'.");
      element.style.position = "fixed"; // Or 'absolute' depending on desired behavior relative to parent/viewport
  }
   // Set initial cursor styles
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

  // Check if the element exists before attempting to append a child.
  if (chat) {
    const message = document.createElement("p");
    message.className = "userMessage";
    // Basic sanitization (replace angle brackets to prevent simple HTML injection)
    const sanitizedUser = user.replace(/</g, "<").replace(/>/g, ">");
    const sanitizedText = text.replace(/</g, "<").replace(/>/g, ">");
    message.innerHTML = `<strong>${sanitizedUser}:</strong> ${sanitizedText}`; // Use strong tag for user, safer innerHTML
    chat.appendChild(message);
    // Scroll to the bottom after adding a message
    chat.scrollTop = chat.scrollHeight;
  } else {
    console.error("Element with id 'chat-container' not found in shadow root.");
  }
}

function sendMessagepro() {
  const main = document.getElementById("main-container");
  if (!main || !main.shadowRoot) {
    console.log("main or shadow root not found");
    return null; // Return null if container not found
  }
  const chat = main.shadowRoot.getElementById("chat-container");

  // Check if the element exists before attempting to append a child.
  if (chat) {
    const message = document.createElement("p");
    message.className = "userMessage botThinking"; // Add a specific class for styling/finding
    message.innerHTML = "<strong>Bot:</strong> Is Thinking...";
    chat.appendChild(message);
     // Scroll to the bottom
     chat.scrollTop = chat.scrollHeight;
    return message; // Return the created element
  } else {
    console.error("Element with id 'chat-container' not found in shadow root.");
    return null; // Return null if chat not found
  }
}

function removeBotThinking(thinkingElement) {
  // Check if the element exists and has a parent before trying to remove
  if (thinkingElement && thinkingElement.parentNode) {
    thinkingElement.remove();
  } else if (thinkingElement) {
      console.warn("Thinking element passed to removeBotThinking has no parentNode.");
  } else {
      // Optionally find the element if not passed directly (less efficient)
      const main = document.getElementById("main-container");
      const shadow = main?.shadowRoot;
      const elementToRemove = shadow?.querySelector('.botThinking');
      elementToRemove?.remove();
  }
}

async function readFile(files) {
    if (!files || files.length === 0) {
        console.log('No files selected.');
        return null; // Return null if no files
    }

    const file = files[0]; // Handle only the first selected file
    const reader = new FileReader();

    // Basic check for potentially large files (e.g., > 20MB)
    // The API might have its own limits (often around 4MB for inline data)
    const maxSizeMB = 20;
    if (file.size > maxSizeMB * 1024 * 1024) {
         console.error(`File size exceeds ${maxSizeMB}MB limit.`);
         alert(`File is too large (max ${maxSizeMB}MB).`);
         return Promise.reject(new Error(`File size exceeds ${maxSizeMB}MB`)); // Reject the promise
    }


    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
          try {
            const fileContent = event.target.result; // This is the Data URL: "data:mime/type;base64,..."
            const mimeType = file.type;

             // Robustly find the start of the base64 data
             const base64Marker = ";base64,";
             const base64StartIndex = fileContent.indexOf(base64Marker);

             if (base64StartIndex === -1) {
                 console.error('Could not find base64 marker in file content.');
                 reject(new Error('Invalid file data format'));
                 return;
             }

            // Extract the base64 part
            const base64Data = fileContent.substring(base64StartIndex + base64Marker.length);

            if (!mimeType || !base64Data) {
                console.error('Failed to extract mime type or base64 data.');
                reject(new Error('File processing failed'));
                return;
            }

            const result = [mimeType, base64Data]; // Store as [mime_type, data]
            console.log('File read successfully:', result[0]); // Log only type for brevity
            resolve(result); // Resolve the promise with the [type, data] array
          } catch (error) {
              console.error('Error processing file data:', error);
              reject(error); // Reject if any error during processing
          }

      };

      reader.onerror = (error) => {
        console.error('Error reading the file:', error);
        reject(error); // Reject the promise if FileReader fails
      };

      reader.readAsDataURL(file); // Read as Data URL to get base64 encoding
    });
}




async function getmodels() {
  const main = document.getElementById("main-container");
  // Ensure main and shadowRoot exist
  if (!main || !main.shadowRoot) {
      console.log("Main container or shadow root not found for getmodels.");
      return;
  }
  const modelos = main.shadowRoot.getElementById("model");
  const apiKey = localStorage.getItem("what"); // Get API key

  // Check if the select element exists and if an API key is set
  if (!modelos) {
      console.log("Model select element not found.");
      return;
  }
  if (!apiKey) {
      console.log("API key not set. Cannot fetch models.");
      // Optionally inform the user via UI
      return;
  }


  console.log("Attempting to fetch models...");


  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      // Provide more context on failure
      const errorBody = await response.text(); // Try to get error details from response
      console.error(
          `Failed to fetch models: ${response.status} ${response.statusText}. Response: ${errorBody}`
          );
      // Optionally alert the user or update UI
      alert(`Error fetching models: ${response.statusText}. Check console & API Key.`);
      return; // Stop execution if fetch failed
    }


    console.log("Models fetched successfully. Processing...");
    const data = await response.json();


    if (data && data.models && Array.isArray(data.models)) {
      const models = data.models;
      // Filter for models supporting 'generateContent' and sort alphabetically
      const compatibleModels = models
            .filter(model => model.supportedGenerationMethods?.includes("generateContent"))
            .sort((a, b) => a.displayName.localeCompare(b.displayName)); // Sort by display name


      if(compatibleModels.length === 0){
          console.log("No compatible models found in the response.");
          // Optionally update UI to indicate no models available
          return;
      }


       // Clear existing options except maybe a default placeholder if desired
       modelos.innerHTML = ''; // Clear previous options


      const modelListForStorage = compatibleModels.map((model) => {
        // Extract relevant details safely
        const config = model.generationConfig || {}; // Use empty object if config missing
        return {
          name: model.name,
          displayName: model.displayName || model.name.split('/').pop(), // Use displayName or derive from name
          temperature: config.temperature ?? null, // Use nullish coalescing
          topP: config.topP ?? null,
          topK: config.topK ?? null,
          maxOutputTokens: config.maxOutputTokens ?? null, // Corrected property name
        };
      });


      // Store the filtered and structured model information
      localStorage.setItem("models", JSON.stringify(modelListForStorage));


      // Populate the select dropdown
      compatibleModels.forEach((model) => {
        const option = document.createElement("option");
        option.value = model.name; // Use the full model name as value
        // Prefer displayName, fall back to formatted name
        option.textContent = model.displayName || model.name.split("models/")[1];
        modelos.appendChild(option);
      });


      console.log("Model list populated and stored in localStorage.");
      // Trigger an update if needed, e.g., select the first model or trigger oninput
      if (modelos.options.length > 0) {
          modelos.selectedIndex = 16; // Select the first model by default
          modelos.dispatchEvent(new Event('input')); // Trigger the input event handler
      }


    } else {
      console.log("No models array found in the response data or data is malformed.");
    }
  } catch (error) {
    // Catch network errors or JSON parsing errors
    console.error("Error during model fetch or processing:", error);
    alert(`Network error or issue processing models. See console.`);
  }
}

async function init() {
  const mainContainer = document.createElement("div");
  mainContainer.className = "main-container";
  mainContainer.id = "main-container";
  document.body.appendChild(mainContainer);

  // Attach Shadow DOM
  const shadowRoot = mainContainer.attachShadow({ mode: "open" });

  // --- Settings Page ---
  const settingsPage = document.createElement("div");
  settingsPage.className = "settings-page";
  shadowRoot.appendChild(settingsPage); // Append to shadowRoot

  const settingsContainer = document.createElement("div");
  settingsContainer.className = "settings-container";
  settingsPage.appendChild(settingsContainer);

  // API Key Input
  const apiKey = document.createElement("input");
  apiKey.type = "password"; // Use password type for API keys
  apiKey.className = "api-key";
  apiKey.placeholder = "API KEY HERE";
  apiKey.value = localStorage.getItem("what") || ""; // Pre-fill if exists
  settingsContainer.appendChild(apiKey);

  // System Prompt Input
  const Prompt = document.createElement("textarea"); // Use textarea for potentially longer prompts
  Prompt.rows = 3; // Set initial size
  Prompt.className = "prompt";
  Prompt.placeholder = "Optional System Prompt...";
  Prompt.value = localStorage.getItem("systemPrompt") || ""; // Persist prompt
  settingsContainer.appendChild(Prompt);

  // Model Selection Dropdown
  const model = document.createElement("select");
  model.id = "model";
  settingsContainer.appendChild(model);
  // Placeholder option while models load
  const loadingOption = document.createElement("option");
  loadingOption.textContent = "Loading models...";
  loadingOption.disabled = true;
  model.appendChild(loadingOption);

  // --- Generation Config ---
  const config = document.createElement("div");
  config.className = "config";
  settingsContainer.appendChild(config);

  // Temperature Slider & Number Input
  const tempdiv = document.createElement("div");
  tempdiv.className = "rangeslides"; // Use class instead of ID if reusable
  settingsContainer.appendChild(tempdiv);

  const temptext = document.createElement("label"); // Use label for accessibility
  temptext.htmlFor = "temprange-input";
  temptext.className = "opttext"; // Use class
  temptext.textContent = "Temperature (Randomness)"; // More descriptive label
  tempdiv.appendChild(temptext);


  const temprange = document.createElement("input");
  temprange.id = "temprange-input"; // ID for label
  temprange.className = "temprange";
  temprange.type = "range";
  temprange.min = "0";
  temprange.max = "2"; // Max temp can vary, 1.0 is common, 2.0 allows more creativity/chaos
  temprange.step = "0.05";
  temprange.value = localStorage.getItem("temperature") || "0.9"; // Default & Persist
  tempdiv.appendChild(temprange);

  const temperaturenum = document.createElement("input");
  temperaturenum.id = "nums"; // Keep ID for specific styling if needed, but classes preferred
  temperaturenum.className = "num-input"; // Use class
  temperaturenum.type = "number";
  temperaturenum.min = temprange.min; // Sync with range
  temperaturenum.max = temprange.max;
  temperaturenum.step = temprange.step;
  temperaturenum.value = temprange.value; // Sync with range
  tempdiv.appendChild(temperaturenum);


  // Max Output Tokens Input
  const outdiv = document.createElement("div");
  outdiv.className = "rangeslides"; // Reuse class
  settingsContainer.appendChild(outdiv);

  const outtext = document.createElement("label"); // Use label
  outtext.htmlFor = "outputlength-input";
  outtext.className = "opttext";
  outtext.textContent = "Max Output Tokens"; // Standard term
  outdiv.appendChild(outtext);

  const outputlengthdiv = document.createElement("input");
  outputlengthdiv.id = "outputlength-input"; // ID for label
  outputlengthdiv.className = "num-input"; // Use class
  outputlengthdiv.type = "number";
  outputlengthdiv.min = "1"; // Minimum 1 token
  outputlengthdiv.placeholder = "e.g., 2048";
  outputlengthdiv.value = localStorage.getItem("maxOutputTokens") || ""; // Persist, default handled by model info
  outdiv.appendChild(outputlengthdiv);

  // Top-K Slider & Number Input
  const ks = document.createElement("div");
  ks.className = "rangeslides"; // Reuse class
  settingsContainer.appendChild(ks);

  const topktext = document.createElement("label"); // Use label
  topktext.htmlFor = "topkrange-input";
  topktext.className = "opttext";
  topktext.textContent = "Top-K Sampling";
  ks.appendChild(topktext);

  const topk = document.createElement("input");
  topk.id = "topkrange-input"; // ID for label
  topk.type = "range";
  topk.min = "1"; // Top-K is typically integer >= 1
  topk.max = "40"; // Common range, adjust as needed
  topk.step = "1";
  topk.value = localStorage.getItem("topK") || "1"; // Default & Persist (1 means no effect usually)
  ks.appendChild(topk);

  const topknum = document.createElement("input");
  topknum.id = "nums"; // Keep ID?
  topknum.className = "num-input"; // Use class
  topknum.type = "number";
  topknum.min = topk.min;
  topknum.max = topk.max;
  topknum.step = topk.step;
  topknum.value = topk.value; // Sync with range
  ks.appendChild(topknum);

  // Close Button for Settings
  const close = document.createElement("button");
  close.className = "close-button";
  close.textContent = "Close Settings";
  settingsContainer.appendChild(close);

  // --- Main UI Elements ---
  const buttonContainer = document.createElement("div"); // This is the drag handle
  buttonContainer.className = "buttons-container";
  shadowRoot.appendChild(buttonContainer);

  // Initialize dragging
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

  // File Upload Button & Label
  const filelabel = document.createElement("label");
  filelabel.className = "filess-label";
  filelabel.innerHTML = "📁"; // Emoji for file
  filelabel.setAttribute("aria-label", "Upload file"); // Accessibility
  filelabel.title = "Attach File (Image/PDF etc.)"; // Tooltip
  menuContainerButtons.appendChild(filelabel);

  const fileButton = document.createElement("input");
  fileButton.type = "file";
  fileButton.id = "file-input"; // Add ID for label association
  fileButton.className = "filess"; // Keep class for styling (hidden)
  fileButton.accept = "image/*,application/pdf,text/*"; // Specify acceptable MIME types
  filelabel.htmlFor = "file-input"; // Link label to input
  // Append input to label OR directly to menuContainerButtons, label still works with 'for'
  menuContainerButtons.appendChild(fileButton); // Append hidden input

  // Settings Button
  const settingsButton = document.createElement("button");
  settingsButton.className = "settings";
  settingsButton.innerHTML = "⚙️"; // Emoji for settings
  settingsButton.setAttribute("aria-label", "Open settings"); // Accessibility
  settingsButton.title = "Settings"; // Tooltip
  menuContainerButtons.appendChild(settingsButton);

  // Chat Input Field
  const ChatInput = document.createElement("input");
  ChatInput.type = "text";
  ChatInput.className = "chat-input";
  ChatInput.placeholder = "Type message, press Enter to send";
  ChatInput.setAttribute("aria-label", "Chat input");
  menuContainerButtons.appendChild(ChatInput);


  // Stylesheet
  const stylesheet = document.createElement("style");
  shadowRoot.appendChild(stylesheet);

  // Marked.js for Markdown rendering (optional, keep if needed)
  // Ensure it's loaded before use or handle potential errors
  if (!window.marked) { // Check if marked is already loaded
      const marcopolo = document.createElement("script");
      marcopolo.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
      marcopolo.onload = () => console.log("Marked.js loaded.");
      marcopolo.onerror = () => console.error("Failed to load Marked.js");
      document.head.appendChild(marcopolo);
  }

  // --- Event Listeners ---

  settingsButton.onclick = () => {
    settingsPage.style.visibility = settingsPage.style.visibility === "visible" ? "hidden" : "visible";
    // Optional: Focus first element in settings when opened
    if(settingsPage.style.visibility === "visible") {
        apiKey.focus();
    }
  };

  close.onclick = () => {
    settingsPage.style.visibility = "hidden";
  };

  // Sync number input changes back to range slider
  temperaturenum.oninput = () => {
      temprange.value = temperaturenum.value;
      localStorage.setItem("temperature", temperaturenum.value); // Persist
  };
  topknum.oninput = () => {
      topk.value = topknum.value;
      localStorage.setItem("topK", topknum.value); // Persist
  };


  // Model selection change handler
  model.oninput = () => {
    const modelsData = localStorage.getItem("models");
    if (!modelsData) return; // Exit if model data not loaded/stored yet

    try {
        const parsedList = JSON.parse(modelsData);
        // Find the selected model object from the stored list
        const selectedModelData = parsedList.find(m => m.name === model.value);


        if (selectedModelData) {
             console.log("Selected Model Data:", selectedModelData);
            // Update config fields based on selected model's stored data
            // Provide fallbacks if properties are null/undefined in storage
            const defaultTemp = 0.9;
            const defaultTopK = 1; // Or another sensible default like 40 if preferred
            const defaultMaxTokens = 2048; // A common default


            temprange.value = selectedModelData.temperature ?? defaultTemp;
            temperaturenum.value = selectedModelData.temperature ?? defaultTemp;


             // Use model's maxOutputTokens if available, otherwise keep current or a default
             // Only set if the model provides a limit, otherwise leave it potentially blank for user input or API default
            outputlengthdiv.value = selectedModelData.maxOutputTokens ?? (localStorage.getItem("maxOutputTokens") || ""); // Prefer model, then stored, then blank
            outputlengthdiv.placeholder = selectedModelData.maxOutputTokens ? `Max: ${selectedModelData.maxOutputTokens}` : `e.g., ${defaultMaxTokens}`; // Update placeholder
            // Optional: Set max attribute if the model specifies it
             if(selectedModelData.maxOutputTokens) {
                 outputlengthdiv.max = selectedModelData.maxOutputTokens;
             } else {
                 outputlengthdiv.removeAttribute('max'); // Remove max if not specified
             }


            topk.value = selectedModelData.topK ?? defaultTopK;
            topknum.value = selectedModelData.topK ?? defaultTopK;


             // Persist the updated values from the selected model
             localStorage.setItem("temperature", temprange.value);
             localStorage.setItem("maxOutputTokens", outputlengthdiv.value); // Store potentially blank value too
             localStorage.setItem("topK", topk.value);


        } else {
             console.warn("Selected model name not found in stored data:", model.value);
             // Optionally reset fields to defaults or leave them as they are
        }
    } catch (e) {
        console.error("Error parsing models data from localStorage:", e);
    }
  };


  // API Key saving
  apiKey.addEventListener("change", () => { // Use 'change' instead of keydown Enter for better UX
    const newKey = apiKey.value.trim();
    if (newKey) {
        localStorage.setItem("what", newKey);
        console.log("API KEY updated.");
        // Optionally provide feedback to user (e.g., temporary message)
        // Fetch models again if the key changes
        getmodels();
    } else {
        localStorage.removeItem("what");
        console.log("API KEY cleared.");
        model.innerHTML = '<option>Set API Key first</option>'; // Update model list
    }
  });

  // System Prompt saving
  Prompt.addEventListener("change", () => {
    localStorage.setItem("systemPrompt", Prompt.value);
    console.log("System prompt updated.");
  });

  // --- File Handling ---
  let selectedfile = null; // Variable to store the [mime_type, base64_data] array
  fileButton.addEventListener('change', async (event) => {
      const files = event.target.files;
      // Clear previous selection before processing new one
      selectedfile = null;
      filelabel.classList.remove("file-selected"); // Remove visual indicator if any


      try {
          const fileData = await readFile(files); // readFile now returns null or rejects on error
          if (fileData) {
              selectedfile = fileData; // Store the [type, data] array
              console.log(`File "${files[0].name}" processed and ready.`);
              // Add visual indicator (optional)
              filelabel.classList.add("file-selected"); // Example: change background or add icon
              filelabel.title = `File attached: ${files[0].name}`; // Update tooltip
          }
      } catch (error) {
           console.error("Failed to read or process file:", error);
           // Reset the input so the user can try again with the same file if needed
           event.target.value = null; // IMPORTANT: Reset file input value
           alert(`Error processing file: ${error.message}`); // Inform user
           filelabel.classList.remove("file-selected");
           filelabel.title = "Attach File (Image/PDF etc.)"; // Reset tooltip
      }
  });

  // Sync range slider changes to number input
  temprange.oninput = () => {
    temperaturenum.value = temprange.value;
     localStorage.setItem("temperature", temprange.value); // Persist
  };

  topk.oninput = () => {
    topknum.value = topk.value;
     localStorage.setItem("topK", topk.value); // Persist
  };

   // Persist max output tokens on change
   outputlengthdiv.onchange = () => { // Use onchange to save when focus is lost or Enter is pressed
        localStorage.setItem("maxOutputTokens", outputlengthdiv.value);
        console.log("Max Output Tokens saved:", outputlengthdiv.value);
   };


  // --- Chat Input Submission ---
  ChatInput.addEventListener("keypress", (key) => {
    if (key.key === "Enter" && ChatInput.value.trim() !== "") { // Check if Enter key and input not empty
      const userMessage = ChatInput.value.trim();
      sendMessage("You", userMessage); // Display user message

      // Get current settings for the API call
      const currentModel = model.value;
      const currentApiKey = localStorage.getItem("what");
      const currentSystemPrompt = Prompt.value;
      const currentTemperature = parseFloat(temperaturenum.value); // Ensure it's a number
      const currentTopK = parseInt(topknum.value, 10); // Ensure it's an integer
      const currentMaxOutput = parseInt(outputlengthdiv.value, 10) || null; // Parse or null if empty/invalid


       // Validate API key before proceeding
       if (!currentApiKey) {
           sendMessage("System", "Error: API Key is not set. Please set it in settings.");
           return; // Stop if no API key
       }
       // Validate Model selection
       if (!currentModel || currentModel === "Loading models..." || currentModel === "Set API Key first") {
           sendMessage("System", "Error: Please select a valid model in settings.");
           return; // Stop if no valid model selected
       }


      // Call the input function to interact with the API
      input(
        currentModel,
        currentApiKey,
        currentSystemPrompt,
        currentTemperature,
        currentTopK, // Pass Top-K
        currentMaxOutput, // Pass Max Output Tokens
        userMessage,
        selectedfile // Pass the array [mime_type, data] or null
      );

      // Clear input and reset file state after sending
      ChatInput.value = "";
      selectedfile = null; // Reset file variable
      fileButton.value = null; // Reset file input element
      filelabel.classList.remove("file-selected"); // Remove visual indicator
       filelabel.title = "Attach File (Image/PDF etc.)"; // Reset tooltip
    }
  });

  // --- Styles ---
  stylesheet.innerHTML = `
    :host { /* Style the shadow host element itself */
      /* Basic appearance */
      background-color: #3d425c; /* Dark blue-gray background */
      color: #e0e0e0; /* Light text color for contrast */
      border: 1px solid #5a617c; /* Slightly lighter border */
      border-radius: 8px; /* Slightly rounded corners */


      /* Positioning and Size */
      position: fixed; /* Fixed position relative to viewport */
      right: 10px; /* Positioned at the bottom-right */
      bottom: 10px;
      width: 350px; /* Default width */
      height: 450px; /* Default height */
      min-width: 300px; /* Minimum size */
      min-height: 250px; /* Minimum size */
      max-width: 90vw; /* Max size relative to viewport width */
      max-height: 80vh;/* Max size relative to viewport height */


      /* Layout and Overflow */
      display: flex;
      flex-direction: column;
      overflow: hidden; /* Hide overflow by default, allow resize */
      resize: both; /* Allow user resizing */
      z-index: 10000; /* Ensure it's on top */
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* Add subtle shadow */
      font-family: sans-serif; /* Use a common sans-serif font */
    }

    /* Drag Handle */
    .buttons-container {
      background-color: #4e4e4e; /* Slightly darker gray handle */
      width: 100%;
      height: 25px; /* Make handle smaller */
      flex-shrink: 0; /* Prevent handle from shrinking */
      cursor: grab; /* Indicate draggable */
      border-bottom: 1px solid #5a617c; /* Separator line */
      display: flex; /* Added for potential content alignment */
      align-items: center; /* Center content vertically if any */
      justify-content: center; /* Center content horizontally */
       /* Optional: add subtle visual cues for dragging */
       background-image: linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.1));
    }


     .buttons-container:active {
       cursor: grabbing; /* Cursor when dragging */
     }


    /* Chat History Area */
    .chat-container {
      flex-grow: 1; /* Allow chat area to fill available space */
      background-color: #3d425c; /* Match host background */
      overflow-y: auto; /* Enable vertical scrolling */
      overflow-x: hidden; /* Hide horizontal overflow */
      padding: 10px;
      scrollbar-width: thin; /* Firefox scrollbar style */
      scrollbar-color: #5a617c #3d425c; /* Scrollbar thumb and track color */
    }
     /* Webkit (Chrome, Safari, Edge) scrollbar styles */
    .chat-container::-webkit-scrollbar {
        width: 8px; /* Width of the scrollbar */
    }
    .chat-container::-webkit-scrollbar-track {
        background: #3d425c; /* Track color */
        border-radius: 4px;
    }
    .chat-container::-webkit-scrollbar-thumb {
        background-color: #5a617c; /* Thumb color */
        border-radius: 4px;
        border: 2px solid #3d425c; /* Creates padding around thumb */
    }
     .chat-container::-webkit-scrollbar-thumb:hover {
        background-color: #6b7394; /* Slightly lighter thumb on hover */
     }


    /* Individual Messages */
    .userMessage {
      color: #ffffff; /* White text for messages */
      background-color: #4a4e69; /* Slightly different background for messages */
      border-radius: 10px;
      padding: 8px 12px; /* Padding inside message bubble */
      margin-bottom: 10px; /* Space between messages */
      max-width: 90%; /* Prevent messages from taking full width */
      word-wrap: break-word; /* Break long words */
      line-height: 1.4; /* Improve readability */
      /* Basic Markdown-like styling */
      white-space: pre-wrap; /* Preserve whitespace and wrap lines */
    }
     .userMessage strong { /* Style the user/bot name */
         font-weight: bold;
         color: #9a8c98; /* Different color for the name */
         margin-right: 5px;
     }
     /* Specific style for the "Bot is thinking" message */
    .botThinking {
        font-style: italic;
        color: #aaa; /* Dim color */
    }


    /* Input Area at the Bottom */
    .me-container {
      height: auto; /* Adjust height based on content */
      min-height: 50px; /* Minimum height */
      background-color: #3d425c; /* Match host background */
      padding: 5px 10px; /* Padding around the input area */
      border-top: 1px solid #5a617c; /* Separator line */
      flex-shrink: 0; /* Prevent shrinking */
    }

    .menu-container-buttons {
      background-color: transparent; /* Remove gray background */
      display: flex;
      align-items: center; /* Align items vertically */
      gap: 8px; /* Space between buttons and input */
      width: 100%; /* Take full width */
      border: none; /* Remove tan border */
      border-radius: 0; /* Remove border-radius */
      padding: 0; /* Remove padding */
    }

    /* Chat Input Field */
    .chat-input {
      flex-grow: 1; /* Allow input to take remaining space */
      height: 36px; /* Set fixed height */
      outline: none;
      padding: 0 10px; /* Horizontal padding */
      border: 1px solid #5a617c; /* Border matching theme */
      background-color: #2f334d; /* Darker input background */
      color: #e0e0e0; /* Light text color */
      border-radius: 18px; /* Pill shape */
      font-size: 14px;
    }
    .chat-input:focus {
        border-color: #7b88b1; /* Highlight border on focus */
        box-shadow: 0 0 0 2px rgba(123, 136, 177, 0.3); /* Subtle focus ring */
    }


    /* Action Buttons (Settings, File) */
    .settings,
    .filess-label {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 22px; /* Larger icons */
      border: none;
      background-color: transparent;
      color: #a9b1d6; /* Icon color */
      cursor: pointer;
      padding: 5px; /* Add padding to increase clickable area */
      border-radius: 50%; /* Make button area circular */
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .settings:hover,
    .filess-label:hover {
      background-color: rgba(255, 255, 255, 0.1); /* Subtle hover background */
      color: #c0caf5; /* Brighter icon on hover */
    }
    .settings:active,
    .filess-label:active {
      background-color: rgba(255, 255, 255, 0.2); /* Slightly darker on click */
    }


     /* Visual indicator for when a file is selected */
     .filess-label.file-selected {
         color: #86e1a8; /* Greenish color when selected */
         position: relative; /* Needed for pseudo-element */
     }
      /* Optional: add a small dot */
     .filess-label.file-selected::after {
         content: '';
         position: absolute;
         top: 4px;
         right: 4px;
         width: 6px;
         height: 6px;
         background-color: #f7768e; /* Contrasting dot color */
         border-radius: 50%;
     }


    /* Hide the actual file input */
    .filess {
      display: none;
    }

    /* Settings Page Overlay */
    .settings-page {
      position: absolute;
      top: 25px; /* Position below the drag handle */
      left: 0;
      right: 0;
      bottom: 0; /* Fill remaining space */
      background-color: rgba(40, 42, 54, 0.95); /* Slightly transparent dark background */
      backdrop-filter: blur(4px); /* Blur background behind */
      visibility: hidden; /* Initially hidden */
      opacity: 0; /* Start fully transparent */
      transition: opacity 0.3s ease, visibility 0.3s ease; /* Smooth fade */
      overflow-y: auto; /* Allow scrolling within settings */
      z-index: 10; /* Ensure settings are above chat */
      scrollbar-width: thin;
      scrollbar-color: #5a617c #282a36;
    }
    /* Show settings when visible */
    .settings-page[style*="visibility: visible"] {
        visibility: visible;
        opacity: 1;
    }
    .settings-page::-webkit-scrollbar { width: 8px; }
    .settings-page::-webkit-scrollbar-track { background: #282a36; border-radius: 4px; }
    .settings-page::-webkit-scrollbar-thumb { background-color: #5a617c; border-radius: 4px; border: 2px solid #282a36; }
    .settings-page::-webkit-scrollbar-thumb:hover { background-color: #6b7394; }


    /* Container within Settings Page */
    .settings-container {
      display: flex;
      flex-direction: column;
      gap: 15px; /* Space between settings items */
      padding: 20px; /* Padding inside settings */
      color: #f8f8f2; /* Text color in settings */
    }


    /* Input fields and Select in Settings */
    .settings-container input[type="text"],
    .settings-container input[type="password"],
    .settings-container input[type="number"],
    .settings-container textarea,
    .settings-container select {
      width: 100%; /* Make inputs take full width */
      padding: 8px 10px;
      background-color: #2f334d;
      border: 1px solid #5a617c;
      color: #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box; /* Include padding/border in width */
    }
    .settings-container input:focus,
    .settings-container textarea:focus,
    .settings-container select:focus {
        outline: none;
        border-color: #7b88b1;
        box-shadow: 0 0 0 2px rgba(123, 136, 177, 0.3);
    }
    .settings-container textarea {
        resize: vertical; /* Allow vertical resize */
        min-height: 60px;
    }
    .settings-container select {
        cursor: pointer;
    }


    /* Styling for Range Slider sections */
    .rangeslides {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap; /* Allow wrapping on smaller widths */
    }
    .opttext { /* Label for sliders */
      flex-basis: 100%; /* Label takes full width initially */
      margin-bottom: 5px; /* Space below label */
      color: #c0caf5; /* Label color */
      font-size: 13px;
      font-weight: bold;
       text-align: left;
    }
     @media (min-width: 400px) { /* Adjust layout on wider settings panel */
         .opttext { flex-basis: auto; flex-shrink: 0; margin-bottom: 0; }
         .rangeslides input[type="range"] { flex-grow: 1; }
     }


     .temprange, /* Class for temp range slider */
     .settings-container input[type="range"] { /* General range slider style */
       flex-grow: 1; /* Allow slider to fill space */
       height: 8px;
       cursor: pointer;
       appearance: none;
       background: linear-gradient(to right, #8f9aae, #5a617c); /* Gradient background */
       border-radius: 4px;
       outline: none;
       opacity: 0.7;
       transition: opacity .2s;
     }
     .temprange:hover,
     .settings-container input[type="range"]:hover {
       opacity: 1;
     }
     /* Range slider thumb */
     .temprange::-webkit-slider-thumb,
     .settings-container input[type="range"]::-webkit-slider-thumb {
       appearance: none;
       width: 16px;
       height: 16px;
       background: #c0caf5; /* Thumb color */
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


    /* Number input paired with slider */
    .num-input {
        width: 70px; /* Fixed width for number input */
        text-align: center;
        flex-shrink: 0; /* Prevent shrinking */
         /* Hide spinner buttons */
         appearance: textfield; /* Firefox */
    }
     .num-input::-webkit-outer-spin-button,
     .num-input::-webkit-inner-spin-button {
       -webkit-appearance: none;
       margin: 0;
     }


    /* Close Button for Settings */
    .close-button {
      padding: 10px 15px;
      background-color: #7aa2f7; /* Blueish button */
      color: #1a1b26; /* Dark text on button */
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.2s ease;
      margin-top: 10px; /* Space above close button */
       align-self: flex-end; /* Align button to the right */
    }
    .close-button:hover {
      background-color: #8cb5f9;
    }


     /* Markdown Code Blocks */
     .userMessage code {
       background-color: #2a2f41; /* Darker background for code */
       color: #c0caf5; /* Code text color */
       padding: 2px 6px; /* Small padding */
       border-radius: 4px;
       font-family: 'Courier New', Courier, monospace; /* Monospace font */
       font-size: 0.9em; /* Slightly smaller font */
     }
     .userMessage pre {
       background-color: #2a2f41;
       color: #c0caf5;
       padding: 10px;
       border-radius: 5px;
       overflow-x: auto; /* Allow horizontal scrolling for long code */
       margin: 10px 0; /* Spacing around code blocks */
       font-family: 'Courier New', Courier, monospace;
       white-space: pre; /* Preserve whitespace strictly */
     }
     .userMessage pre code {
         padding: 0; /* No extra padding for code inside pre */
         background-color: transparent; /* Inherit pre background */
         white-space: inherit; /* Inherit pre whitespace handling */
     }


  `;

  // Initial call to fetch models if API key exists
  if (localStorage.getItem("what")) {
      getmodels();
  } else {
      model.innerHTML = '<option disabled selected>Set API Key in Settings</option>';
  }


}


async function input(
    modelName, apiKey, systemPrompt, temperature, topK, maxOutputTokens,
    userInput, selectedFileData // Receives array [mime_type, data] or null
    ) {
  const thinkElement = sendMessagepro(); // Show "Bot is thinking..."


  try {
    // --- Construct Request Body ---
    const requestBody = {
        contents: [{
            role: "user", // Specify the role
            parts: [{ text: userInput }]
        }],
        generationConfig: {
            // Only include parameters if they have valid values
            ...(temperature !== null && !isNaN(temperature) && { temperature: temperature }),
            ...(topK !== null && !isNaN(topK) && topK >= 1 && { topK: topK }), // Top-K must be >= 1
            ...(maxOutputTokens !== null && !isNaN(maxOutputTokens) && maxOutputTokens > 0 && { maxOutputTokens: maxOutputTokens })
        },
        // Include system instruction only if provided
        ...(systemPrompt && systemPrompt.trim() !== "" && {
             systemInstruction: {
                 role: "system", // Or adjust if API expects different structure
                 parts: [{ text: systemPrompt.trim() }]
             }
         })
    };


     // --- Add File Data if Present ---
     if (selectedFileData && Array.isArray(selectedFileData) && selectedFileData.length === 2) {
         const [mimeType, base64Data] = selectedFileData;


          // Check if mimeType and base64Data are valid strings
          if (typeof mimeType === 'string' && mimeType.includes('/') && typeof base64Data === 'string' && base64Data.length > 0) {
              const filePart = {
                  inlineData: { // Corrected structure key
                      mimeType: mimeType,
                      data: base64Data
                  }
              };
              // Add the file part to the *first* content item's parts array
              requestBody.contents[0].parts.push(filePart);
              console.log("File data added to request:", mimeType);
          } else {
               console.warn("Invalid file data format received, skipping file.", selectedFileData);
               // Optionally inform the user that the file couldn't be processed
               sendMessage("System", "Warning: Could not process the attached file data.");
          }
      } else if (selectedFileData) {
          // Log if selectedFileData was truthy but not in the expected format
           console.warn("Received selectedFile data but it was not a valid [type, data] array:", selectedFileData);
           sendMessage("System", "Warning: Invalid file data detected, file not sent.");
      }


    console.log("API Request Body:", JSON.stringify(requestBody, null, 2)); // Pretty print JSON


    // --- Make API Call ---
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );

    // --- Handle API Response ---
    removeBotThinking(thinkElement); // Remove "thinking" message


    if (!response.ok) {
      // Try to get error details from the response body
      let errorDetails = `API request failed with status ${response.status} ${response.statusText}`;
      try {
          const errorData = await response.json();
           // Check for standard Google API error format
           if (errorData.error && errorData.error.message) {
              errorDetails += `\nDetails: ${errorData.error.message}`;
           } else {
              errorDetails += `\nResponse: ${JSON.stringify(errorData)}`; // Fallback to raw JSON
           }


      } catch (e) {
          // If parsing error response fails, just use the status text
          console.error("Could not parse error response JSON:", e);
      }
      throw new Error(errorDetails); // Throw error to be caught below
    }


    const data = await response.json();


    // Process successful response
    if (data && data.candidates && data.candidates.length > 0 &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0 && data.candidates[0].content.parts[0].text)
    {
        let botText = data.candidates[0].content.parts[0].text;


         // Optional: Render Markdown using marked.js if available
         if (window.marked) {
             try {
                 // Configure marked for safety and features (breaks, GFM)
                 marked.setOptions({
                   breaks: true, // Convert single line breaks to <br>
                   gfm: true,    // Enable GitHub Flavored Markdown
                   // Consider adding a sanitizer here if rendering complex user-generated content
                 });
                 botText = marked.parse(botText); // Convert Markdown to HTML
                 // Send as HTML (ensure sendMessage handles HTML correctly or sanitize first)
                 // For now, assuming sendMessage handles basic HTML or we modify it
                  const botMessageElement = sendMessage("AI", botText); // Send empty message first
                  if(botMessageElement) { // Check if element was created
                     // Find the text part and set innerHTML (safer if structure is fixed)
                     const textNode = botMessageElement.childNodes[botMessageElement.childNodes.length - 1]; // Assume text is last node
                     if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                         textNode.nodeValue = ' '; // Add space after strong tag
                         botMessageElement.insertAdjacentHTML('beforeend', botText); // Append rendered HTML
                     } else {
                         // Fallback if structure changes or no text node found
                         botMessageElement.innerHTML = `<strong>AI:</strong> ${botText}`;
                     }
                  }


             } catch (markdownError) {
                 console.error("Markdown parsing error:", markdownError);
                  sendMessage("AI", data.candidates[0].content.parts[0].text); // Fallback to raw text
             }
         } else {
              sendMessage("AI", botText); // Send raw text if marked.js not loaded
         }


    } else if (data && data.promptFeedback && data.promptFeedback.blockReason) {
         // Handle blocked prompts
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
    removeBotThinking(thinkElement); // Ensure thinking message is removed on error
    // Display a user-friendly error message
    sendMessage("AI", `❌ **Error:** ${error.message}`); // Use error.message which contains status and details
  }
}


// Initialize the application
init();


// Fetch models after initialization (or based on API key presence)
// getmodels(); // Called inside init now based on key presence
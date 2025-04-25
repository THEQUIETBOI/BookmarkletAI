
function test(){
    const dat = {'contents': [{
        "parts": [
            {"text": "HI can you generate an image of a pig flyi"}
    ]
    }],
    'generationConfig': {"responseModalities":["TEXT", "IMAGE"]}
}
    const key = "AIzaSyCrkRWSwKB0QgTu20CwQqauk9310Tvm9-U";
    fetch ("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key="+ key, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(dat)
    })
    .then(response => response.json())
    .then(data => {
const img = data.candidates[0].content.parts[0].inlineData.data.toString("")
const show = document.createElement('img');
show.src = "data:image/png;base64," + img;
document.body.appendChild(show);
    })
}
test()
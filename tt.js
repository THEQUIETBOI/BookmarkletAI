const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-exp:embedContent?key=`+localStorage.getItem('what');

const data = {
    instances: [
        {
            prompt: "Robot holding a red skateboard"
        }
    ],
    parameters: {
        sampleCount: 4
    }
};

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    console.log('Response data:', data);
    // Handle the response data here
})
.catch(error => {
    console.error('Error:', error);
    // Handle errors here
});

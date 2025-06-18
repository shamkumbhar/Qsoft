// Make an API call using the base URL
fetch(`${apiBaseURL}/api/greet`)
    .then(response => response.json())
    .then(data => {
        console.log(data); // Output API response
        document.getElementById("greeting").innerText = data.message;
    })
    .catch(error => console.error("Error:", error));
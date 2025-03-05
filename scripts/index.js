document.querySelector(".search").addEventListener("click", function(event) {
    locationEntered = document.getElementById("location").value.trim();
    console.log(locationEntered);
    if (locationEntered === "") {
        alert("Please enter a city name!");
    }
    else {
        localStorage.setItem("location", locationEntered);
        window.location.href = "./main.html";
    }
});

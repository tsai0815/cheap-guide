let map, marker;
let markerPosition = { lat: 25, lng: 121 };
let oldImage = null;

// Get the index of the item being edited (if any)
const editIndex = localStorage.getItem('editIndex');
console.log("editIndex: ", editIndex);
let items = JSON.parse(localStorage.getItem('items')) || [];

// Load Google Maps script
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDa2zggbUAtegTnnP6cU6Qw7AUc-1RhZnA&callback=initMap`;
script.async = true;
document.head.appendChild(script);

// Google Maps Initialization
function initMap() {
    // Pre-fill form if editing
    if (editIndex !== "null") {
        const item = items[editIndex];
        document.getElementById('name').value = item.name;
        document.getElementById('quantity').value = item.quantity;
        document.getElementById('unit').value = item.unit;
        document.getElementById('description').value = item.description;
        document.getElementById('latitude').value = item.latitude;
        document.getElementById('longitude').value = item.longitude;
        oldImage = item.image;
        markerPosition = { lat: item.latitude, lng: item.longitude };
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            console.log('gps not supported');
        }
    }

    map = new google.maps.Map(document.getElementById('map'), {
        center: markerPosition,
        zoom: 8
    });

    marker = new google.maps.Marker({
        position: markerPosition,
        map: map,
        draggable: true
    });

    // Update latitude and longitude on marker drag
    google.maps.event.addListener(marker, 'dragend', function () {
        document.getElementById('latitude').value = marker.getPosition().lat();
        document.getElementById('longitude').value = marker.getPosition().lng();
    });
}

function success(position) {
    console.log(position.coords.latitude + ', ' + position.coords.longitude);
    markerPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
}

function error(msg) {
    console.log("gps failed");
}

function parseDateToMDTime(date) {
    // Ensure the input is a Date object
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    // Extract month, day, hours, and minutes
    const month = date.getMonth() + 1; // Months are 0-based
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0'); // Pad single-digit hours
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Pad single-digit minutes

    // Return formatted date string
    return `${month}/${day} ${hours}:${minutes}`;
}


// Attach event listener to the submit button
document.getElementById('submit-item-button').addEventListener('click', function (event) {
    const newItem = {
        name: document.getElementById('name').value,
        quantity: document.getElementById('quantity').value,
        unit: document.getElementById('unit').value,
        description: document.getElementById('description').value,
        latitude: marker.getPosition().lat(),
        longitude: marker.getPosition().lng(),
        lastEditTime: parseDateToMDTime(new Date()),
        image: '' // Placeholder for image data
    };

    // Handle image upload
    const imageInput = document.getElementById('image').files[0];
    if (imageInput) {
        const reader = new FileReader();
        reader.onload = function (e) {
            newItem.image = e.target.result; // Store image as base64
            saveItem(newItem); // Save the item after image processing
        };
        reader.readAsDataURL(imageInput); // Convert image to base64
    } else {
        if (oldImage !== null) {
            newItem.image = oldImage;
        }
        saveItem(newItem); // Save item without image
    }
});

// Save item and redirect
function saveItem(item) {
    const editIndex = localStorage.getItem('editIndex');
    let items = JSON.parse(localStorage.getItem('items')) || [];

    if (editIndex !== "null") {
        items[editIndex] = item; // Update the existing item
    } else {
        items.push(item); // Add a new item
    }

    localStorage.setItem('items', JSON.stringify(items)); // Save items back to localStorage

    // Redirect to myFoods.html after saving
    window.location.href = 'myFoodList.html';
}


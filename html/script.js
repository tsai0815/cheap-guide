let map, marker;

// Google Maps Initialization
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert('geolocation not supported');
    }
    
    const initialPosition = { lat: -34.397, lng: 150.644 }; // Default location
    map = new google.maps.Map(document.getElementById('map'), {
        center: initialPosition,
        zoom: 8
    });

    marker = new google.maps.Marker({
        position: initialPosition,
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
    alert(position.coords.latitude + ', ' + position.coords.longitude);
}

function error(msg) {
    alert('error: ' + msg);
}

// Load Google Maps script
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDa2zggbUAtegTnnP6cU6Qw7AUc-1RhZnA&callback=initMap`;
script.async = true;
document.head.appendChild(script);

// Get the index of the item being edited (if any)
const editIndex = localStorage.getItem('editIndex');
let items = JSON.parse(localStorage.getItem('items')) || [];

// Pre-fill form if editing
if (editIndex !== null) {
    const item = items[editIndex];
    document.getElementById('name').value = item.name;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('unit').value = item.unit;
    document.getElementById('description').value = item.description;
    document.getElementById('latitude').value = item.latitude;
    document.getElementById('longitude').value = item.longitude;
    marker.setPosition({ lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) });
    map.setCenter(marker.getPosition());
    document.getElementById('form-title').textContent = "Edit Food";
}

// Attach event listener to the submit button
document.getElementById('submit-item-button').addEventListener('click', function (event) {
    const newItem = {
        name: document.getElementById('name').value,
        quantity: document.getElementById('quantity').value,
        unit: document.getElementById('unit').value,
        description: document.getElementById('description').value,
        latitude: document.getElementById('latitude').value,
        longitude: document.getElementById('longitude').value,
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
        saveItem(newItem); // Save item without image
    }
});

// Save item and redirect
function saveItem(item) {
    const editIndex = localStorage.getItem('editIndex');
    let items = JSON.parse(localStorage.getItem('items')) || [];

    if (editIndex !== null) {
        items[editIndex] = item; // Update the existing item
    } else {
        items.push(item); // Add a new item
    }

    localStorage.setItem('items', JSON.stringify(items)); // Save items back to localStorage

    // Redirect to myFoods.html after saving
    window.location.href = 'myFoodList.html';
}


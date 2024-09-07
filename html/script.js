const itemList = document.getElementById('item-list');
const addItemButton = document.getElementById('add-item-button');
const itemListPage = document.getElementById('item-list-page');
const itemFormPage = document.getElementById('item-form-page');
const formTitle = document.getElementById('form-title');
const itemForm = document.getElementById('item-form');

// Load items from localStorage
let items = JSON.parse(localStorage.getItem('items')) || [];

// Function to save items to localStorage
function saveItems() {
    localStorage.setItem('items', JSON.stringify(items));
}

// Function to display the list of items
function displayItems() {
    itemList.innerHTML = ''; // Clear the list
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.quantity} ${item.unit}`;
        li.addEventListener('click', () => editItem(index));
        itemList.appendChild(li);
    });
}

// Function to add a new item
addItemButton.addEventListener('click', () => {
    formTitle.textContent = "Add New Item";
    itemForm.reset();
    itemFormPage.style.display = 'block';
    itemListPage.style.display = 'none';
});

// Function to handle form submission
itemForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newItem = {
        name: document.getElementById('food-name').value,
        latitude: parseFloat(document.getElementById('latitude').value),
        longitude: parseFloat(document.getElementById('longitude').value),
        quantity: parseInt(document.getElementById('quantity').value, 10),
        unit: document.getElementById('unit').value,
        description: document.getElementById('description').value
    };

    // If editing, update the item, otherwise add a new item
    const editIndex = itemForm.dataset.editIndex;
    if (editIndex) {
        items[editIndex] = newItem;
        delete itemForm.dataset.editIndex; // Clear edit index after saving
    } else {
        items.push(newItem);
    }

    saveItems(); // Save the updated items to localStorage
    itemFormPage.style.display = 'none';
    itemListPage.style.display = 'block';
    displayItems();
});

// Function to edit an existing item
function editItem(index) {
    formTitle.textContent = "Edit Item";
    const item = items[index];
    document.getElementById('food-name').value = item.name;
    document.getElementById('latitude').value = item.latitude;
    document.getElementById('longitude').value = item.longitude;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('unit').value = item.unit;
    document.getElementById('description').value = item.description;
    
    itemForm.dataset.editIndex = index; // Store the index being edited

    itemFormPage.style.display = 'block';
    itemListPage.style.display = 'none';
}

// Initial display of items when the page loads
displayItems();

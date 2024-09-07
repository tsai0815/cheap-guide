localStorage.setItem('editIndex', "null");

const itemList = document.getElementById('item-list');

// Load items from localStorage
const items = JSON.parse(localStorage.getItem('items')) || [];

// Function to display items
function displayItems() {
    itemList.innerHTML = '';
    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.innerHTML = `
        <div class="card"; style="cursor: pointer;" onclick="editItem(${index})"> 
        <div class="offer-badge">數量: ${item.quantity} ${item.unit}</div>
        <img src="${item.image}" onerror="this.onerror=null"; class="food-image";>
        <div class="card-content" >
            <div class="title-section">
                <span class="title">${item.name}</span>
            </div>
            <div class="details">
                <div class="left-content">
                    <p>${item.addressName}</p>
                    <p>最後更新 ${item.lastEditTime}</p>
                </div>
                <button class="delete-button" onclick="deleteItem(${index}); event.stopPropagation();">DELETE</button> <!-- Delete Button -->
            </div>
        </div>
        </div>
    `;
        itemList.appendChild(card);
    });
}

// Edit item
function editItem(index) {
    localStorage.setItem('editIndex', index); // Store the index of the item being edited
    window.location.href = 'foodForm.html';
}

displayItems();
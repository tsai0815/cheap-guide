localStorage.setItem('editIndex', null);

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
        <div class="offer-badge">500m</div>
        <img src="${item.image}" onerror="this.onerror=null"; class="food-image";>
        <div class="card-content" >
            <div class="title-section">
                <span class="title">${item.name}</span>
            </div>
            <div class="details">
                <div class="left-content">
                    <p>台灣大學男一舍</p>
                    <p>發布時間 9/7 18:06</p>
                </div>
                <span class="category">數量: ${item.quantity} ${item.unit}</span>
            </div>
        </div>
        </div>
    `;
        itemList.appendChild(card);
    });
}

// // Redirect to foodForum.html when adding a new item
// document.getElementById('add-item').addEventListener('click', () => {
//     localStorage.removeItem('editIndex');
//     window.location.href = 'foodForm.html';
// });

// Edit item
function editItem(index) {
    localStorage.setItem('editIndex', index); // Store the index of the item being edited
    window.location.href = 'foodForm.html';
}

displayItems();
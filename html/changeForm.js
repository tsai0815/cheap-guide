function addNewForm() {
    localStorage.setItem('editIndex', "null");
    window.location.href = 'foodForm.html';
}

function deleteItem(index) {
    let items = JSON.parse(localStorage.getItem('items')) || [];
    console.log(items);
    popItemAtIndex(items, index);
    console.log(items);
    localStorage.setItem('items', JSON.stringify(items));
    window.location.href = 'myFoodList.html';
}

function popItemAtIndex(array, index) {
    if (index < 0 || index >= array.length) {
        console.log("wrong index");
        return;
    }

    // Remove the item at the specified index
    array.splice(index, 1);
}
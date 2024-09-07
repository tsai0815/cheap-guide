let map;
let geocoder;
let markers = [];
let userMarker;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 25.0330, lng: 121.5654 }, // 台北市的初始位置
    zoom: 13,
  });
  geocoder = new google.maps.Geocoder();
  addMarkersFromLocalStorage();
  getUserLocation();
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        // 添加用戶位置標記
        userMarker = new google.maps.Marker({
          position: userLocation,
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          },
          title: "您的位置",
        });

        // 將地圖中心設置為用戶位置
        map.setCenter(userLocation);

        // 計算並更新所有標記點與用戶位置的距離
        updateDistances(userLocation);
      },
      () => {
        handleLocationError(true, map.getCenter());
      }
    );
  } else {
    // 瀏覽器不支持地理位置
    handleLocationError(false, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, pos) {
  console.error(browserHasGeolocation
    ? "Error: The Geolocation service failed."
    : "Error: Your browser doesn't support geolocation.");
}

function updateDistances(userLocation) {
  markers.forEach(markerInfo => {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(userLocation),
      markerInfo.position
    );
    markerInfo.distance = Math.round(distance); // 四捨五入到整數米
  });

  // 更新顯示的信息
  updateMarkerList();
}

function addMarkersFromLocalStorage() {
  const items = JSON.parse(localStorage.getItem('items')) || [];

  items.forEach(item => {
    const { latitude, longitude, name, quantity, description, image } = item;

    if (!latitude || !longitude) {
      console.error('Missing latitude or longitude for item:', item);
      return;
    }

    // 使用經緯度創建標記
    const marker = new google.maps.Marker({
      position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
      map: map,
    });

    const markerInfo = {
      position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
      name: name,
      quantity: quantity,
      description: description,
      imageUrl: image || 'https://via.placeholder.com/150', // 如果沒有圖片則使用佔位符
      distance: 0 // 初始距離設為0
    };

    markers.push(markerInfo);

    // 添加標記點的點擊事件
    marker.addListener('click', () => {
      showInfoPanel(name, quantity, description, markerInfo.imageUrl, markerInfo.distance);
    });

    // 更新所有標記點與用戶位置的距離
    if (userMarker) {
      updateDistances(userMarker.getPosition());
    }
  });
}



function showInfoPanel(name, quantity, description, imageUrl, distance) {
  document.getElementById('place-name').textContent = name;
  document.getElementById('place-quantity').textContent = '數量: ' + quantity;
  document.getElementById('place-description').textContent = description;
  document.getElementById('place-image').src = imageUrl;
  document.getElementById('place-distance').textContent = '距離: ' + distance + ' 公尺';
  document.getElementById('info-panel').style.display = 'block';
}

function showNearbyInfo() {
  const nearbyInfo = document.getElementById('nearby-info');
  const nearbyInfoContent = document.getElementById('nearby-info-content');
  const goButton = document.getElementById('go-button');
  const cancelButton = document.getElementById('cancel-button');
  
  // 按距離排序所有標記點
  markers.sort((a, b) => a.distance - b.distance);

  // 清空之前的內容
  nearbyInfoContent.innerHTML = '';

  // 顯示所有標記點
  markers.forEach(point => {
    const itemElement = document.createElement('div');
    itemElement.className = 'info-item';
    itemElement.innerHTML = `
      <img class="info-item-image" src="${point.imageUrl}" alt="${point.name}">
      <div class="info-item-text">
        <h3>${point.name}</h3>
        <p>數量: ${point.quantity}</p>
        <p>${point.description}</p>
        <p>距離: ${point.distance} 公尺</p>
      </div>
    `;
    nearbyInfoContent.appendChild(itemElement);
  });

  nearbyInfo.style.display = 'flex';
  goButton.style.display = 'none';
  cancelButton.style.display = 'block';
}

function hideNearbyInfo() {
  const nearbyInfo = document.getElementById('nearby-info');
  const goButton = document.getElementById('go-button');
  const cancelButton = document.getElementById('cancel-button');

  nearbyInfo.style.display = 'none';
  goButton.style.display = 'block';
  cancelButton.style.display = 'none';
}

function addMarkerFromInput() {
  const address = document.getElementById('address').value;
  const name = document.getElementById('name').value;
  const quantity = document.getElementById('quantity').value;
  const description = document.getElementById('description').value;
  const imageFile = document.getElementById('image').files[0];

  if (!imageFile) {
    alert('請選擇一張圖片');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const imageUrl = e.target.result;
    geocoder.geocode({ 'address': address }, function(results, status) {
      if (status === 'OK') {
        const marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
        });

        const markerInfo = {
          position: results[0].geometry.location,
          name: name,
          quantity: quantity,
          description: description,
          imageUrl: imageUrl,
          distance: 0 // 初始距離設為0
        };

        markers.push(markerInfo);

        marker.addListener('click', () => {
          showInfoPanel(name, quantity, description, imageUrl, markerInfo.distance);
        });

        map.setCenter(results[0].geometry.location);

        if (userMarker) {
          updateDistances(userMarker.getPosition());
        }
      } else {
        alert('地址轉換失敗：' + status);
      }
    });
  };
  reader.readAsDataURL(imageFile);
}


// map interactions
document.addEventListener('DOMContentLoaded', function() {
    const map = document.getElementById('map');
    const mapImage = document.getElementById('map-image');
    const slideover = document.getElementById('slideover');
    const driveButton = document.getElementById('drivemode');
    const bikeButton = document.getElementById('bikemode');
    const walkButton = document.getElementById('walkmode');
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    let scale = 1;

    function initializeMap() {
        const containerWidth = map.clientWidth;
        const containerHeight = map.clientHeight;
        const imageWidth = mapImage.naturalWidth;
        const imageHeight = mapImage.naturalHeight;

        scale = Math.max(containerWidth / imageWidth, containerHeight / imageHeight);
        updateMapPosition();
    }

    mapImage.onload = initializeMap;

    map.addEventListener('mousedown', startDrag);
    map.addEventListener('mousemove', drag);
    map.addEventListener('mouseup', endDrag);
    map.addEventListener('mouseleave', endDrag);
    map.addEventListener('wheel', zoom);

    function startDrag(e) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        map.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateMapPosition();
    }

    function endDrag() {
        isDragging = false;
        map.style.cursor = 'grab';
    }

    function zoom(e) {
        e.preventDefault();
        const zoomIntensity = 0.05; 
        const delta = e.deltaY > 0 ? -zoomIntensity : zoomIntensity;
        scale += delta;
        scale = Math.max(0.1, Math.min(scale, 4));
    
        const rect = map.getBoundingClientRect();
        const slideOverHeight = slideover.clientHeight;
        const offset = slideOverHeight / 2;
        
        const mouseX = e.clientX - rect.left;
        const mouseY = (e.clientY - rect.top - offset);
    
        translateX = mouseX - (mouseX - translateX) * (1 + delta);
        translateY = (mouseY - (mouseY - translateY) * (1 + delta));
    
        updateMapPosition();
    }

    function updateMapPosition() {
        const slideOverHeight = slideover.clientHeight;
        const offset = slideOverHeight / 2;
        mapImage.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY - offset}px)) scale(${scale})`;
    }

    driveButton.addEventListener('click', function() {
        driveButton.className = 'layeroption layerselected';
        bikeButton.className = 'layeroption';
        walkButton.className = 'layeroption';
        mapImage.src = 'images/map/driveview.png';
        initializeMap();
        updateMapPosition();
    });

    bikeButton.addEventListener('click', function() {
        driveButton.className = 'layeroption';
        bikeButton.className = 'layeroption layerselected';
        walkButton.className = 'layeroption';
        mapImage.src = 'images/map/bikeview.png';
        initializeMap();
        updateMapPosition();
    });

    walkButton.addEventListener('click', function() {
        driveButton.className = 'layeroption';
        bikeButton.className = 'layeroption';
        walkButton.className = 'layeroption layerselected';
        mapImage.classList.toggle('walklayer');
        mapImage.src = 'images/map/walkview.png';
        initializeMap();
        updateMapPosition();
    });
});

// slideover
document.addEventListener('DOMContentLoaded', function() {
    const slide = document.getElementById('slide');
    const slideover = document.getElementById('slideover');
    const searchInput = document.getElementById('search');
    const timeInput = document.getElementById('time');
    let currentSlideover = 'low';
    let startY, moveY;

    function expandSlideover() {
        slideover.style.height = '90vh';
        currentSlideover = 'high';
    }

    function collapseSlideover() {
        slideover.style.height = '30vh';
        currentSlideover = 'low';
    }

    // Touch events for swiping
    slideover.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });

    slideover.addEventListener('touchmove', function(e) {
        moveY = e.touches[0].clientY;
        const diff = startY - moveY;

        if (diff > 50 && currentSlideover === 'low') {
            expandSlideover();
        } else if (diff < -50 && currentSlideover === 'high') {
            collapseSlideover();
        }
    });

    // Expand slideover when user starts typing in search
    searchInput.addEventListener('focus', expandSlideover);

    // Collapse slideover when user taps on map
    document.getElementById('map').addEventListener('click', collapseSlideover);

    // Button click to toggle slideover
    slide.addEventListener('click', function() {
        if (currentSlideover === 'low') {
            expandSlideover();
        } else {
            collapseSlideover();
        }
    });

        // list
        generateLocationsList(locations);

        searchInput.addEventListener('input', searchLocations);
        timeInput.addEventListener('change', searchLocations);
});

const locations = [
    {
        name: "4646 Convoy Street",
        type: "Dining plaza",
        hours: {
            open: "00:00",
            close: "24:00"
        },
        spaces: 0,
        image: "images/additional/4646cs.png",
        businesses: "Tofu House, Yogurt World"
    },
    {
        name: "4620 Convoy Street",
        type: "Dining plaza",
        hours: {
            open: "10:00",
            close: "01:00"
        },
        spaces: 8,
        image: "images/additional/4620cs.png",
        businesses: "Somisomi, Prime Grill Korean BBQ"
    },
    {
        name: "4681 Convoy Street",
        type: "Dining plaza",
        hours: {
            open: "09:30",
            close: "23:00"
        },
        spaces: 3,
        image: "images/additional/4681cs.png",
        businesses: "Steamy piggy, Song Hak Korean BBQ"
    },
    {
        name: "4609 Convoy Street",
        type: "Dining & Dessert",
        hours: {
            open: "09:30",
            close: "23:00"
        },
        spaces: 11,
        image: "images/additional/4609cs.png",
        businesses: "Kura Revolving Sushi Bar, Bing Haus, Iceskimo"
    }
];

function generateLocationsList(locationsArray) {
    const locationsContainer = document.getElementById('locations');
    locationsContainer.innerHTML = '';

    locationsArray.forEach((location, index) => {
        const locationElement = document.createElement('div');
        locationElement.className = `location${index === locationsArray.length - 1 ? ' location-last' : ''}`;
        
        const availabilityText = location.spaces === 0 ? 'FULL' : `${location.spaces} spaces reservable`;
        const availabilityClass = location.spaces === 0 ? 'full' : '';

        locationElement.innerHTML = `
        <div class="location-left">
            <h2>${location.name}</h2>
            <div class="geninfo">
                <span class="left light">${location.type}</span>
                <span class="right light">Open ${formatTime(location.hours.open)} - ${formatTime(location.hours.close)}</span><br>
            </div>
                <div class="businesses">
                    <span class="light">${location.businesses}</span>
                </div>
                <div class="availables ${availabilityClass}">
                    <span><img src="images/icons/parking.svg"></span>
                    <span class="right">${availabilityText}</span>
                </div>
            </div>
            <div class="location-right">
                <img src="${location.image}" alt="${location.name}">
            </div>
        `;
        locationsContainer.appendChild(locationElement);
    });
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes}${ampm}`;
}

function searchLocations() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const timeInput = document.getElementById('time').value;
    const dateInput = document.getElementById('date').value;
  
    // Store search data in localStorage
    localStorage.setItem('searchDate', dateInput);
    localStorage.setItem('searchTime', timeInput);
  
    const locationElements = document.querySelectorAll('.location');
    locationElements.forEach((element, index) => {
      const location = locations[index];
      const nameMatch = location.name.toLowerCase().includes(searchTerm);
      const businessMatch = location.businesses.toLowerCase().includes(searchTerm);
      const timeMatch = isTimeWithinOpenHours(timeInput, location.hours);
  
      if ((nameMatch || businessMatch) && timeMatch) {
        element.style.display = '';
      } else {
        element.style.display = 'none';
      }
    });
  }

  function isTimeWithinOpenHours(inputTime, hours) {
    if (!inputTime) return true;
    const input = new Date(`2000-01-01T${inputTime}`);
    const open = new Date(`2000-01-01T${hours.open}`);
    const close = new Date(`2000-01-01T${hours.close}`);
    
    if (close <= open) {
      close.setDate(close.getDate() + 1);
    }
    
    return input >= open && input <= close;
  }

document.addEventListener('DOMContentLoaded', function() {
    const slideoverMain = document.getElementById('slideovermain');
    const slideoverReservation = document.querySelector('#slideovermain.hidden');
    const locationsContainer = document.getElementById('locations');
    const backButton = document.getElementById('backtosearch');

    function showReservation(location) {
        slideoverMain.classList.add('hidden');
        slideoverReservation.classList.remove('hidden');
    
        // Populate reservation information
        const selectedLocation = slideoverReservation.querySelector('#selected-location');
        selectedLocation.querySelector('h2').textContent = location.name;
        selectedLocation.querySelector('.left.light').textContent = location.type;
        selectedLocation.querySelector('.right.light').textContent = `Open ${formatTime(location.hours.open)} - ${formatTime(location.hours.close)}`;
        selectedLocation.querySelector('.availables .right').textContent = location.spaces === 0 ? 'FULL' : `${location.spaces} spaces reservable`;
        selectedLocation.querySelector('.location-right img').src = location.image;
        selectedLocation.querySelector('.location-right img').alt = location.name;
    
        // Prepopulate fields from previous search
        const searchDate = localStorage.getItem('searchDate');
        const searchTime = localStorage.getItem('searchTime');
        if (searchDate) document.getElementById('reservation-date').value = searchDate;
        if (searchTime) document.getElementById('reservation-time').value = searchTime;
        
        document.getElementById('carpool').addEventListener('change', updateSummary);
        document.getElementById('reservation-time').addEventListener('change', checkTime);

        updateSummary();
  
    }

    function showMain() {
        slideoverMain.classList.remove('hidden');
        slideoverReservation.classList.add('hidden');
    }

    locationsContainer.addEventListener('click', function(e) {
        const locationElement = e.target.closest('.location');
        if (locationElement) {
            const index = Array.from(locationsContainer.children).indexOf(locationElement);
            const location = locations[index];
            showReservation(location);
        }
    });

    backButton.addEventListener('click', showMain);

    showMain();
});


function updateSummary() {
    const carpoolSelect = document.getElementById('carpool');
    const summaryElement = document.getElementById('summary');
    
    const basePrice = 5.00; // Base reservation price
    const carpoolDiscount = getCarpoolDiscount(carpoolSelect.value);
    
    const total = basePrice - carpoolDiscount;
  
    summaryElement.innerHTML = `
      <h3>Summary</h3>
      <div class="summary-item">
        <span class="item-left">Non-compact vehicle reservation</span>
        <span class="item-right">$${basePrice.toFixed(2)}</span>
      </div>
      <div class="summary-item">
        <span class="item-left">${carpoolSelect.options[carpoolSelect.selectedIndex].text}</span>
        <span class="item-right">-$${carpoolDiscount.toFixed(2)}</span>
      </div>
      <div id="totalamount">
        <span class="item-left"><b>Total</b></span>
        <span class="item-right">$${total.toFixed(2)}</span>
      </div>
    `;

    }
  
function getCarpoolDiscount(value) {
    const discounts = {
        '2': 1.0,
        '3': 1.5,
        '4': 2.0,
        '5': 2.5,
        '6': 2.5
    };
    return discounts[value] || 0;
}

function checkTime() {
    const timeToCheck = document.getElementById('reservation-time').value;
    const selectedLocation = document.querySelector('#selected-location h2').textContent;
    const location = locations.find(loc => loc.name === selectedLocation);
  
    if (location && timeToCheck) {
      const isOpen = isTimeWithinOpenHours(timeToCheck, location.hours);
      if (!isOpen) {
        alert(`The selected time (${timeToCheck}) is outside of ${location.name}'s operating hours. Please choose a time between ${formatTime(location.hours.open)} and ${formatTime(location.hours.close)}.`);
        document.getElementById('reservation-time').value = '';
      }
    }
  }




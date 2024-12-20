let map;
let markers = []; // Store all the markers
let currentInfoWindow = null; // To track the currently opened InfoWindow

// Initialize the map
function initMap() {
    // Initialize the map centered on Aveiro
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.640063, lng: -8.653753 }, // Aveiro coordinates
        zoom: 14,
    });

    // Define locations with static data (you can customize it)
    const locations = [
        { lat: 40.629822587608494, lng: -8.65457512760494, title: 'Pavilhao Aristides Hall', description: '3810-489 Aveiro' },
        { lat: 40.62460251825494, lng: -8.657912436102773, title: 'Sintetico da Universidade de Aveiro', description: '3810-416 Aveiro' },
        { lat: 40.62839871916146, lng: -8.653878003186668, title: 'Pista de Atletismo', description: '3810-193 Aveiro' },
        { lat: 40.629336533505395, lng: -8.65467353372707, title: 'Nave Multiusos Caixa UA', description: '3810-193 Aveiro' },
        { lat: 40.62982265210558, lng: -8.654100577168453, title: 'Sala de Treino Fisico', description: '3810-193 Aveiro' }
    ];

    // Loop through locations and add markers
    locations.forEach((location, index) => {
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            title: location.title,
            map: map, // Add the marker to the map
        });

        const infoWindowContent = `
                    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                        <h3 style="margin: 0;">${location.title}</h3>
                        <p style="margin: 5px 0;">${location.description}</p>
                    </div>
                `;

        const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
        });

        marker.addListener("click", () => {
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
            infoWindow.open(map, marker);
            currentInfoWindow = infoWindow;
        });

        markers.push(marker); // Store the marker

        // Link each "Find" button with the corresponding marker
        const findButton = document.getElementById(`findButton${index + 1}`);
        if (findButton) {
            findButton.addEventListener('click', () => {
                // Zoom and center the map to the marker's position
                map.setCenter(marker.getPosition());
                map.setZoom(18); // Zoom level to focus on the marker
                // Optionally, you can trigger the InfoWindow to open when clicking the "Find" button
                if (currentInfoWindow) {
                    currentInfoWindow.close();
                }
                infoWindow.open(map, marker);
                currentInfoWindow = infoWindow;
            });
        }
    });
}

// Initialize info buttons for the information container
const infoButtons = document.querySelectorAll('.info-button');
const infoContainer = document.getElementById('infoContainer');
const infoTitle = document.getElementById('infoTitle');
const infoAddress = document.getElementById('infoAddress');
const infoDescription = document.getElementById('infoDescription');
const infoHorario = document.getElementById('infoHorario');

// Function to update the info container with the clicked button's details
function showInfo(button) {
    // Get data attributes from the button
    const title = button.getAttribute('data-title');
    const address = button.getAttribute('data-address');
    const description = button.getAttribute('data-description');
    const horario = button.getAttribute('data-horario');

    // Update the content of the info container
    infoTitle.textContent = title;
    infoAddress.textContent = `Endereco: ${address}`;
    infoDescription.innerHTML = description;  // Insert HTML content into the description
    infoHorario.textContent = `Horario: ${horario}`;  // Display the horario correctly

    // Show the info container
    infoContainer.classList.add('active');
}

// Add event listener to each info button
infoButtons.forEach(button => {
    button.addEventListener('click', () => {
        showInfo(button);
    });
});


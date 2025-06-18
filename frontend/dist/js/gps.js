document.addEventListener('DOMContentLoaded', function() {
    // Initialize GPS Map
    const gpsMap = L.map('gps-map').setView([18.561378, 73.942259], 16);
    
    // Add base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(gpsMap);
    
    // Add QuantumSoft Technologies marker
    const quantumSoftMarker = L.marker([18.561378, 73.942259]).addTo(gpsMap)
        .bindPopup("<b>QuantumSoft Technologies</b><br>Private Limited, Pune");
    
    // Variables for tracking
    let watchId = null;
    let userMarker = null;
    let trackHistory = [];
    let trackPolyline = null;
    
    // DOM elements
    const startBtn = document.getElementById('startTrackingBtn');
    const stopBtn = document.getElementById('stopTrackingBtn');
    const centerBtn = document.getElementById('centerMapBtn');
    const deviceStatus = document.getElementById('deviceStatus');
    const lastUpdate = document.getElementById('lastUpdate');
    const trackingHistory = document.getElementById('trackingHistory');
    
    // Start tracking button
    startBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            startBtn.disabled = true;
            stopBtn.disabled = false;
            deviceStatus.textContent = 'Active';
            deviceStatus.className = 'badge bg-success';
            
            // Clear previous tracking data if any
            if (trackPolyline) {
                gpsMap.removeLayer(trackPolyline);
            }
            trackHistory = [];
            trackingHistory.innerHTML = '';
            
            // Start watching position
            watchId = navigator.geolocation.watchPosition(
                updatePosition,
                handleGeolocationError,
                {
                    enableHighAccuracy: true,
                    maximumAge: 10000,
                    timeout: 5000
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    });
    
    // Stop tracking button
    stopBtn.addEventListener('click', function() {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
        deviceStatus.textContent = 'Inactive';
        deviceStatus.className = 'badge bg-secondary';
    });
    
    // Center map button
    centerBtn.addEventListener('click', function() {
        if (userMarker) {
            gpsMap.setView(userMarker.getLatLng(), 16);
        } else {
            gpsMap.setView([18.561378, 73.942259], 16);
        }
    });
    
    // Update position callback
    function updatePosition(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        const altitude = position.coords.altitude;
        const speed = position.coords.speed;
        const heading = position.coords.heading;
        const timestamp = new Date(position.timestamp);
        
        // Update position display
        document.getElementById('gpsLatitude').textContent = lat.toFixed(6);
        document.getElementById('gpsLongitude').textContent = lng.toFixed(6);
        document.getElementById('gpsAccuracy').textContent = `${accuracy.toFixed(2)} meters`;
        document.getElementById('gpsAltitude').textContent = altitude ? `${altitude.toFixed(2)} meters` : '-';
        document.getElementById('gpsSpeed').textContent = speed ? `${(speed * 3.6).toFixed(2)} km/h` : '-';
        document.getElementById('gpsHeading').textContent = heading ? `${heading.toFixed(2)}°` : '-';
        lastUpdate.textContent = timestamp.toLocaleTimeString();
        
        // Update or create user marker
        if (!userMarker) {
            userMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'user-marker',
                    html: '<i class="fas fa-user" style="color: #dc3545; font-size: 24px;"></i>',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                })
            }).addTo(gpsMap).bindPopup("Your Position").openPopup();
            
            // Add accuracy circle
            L.circle([lat, lng], {
                color: '#dc3545',
                fillColor: '#f8d7da',
                fillOpacity: 0.5,
                radius: accuracy
            }).addTo(gpsMap);
        } else {
            userMarker.setLatLng([lat, lng]);
        }
        
        // Center map on user if it's the first position
        if (trackHistory.length === 0) {
            gpsMap.setView([lat, lng], 16);
        }
        
        // Add to track history
        trackHistory.push([lat, lng]);
        
        // Update track polyline
        if (trackPolyline) {
            gpsMap.removeLayer(trackPolyline);
        }
        trackPolyline = L.polyline(trackHistory, {color: '#0d6efd'}).addTo(gpsMap);
        
        // Add to tracking history list
        const historyItem = document.createElement('div');
        historyItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        historyItem.innerHTML = `
            <div>
                <small>${timestamp.toLocaleTimeString()}</small><br>
                <span class="fw-bold">${lat.toFixed(6)}, ${lng.toFixed(6)}</span>
            </div>
            <span class="badge bg-primary rounded-pill">${trackHistory.length}</span>
        `;
        
        // Prepend to keep newest on top
        if (trackingHistory.firstChild) {
            trackingHistory.insertBefore(historyItem, trackingHistory.firstChild);
        } else {
            trackingHistory.appendChild(historyItem);
        }
    }
    
    // Geolocation error handler
    function handleGeolocationError(error) {
        let errorMessage = '';
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "User denied the request for Geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                errorMessage = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                errorMessage = "An unknown error occurred.";
                break;
        }
        
        alert('Geolocation error: ' + errorMessage);
        
        // Reset UI
        startBtn.disabled = false;
        stopBtn.disabled = true;
        deviceStatus.textContent = 'Error';
        deviceStatus.className = 'badge bg-danger';
    }
});
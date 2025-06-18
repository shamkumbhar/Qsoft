document.addEventListener('DOMContentLoaded', function() {
    // Initialize GIS Map
    const gisMap = L.map('gis-map').setView([18.561378, 73.942259], 16);
    
    // Add base layers
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    
    const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    // Add default layer
    osmLayer.addTo(gisMap);
    satelliteLayer.addTo(gisMap);
    
    // Add QuantumSoft Technologies marker
    const quantumSoftMarker = L.marker([18.561378, 73.942259]).addTo(gisMap)
        .bindPopup("<b>QuantumSoft Technologies</b><br>Private Limited, Pune");
    
    // Layer control event handlers
    document.getElementById('satelliteLayer').addEventListener('change', function(e) {
        if (e.target.checked) {
            satelliteLayer.addTo(gisMap);
        } else {
            gisMap.removeLayer(satelliteLayer);
        }
    });
    
    document.getElementById('streetLayer').addEventListener('change', function(e) {
        if (e.target.checked) {
            osmLayer.addTo(gisMap);
        } else {
            gisMap.removeLayer(osmLayer);
        }
    });
    
    document.getElementById('terrainLayer').addEventListener('change', function(e) {
        if (e.target.checked) {
            terrainLayer.addTo(gisMap);
        } else {
            gisMap.removeLayer(terrainLayer);
        }
    });
    
    // Update coordinates display on mouse move
    gisMap.on('mousemove', function(e) {
        document.getElementById('latitudeInput').value = e.latlng.lat.toFixed(6);
        document.getElementById('longitudeInput').value = e.latlng.lng.toFixed(6);
    });
    
    // Copy coordinates button
    document.getElementById('copyCoordsBtn').addEventListener('click', function() {
        const lat = document.getElementById('latitudeInput').value;
        const lng = document.getElementById('longitudeInput').value;
        navigator.clipboard.writeText(`${lat}, ${lng}`);
        
        // Show feedback
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
    });
    
    // Add sample polygon around QuantumSoft
    const quantumSoftArea = L.polygon([
        [18.562, 73.941],
        [18.562, 73.943],
        [18.560, 73.943],
        [18.560, 73.941]
    ], {color: 'blue'}).addTo(gisMap)
    .bindPopup("QuantumSoft Technologies Area");
});
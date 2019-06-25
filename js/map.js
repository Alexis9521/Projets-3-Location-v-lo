let lat = 45.750000;
let lng = 4.850000;


function initMap() {

    let map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 6,
        maxZoom: 20
    }).addTo(map);

    //for (var i = 0; i < stationsTab.length; i++) {
    //  let marker = new L.marker([stationsTab[i][1],stationsTab[i][2]])
    //    .addTo(map);
    //}
      var planes = [
    ["7C6B07",45.75,4.85],
    ["7C6B38",45.80,4.90],
    ["7C6CA1",45.85,4.95],
    ["7C6CA2",45.90,5],
    ["C81D9D",45.95,5.05],
    ["C82009",46.00,5.10],
    ["C82081",46.05,5.15],
    ["C820AB",46.10,5.20],
    ["C820B6",46.15,5.25]
    ];
    for (var i = 0; i < planes.length; i++) {
      marker = new L.marker([planes[i][1],planes[i][2]])
        .bindPopup(planes[i][0])
        .addTo(map);
    }
  }
  //just test

window.onload = function(){
    initMap();
};



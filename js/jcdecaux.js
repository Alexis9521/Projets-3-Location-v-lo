var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();
//REQUETTE ASCYNCHRONE
function requette (url){
    return new Promise(function (resolve, reject){
        var req = new window.XMLHttpRequest();
        req.onreadystatechange = function(){
           if (req.readyState === 4){
               if (req.status === 200){
                   resolve(req.responseText);
               }
               else{
                   reject(req);
               }
           }
        }
    req.open("GET", url);
    req.send();
    });
}
// PROMISE
var getInfos = function(){
    return new Promise(function(resolve, reject){
        requette("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=42cf398be2c55d44619e24174650eefaa481486c").then (function (response){
            var data = JSON.parse(response);
            resolve(data);
        }).catch(function(error){
            console.log(error);
        })
    })
};
//TABLEAU DES STATIONS
var stationsTab = [];

// ATTRIBUTION DE CHAQUE ATTRIBUT A UN OUVEL OBJET "STATION" POUR CHAQUE ELEMENT DE DATA
getInfos().then(function(data){
    data.forEach(function(info){
            var station =
              {
                  numeroStation : info.number,
                  nomContrat : info.contract_name,
                  nomStation : info.name,
                  adresseStation : info.address,
                  positionStation : info.position,
                  bornePaiement : info.banking,
                  bonus : info.bonus,
                  nbrMaxVelos : info.bike_stands,
                  retourVelo : info.available_bike_stands,
                  velosRestants : info.available_bikes,
                  derniereMAJ : info.last_update,
                  status : info.status
              };
        // ON RANGE LES STATIONS DANS UN TABLEAU
            stationsTab.push(station);
        // UN NOUVEAU MARQUEUR POUR CHAQUE STATION
            mark = new ol.maps.Marker
            ({
                map : map,
                position : station.positionStation,
                name : station.nomStation
            });
        // UN EVENEMENT 'CLICK' POUR CHAQUE MARQUEUR
            ol.maps.event.addListener(mark, "click", function(){
                var infos = document.getElementById("infos");
                infos.style.visibility = "visible";

                var  map = document.getElementById("map");
                map.style.width = "70%";

                document.getElementById("nomStation").innerHTML = "Nom de la station : " + station.nomStation;
                document.getElementById("adresseStation").innerHTML = "Adresse de la station : " + station.adresseStation;
                document.getElementById("statuStation").innerHTML = "Etat de la station : " + station.status;
                document.getElementById("retourVelo").innerHTML = "Nombre d'emplacement vide disponibles : " + station.retourVelo;
                document.getElementById("nbrMaxVelos").innerHTML = "nombre total de vélos sur la station : " + station.nbrMaxVelos;
                document.getElementById("velosRestants").innerHTML = "Nombre de vélo(s) disponible(s) : " + station.velosRestants;
            });

        })

    console.log(stationsTab);
})

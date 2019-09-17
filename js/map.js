// Class map Leaflet Js

class mapLeaflet{
    // Constructeur map
    constructor(container, mapID, lat, lng, zoom, ajaxURL) {

        this.container = $(container);
        this.mapID = mapID; // id de la map
        this.latView = lat; // Latitude
        this.lngView = lng; // longitude
        this.zoom = zoom;   // zoom initial
        this.ajaxURL = ajaxURL; // requete ajax
        this.map = L.map('map').setView([this.latView, this.lngView], this.zoom); // initialisation de la map
        this.tilelayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', // création du design de la map
            maxZoom: 18
        });
        this.tilelayer.addTo(this.map); // ajout du design à la map
        this.stationModel = { // création de l'objet station
            init: function (name, address, positionlat, positionlng, banking, status, bikestands, availableBS, availableB, lastupdate) {
                this.name = name; // Nom station
                this.address = address; // Adresse station
                this.position = { // les positions lat lng de chaque station
                    lat: positionlat,
                    lng: positionlng
                };
                this.banking = banking;
                this.status = status; // status ouvert ou fermé
                this.bike_stands = bikestands; // nombre de stand
                this.available_bike_stands = availableBS; // nombre de place dispo
                this.available_bikes = availableB; // nombre de velo dispo
                this.last_update = lastupdate; // derniere actualisation
            }

        };
        this.greenIcon = L.icon({ // Marker vers pour station avec plus de 10 vélo
            iconUrl: 'images/marker-green.png',
            iconSize: [40, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });

        this.yellowIcon = L.icon({ // Marker jaune pour station avec moin de 10 vélo
            iconUrl: 'images/marker-yellow.png',
            iconSize: [40, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });

        this.redIcon = L.icon({ // Marker rouge si aucun vélo n'est disponible
            iconUrl: 'images/marker-red.png',
            iconSize: [40, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
        this.document = $(document);
        this.regex = /(\d*-\d* -)|(\d* -)|(\d*-)/ // enlève les chiffres et le tiret du nom de la station
        this.name = this.container.find('#name');
        this.firstname = this.container.find('#firstname');
        this.initSettings();
    }; // fin du constructor

    //  Affichage plus données des stations, canvas et scrool pour mobile

    newMarker(newStation) {

        $('#container_reserv').remove();
        $('#formulaire').prepend('<p id="container_reserv"></p>'); // Ou affiche les noms des stations apres clic marker
        $('#container_reserv').append(newStation.name.replace(this.regex, 'STATION')); // affiche le nom de la station
        $('#formulaire').css('width', '60%'); // taille du formulaire après clic
        $('#station_infos').css('display', 'block'); // affiche les infos de la stations
        $('#station_infos p').html(''); // efface les dernières valeurs d'informations
        $('#formulaire form').css('display', 'none'); // efface le formulaire
        $('#aucunvelo').css('display', 'none'); // efface le message en cas de réservation impossible


        $('#station_infos p:first').append(`Adresse : ${newStation.address.toLowerCase()}`); // remplissage de l'info 1
        $('#station_infos p:eq(1)').append(`Nombre de places : ${newStation.bike_stands}`); // remplissage de l'info 2
        $('#station_infos p:last').append(`Nombre de vélos disponibles : ${newStation.available_bikes}`); // remplissage de l'info 3

        $('#canvas_container').css('display', 'none'); // efface le canvas s'il est ouvert
        $('#form_exp').css('display', 'none'); // efface le message d'expiration de reservation
        $('#name, #firstname').keyup(function(e){
            if (e.which === 37 || e.which === 39)
                e.stopPropagation();
        });

        if (newStation.available_bikes > 0) { // S'il y a des vélos disponibles...
            $('#formulaire form').css('display', 'block');
            $('html, body').animate({ // pour les mobiles, scroll down jusqu'au formulaire
                scrollTop: $("#container_reserv").offset().top
            }, 1000);
        } else {
            $('#aucunvelo').css('display', 'block'); // message de réservation impossible
            $('html, body').animate({ // pour les mobiles, scroll down jusqu'au formulaire
                scrollTop: $("#container_reserv").offset().top
            }, 1000);
        }

        $('#clear_canvas').click(() => {
            $('#form_confirm').css('display', 'none');
        });
    }

    // Lance la méthode ajax si le DOM est prêt

    initSettings() {

        this.document.ready( ($) => { // quand le DOM est prêt, on lance la méthode AJAX
            this.launchAjax();
        });
    }

    // Exécute la requette AJax

    launchAjax() {

            $.ajax({
                url: this.ajaxURL,
                type: 'GET',
                dataType: 'json',
                data: {param1: 'value1'},
            })
            .done(function() {

            })
            .fail(function() {

            })
            .always( (response) => {
                this.ajaxOK(response);
            });
        };

    // Réponse ajax avec récupération du tableau des stations

    ajaxOK(response) { // fonction qui se déclenche quand  l'appel AJAX s'est terminé avec succès

        let markerGroup = L.markerClusterGroup();

        let stations = response; // le tableau JS obtenu (jQuery traduit en JS)
        for (let station of stations) { // création d'une classe pour chaque station
            let newStation = Object.create(this.stationModel);
            newStation.init(station.name, station.address, station.position.lat, station.position.lng, station.banking, station.status, station.bike_stands, station.available_bike_stands, station.available_bikes, station.last_update);

            let myIcon = this.greenIcon; // au début de la boucle, l'icône est vert

            if (newStation.status === "CLOSED") { // si la station est FERMÉE
                newStation.available_bikes === 0; // elle n'a plus de vélos disponibles
            };

            if (newStation.available_bikes < 10) { // moins de 10 places restantes, il devient orange
                myIcon = this.yellowIcon;
                if (newStation.available_bikes === 0) { // à 0, il devient rouge
                    myIcon = this.redIcon;
                }
            }
        
            let newMarker = L.marker([newStation.position.lat, newStation.position.lng], {icon: myIcon}, {opacity: 1}, {bubblingMouseEvents: true}, {interactive: true});
            newMarker.bindPopup(newStation.name.replace(this.regex,'STATION'));
            markerGroup.addLayer(newMarker);
            newMarker.on('click', (e) => {
                this.newMarker(newStation);
            });
        };
        
        (this.map).addLayer(markerGroup);
    };
}; // fin de la classe
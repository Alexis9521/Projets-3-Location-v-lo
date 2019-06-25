var Map = {
    // Api OpenData Lyon key
    velovApi: 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=8aa3c1a827af31bf41359b46b2394c247cc7ee0d',
    map: null,
    reservationPanel: ('.reservation'),
    stationName: ('.station-name'),
    stationAddress: ('.station-address'),
    availableBikes: ('.available-bikes'),
    infoStationPanel: ('.info-station'),
    reservationButton: ('.reservation-button'),
    submitButton: ('#submit'),
    currentReservMessage: ('.footer-text'),
    cancelReservation: ('.cancel'),
    timerText: ('.timer-text'),
    x: null,

    // Création de la GoogleMap, Pas de compte à rebours dans le footer, Appel de l'API Velib
    init: function () {
        this.map = new ol.Map(document.getElementById('map'), {
            center: {
                lat: 45.7588043,
                lng: 4.8552897
            },
            zoom: 12,
            minZoom: 10,
            scrollwheel: false
        });

        this.hideCountDownPanel();
        this.callApiVelib();
    },
    // Ajout d'un marker clusterer pour gérer les markers.
    displayMarkerCluster: function (map, markers) {
        var markerCluster = new MarkerClusterer(Map.map, markers, {
            imagePath: 'img/m/m',

        });
    },

    // lorsqu'il n'y a pas de réservation en cours: pas de compte à rebours, pas de bouton d'annulation
    hideCountDownPanel: function () {
        this.timerText.hide();
        this.cancelReservation.hide();
    },

    // Cacher les informations de la station précédente lorsque l'on clique sur une station différente
    hideInfosStation: function () {
        this.reservationPanel.fadeOut();
        this.stationName.hide();
        this.stationAddress.hide();
        this.availableBikes.hide();
    },

    countDown: function() {
        var finishTime = new Date().getTime() + 1200000;
        Map.x = setInterval(function() {
            var now = new Date().getTime();

            var remainingTime = finishTime - now;

            var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            // Afficher le résultat dans l'élément class timer-texte du DOM
            Map.timerText.fadeIn('slow');
             Map.timerText.text(minutes + " mn " + seconds + " s ");

            // Si le compte à rebours est fini : afficher le texte
            if (remainingTime < 0) {
                clearInterval(Map.x);
                Map.currentReservMessage.text('Votre réservation a expiré');
                Map.timerText.hide();
            }


        }, 999);

    },

    // Appel de velovApi, affichage des markers, reservations, et compte à rebours
    callApiVelib: function () {
        ajaxGet(Map.velovApi, function (reponse) {
            // Réponse dans un tableau Javascript
            var stations = JSON.parse(reponse);
            markers = [];
            // Pour chaque station: création d'un marqueur sur la carte + définition des actions en cliquant sur ce marqueur
            stations.forEach(function (station) {
                var marker = new google.maps.Marker({
                    position: station.position,
                    map: Map.map,
                    title: station.name
                });
                markers.push(marker);

                // Affichage des infos sur la station en cliquant sur un marker
                marker.addListener('click', function () {
                    Map.hideInfosStation();
                    Map.reservationButton.css('display', 'block');
                    Map.stationName.text(station.name);
                    Map.stationAddress.text('Adresse : ' + station.address);
                    Map.availableBikes.text('Vélo\'V(s) disponible(s) : ' + station.available_bikes);
                    Map.stationName.fadeIn('slow');
                    Map.stationAddress.fadeIn('slow');
                    Map.availableBikes.fadeIn('slow');
                    // En cliquant sur un marqueur, défilez jusqu'au panneau d'informations
                    $('html, body').animate({
                        scrollTop: Map.infoStationPanel.offset().top},
                        'slow'
                    );

                    // Affichage du panneau de réservation en cliquant sur le bouton réservation
                    Map.reservationButton.click(function () {
                        if (station.available_bikes > 0) {
                            Map.reservationPanel.css('display', 'block');
                            Map.availableBikes.text('Il y a ' + station.available_bikes + ' vélo\'V(s) disponible(s) à réserver !');
                        } else {
                            Map.availableBikes.text('Il n\' y a aucun vélo\'V disponible à réserver !');
                            Map.reservationButton.css('display', 'none');
                            Map.reservationPanel.css('display', 'none');
                        }
                    });

                    // Enregistrer la réservation lors de la validation
                    Map.submitButton.click(function () {
                        sessionStorage.setItem('name', station.name);
                        //var nom = sessionStorage.getItem('name');
                        Map.reservationPanel.css('display', 'none');
                        Map.reservationButton.css('display', 'none');
                        Map.availableBikes.text('Vous avez réservé 1 vélo\'V à cette station');
                        Map.currentReservMessage.text('Vous avez réservé 1 vélo\'V à la station ' + sessionStorage.name + ' pour ');
                        Map.cancelReservation.show();
                        // Réinitialiser compte à rebours s'il y avait une réservation précédente
                        clearInterval(Map.x);
                        // Démarrer un nouveau compte pour la réservation en cours
                        Map.countDown();

                        // Annulation de la reservation
                        Map.cancelReservation.click(function () {
                            clearInterval(Map.x);
                            Map.currentReservMessage.text('');
                            Map.timerText.text('Réservation annulée');
                            Map.cancelReservation.hide();
                        })
                    })
                });
            })
            Map.displayMarkerCluster(map, markers);
        })
    },

}

// Intégration de la Map

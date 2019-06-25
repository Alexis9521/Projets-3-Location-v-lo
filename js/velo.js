/*
function afficher(reponse) {
  let infos = JSON.parse(reponse);
  infos.forEach(element => {
*/
var stationsTab = [];

// ATTRIBUTION DE CHAQUE ATTRIBUT A UN OUVEL OBJET "STATION" POUR CHAQUE ELEMENT DE DATA
getInfos().then(function(data){
    data.forEach(function(info){
            var station =
              {

                  //numeroStation : info.number,
                  //nomContrat : info.contract_name,
                  //nomStation : info.name,
                  //adresseStation : info.address,
                  //positionStation : info.position,
                  //bornePaiement : info.banking,
                  //bonus : info.bonus,
                  //nbrMaxVelos : info.bike_stands,
                  //retourVelo : info.available_bike_stands,
                  //velosRestants : info.available_bikes,
                  //derniereMAJ : info.last_update,
                  //status : info.status
              };
        // ON RANGE LES STATIONS DANS UN TABLEAU
            stationsTab.push(station);

  })
    console.log(stationsTab);
})




/*
    let tabStation = [];
     let station =
      {

        nomStation : info.name,
        positionStation : info.position

      };

      tabStation.push(station);


       console.log(tabStation);
  });
}
    ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=8aa3c1a827af31bf41359b46b2394c247cc7ee0d", afficher);

*/

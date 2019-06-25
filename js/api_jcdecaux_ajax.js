// Exécute un appel AJAX GET
// Prend en paramètres l'URL cible et la fonction callback appelée en cas de succès
/*function ajaxGet(url, callback) {
    let req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}
*/

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
        requette("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=8aa3c1a827af31bf41359b46b2394c247cc7ee0d").then (function (response){
            var data = JSON.parse(response);
            resolve(data);
        }).catch(function(error){
            console.log(error);
        })
    })
};

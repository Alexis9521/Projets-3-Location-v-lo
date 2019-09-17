$(document).ready(function() {
    let mapVelos    = new mapLeaflet('#carte_velo','map', 45.75, 4.85, 12, "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=8aa3c1a827af31bf41359b46b2394c247cc7ee0d");
    let resaVelos   = new ResaClass('#formulaire_reserv', 20 * 60 * 1000, new CanvasClass('#canvas', '#canvas_resa'));
    let canvasVelos = new CanvasClass('#canvas', '#canvas_resa');
});

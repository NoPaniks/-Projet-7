import Resto from './restaurant.js';
jQuery.when(
    jQuery.getJSON("json/restaurant.json")
).done( function(json) {
    console.log(json);
    console.log("test DANS LA FONCTION RECUP JSON");

    //écrire tout le code ici car le Json est chargé
    let restos = [];
    for (let i = 0 ; i< json.length ; i++) {
        restos[i] = new Resto (json.length,i+1,json[i].restaurantName,json[i].address,json[i].lat,json[i].long,json[i].ratings);
        restos[i].displayRestaurant();
    }
    let averageForAll = [];
        for (let i = 0; i<json.length; i++) {
            averageForAll.push(restos[i].calculateAverage());
        } 
    $('.form-check-input').click(()=> {
        $(".resto").hide();
        restos[0].checkBoxchecked(averageForAll); //on lance sur restos[0] juste pour avoir accès, marche sur n'importe quel restos[i] en réalité.
    });
          
});

console.log("test HORS FONCTION RECUP JSON");
// TOUT CET ESPACE EST CHARGER AVANT LE FICHIER JSON
// DONC TOUT CE QUI EST ECRIT EN DESSOUS DE CECI NE POURRA PAS PRENDRE EN COMPTE UNE INFORMATION DU JSON 


// TEST TEST TEST TEST TEST TEST TEST

/*   // TEST de recup des coordonées du JSON dans la console : 
    for (let i = 0; i < json.length ; i++ ) {
        console.log(json[i].restaurantName);
        console.log(json[i].address);
        console.log(json[i].lat);
        console.log(json[i].long);
        for (let y = 0; y < json[i].ratings.length; y++) {
            console.log(json[i].ratings[y].stars);
            console.log(json[i].ratings[y].comment);
        }
    }*/
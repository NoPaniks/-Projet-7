import Resto from './restaurant.js';
import { initMap, addMarkers, showVisibleMarkers,map} from './map.js';
jQuery.when(
    jQuery.getJSON("./json/restaurant.json")
).done( function(json) {
    $("#restaurantAverage").hide();
    $("#restaurantComment").hide();
    
    //initialise la map via /map.js
    initMap();


//déclaration des tableaux et variables global.
let rName = [];let rAddress = [];let rLat = [];let rLong = [];let rRatings = [];let restos = [];
let starsSelected;let index;let averageTab=[];

for (let i = 0; i < json.length ; i++) { //au départ on envoi toutes les données du Json dans les tableaux globaux
    rName.push(json[i].restaurantName);
    rAddress.push(json[i].address);
    rLat.push(json[i].lat);
    rLong.push(json[i].long);
    rRatings.push(json[i].ratings);
    restos[i] = new Resto (i+1,rName[i],rAddress[i],rLat[i],rLong[i],rRatings[i]);
    restos[i].displayRestaurant();
    $("#restaurant-"+(i+1)).hide();
}
//ajoute les marker via /map.js
addMarkers(restos);
//récupération du restaurant sélectionner au clique sur une classe restaurant  
$(document).on("click",".restaurant",function() {
    let selectedId = $(this)[0].id; //récupère l'id de l'élément cliquer
    let lastC = selectedId.replace("restaurant-",""); //récupère le dernier caractère de l'ID
    index = lastC - 1; //Change la valeur de la variable globale "index" correspondant à l'ID - 1
    restos[index].displayComment(rRatings[index]);
    restos[index].showAverage(rRatings[index]);
});
$(document).on("click",".newRestoStars",function() {//Récupération la valeur de l'étoile coché dans le formulaire
    starsSelected =  parseInt($(this)[0].value);
});
$(document).on("click","#addRestaurant",function() {//Ajout de restaurants
    //Récupération des valeurs des différentes informations
    let newName = document.getElementById("newName").value;
    let newAddress = document.getElementById("newAddress").value;
    let newLat = parseFloat(sessionStorage.getItem("newLat"));
    let newLong = parseFloat(sessionStorage.getItem("newLong"));
    let newComment = document.getElementById("newComment").value;
    let surname = document.getElementById("Surname").value;
    let now = new Date();
    let annee   = now.getFullYear(); 
    let mois    = now.getMonth() + 1;
    let jour    = now.getDate();
    let heure   = now.getHours();
    let minute  = now.getMinutes();

    if(newName.length > 0) { //si il y a un nom de restaurant présent dans le champs de formulaire alors : 
        let rating = [{
            stars : starsSelected, 
            comment : newComment, 
            name : surname, 
            date : jour+"/"+mois+"/"+annee+" à "+heure+"h"+minute 
        }];
        rName.push(newName); rAddress.push(newAddress); rLat.push(newLat); rLong.push(newLong);rRatings.push(rating);
        let i = restos.length; //on met i à la valeur de restos.length pour avoir un nouvel index
        restos[i] = new Resto (i+1,rName[i],rAddress[i],rLat[i],rLong[i],rRatings[i]);
        restos[i].displayRestaurant();
        addMarkers(restos);
        //reset du formulaire
        $("#formRestaurant")[0].reset();
    } else { //sinon on alert et on replace le formulaire en vue de l'utilisateur
        alert("Veillez à remplir tous les champs pour un ajout de restaurant")
        var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
            keyboard: true,
            focus : true
            })
            myModal.show();
    }
    showVisibleMarkers(rRatings);
});
$(document).on("click","#addComment",function() {//Ajout des commentaires
    let newComment = document.getElementById("newComment").value;
    let surname = document.getElementById("Surname").value;
    let now = new Date();
    let annee   = now.getFullYear(); 
    let mois    = now.getMonth() + 1;
    let jour    = now.getDate();
    let heure   = now.getHours();
    let minute  = now.getMinutes();
    
    let rating = {
        stars : starsSelected,
        comment : newComment,
        name : surname,
        date : jour+"/"+mois+"/"+annee+" à "+heure+"h"+minute
        };
    rRatings[index].push(rating); //on prend la valeur de l'index Globale pour push dans le bon tableau de rRatings (voir lignes 26-31)
    restos[index].displayComment(rRatings[index]);
    restos[index].showAverage(rRatings[index]);
});
map.addListener("bounds_changed", () => {
    averageTab=[]
    for (let i = 0 ; i < rRatings.length; i++) { 
        let average = [];
        for (let y = 0; y < rRatings[i].length ; y++) {
            average.push(rRatings[i][y].stars);
        }
        averageTab.push(restos[i].numAverage(average));
    }
    showVisibleMarkers(averageTab);
});
$(document).on("click","#filterRanking",function() {
    averageTab=[]
    for (let i = 0 ; i < rRatings.length; i++) { 
        let average = [];
        for (let y = 0; y < rRatings[i].length ; y++) {
            average.push(rRatings[i][y].stars);
        }
        averageTab.push(restos[i].numAverage(average));
    }
    showVisibleMarkers(averageTab);
});
//RESET du formulaire au clique sur "Annuler" ou sur la "x": 
$("#cancelForm").click(function() {
    $("#formRestaurant")[0].reset();
});
$("#closeMdl").click(function() {
    $("#formRestaurant")[0].reset();
});
//Active ou Désactive les cases de la modal en fonction du bouton cliquer
$(document).on("click","#btnAddComment",function() {
    $("#formRestaurant")[0].reset();
    $("#RestaurantName").hide();
    $("#Address").hide();
    $("#addRestaurant").hide();
    $("#addComment").show();
});
//Gère l'appel vers GOOGLE PLACES
$("#gplaces").click(function(){
    $("#selectRestaurant").empty();
    let userlat = parseFloat(sessionStorage.getItem("userlat"));
    let userlng = parseFloat(sessionStorage.getItem("userlng"));
    
    let request = {
        //location : new google.maps.LatLng(userlat, userlng),  //=>permet de récupérer les coordonées de l'utilisateur
        location : map.getCenter(),                             //=> permet de récupérer les coordonnées du centre de la map.
        radius : 2500,
        types : ['restaurant']
    };
    let service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback); 

        
            
    

    });
    function checkIfAlreadyExist(result) { //fonction qui check si le restaurant existe déjà dans la base de donnée
        for (let i = 0 ; i < rName.length ; i++) {
            if (rName[i] === result) {
                rName.splice(i);
                rAddress.splice(i);
                rLat.splice(i);
                rLong.splice(i);
                rRatings.splice(i);
                //supprime toutes les informations du restaurant existant déjà et remplace par le restaurant ajoutée.
            }
        }
    }
    function callback(results,status) {
        if(status == google.maps.places.PlacesServiceStatus.OK) {
            let f;
            for (let i = 0 ; i < results.length ; i++) {
                console.log(restos.length)
                f = restos.length;
                console.log(f);
                checkIfAlreadyExist(results[i].name)
                rName.push(results[i].name);
                rAddress.push(results[i].vicinity);
                rLat.push(results[i].geometry.location.lat());
                rLong.push(results[i].geometry.location.lng());
                requestDetails(results[i].place_id);
                restos[f] = new Resto ((f+1),
                                        rName[f],
                                        rAddress[f],
                                        rLat[f],
                                        rLong[f],
                                        rRatings[f]);
                restos[f].displayRestaurant();
            }   
        }
        addMarkers(restos);
    }
    function requestDetails(placeID) {
        let requestA = {
            placeId : placeID
        }
        let serviceA = new google.maps.places.PlacesService(map);
        serviceA.getDetails(requestA, callbackA);
    }
    function callbackA(results,status) {
        let rating = []
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0 ; i < results.reviews.length; i++) {
                    let review = {
                        stars : results.reviews[i].rating,
                        comment : results.reviews[i].text,
                        name : results.reviews[i].author_name
                    };
                    rating.push(review)
            } 
            rRatings.push(rating)
        }
        
        
    }

    
});

 

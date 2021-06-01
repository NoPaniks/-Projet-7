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

    if(newName.length > 0) { //si il y a un nom de restaurant présent dans le champs de formulaire alors : 
        let rating = [{stars : starsSelected, comment : newComment}];
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
$(document).on("click",".form-check-input",function() {//Filtres sur les restaurants afficher (gérer par map.js)
    let averageTab=[]; //tableau de donnée pour la fonction
    let min = $(this)[0].name[0]; //récupère le 1er caractère du nom de la case coché qui est un chiffre (1/2/3/4/5)
    let element = $(this); //correspond à un input.form-check-input coché
    tabId.push(JSON.parse(sessionStorage.getItem("tabId")));//ici on parse le format JSON de la donnée du sessionStorage
    for (let i = 0 ; i < restos.length ; i++) {
        $("#restaurant-"+(i+1)).hide();
    }
    for (let i = 0 ; i < tabId[0].length; i++) { //on boucle d'abord sur le tableau de donnée récupère dans le sessionStorage
        let average = [];
        for (let y = 0 ; y < restos[ (tabId[0][i])-1 ].ratings.length; y++) { //puis on boucle sur le tableau rRatings[ index récupérer ]
            average.push(restos[ (tabId[0][i])-1 ].ratings[y].stars); //on récupère et push les valeurs de chaque commentaires de cet index
        }
        averageTab.push(restos[ (tabId[0][i])-1 ].numAverage(average)); //on récup et push dans le averageTab la moyenne des restaurants
    }
    if (element.is(':checked')) { //si une case est cochée : 
        for (let i = 0; i < tabId[0].length; i++) {
            if (averageTab[i] >= min) {
                $("#restaurant-"+( tabId[0][i] )).show();
            }
        }
    } else //si aucune case est cochée : 
    for (let i = 0; i < tabId[0].length; i++) {
        if (averageTab[i] >= 0) { 
            $("#restaurant-"+( tabId[0][i] )).show();
        }
    }
    tabId = []; //on vide le tableau pour pas stocker inutilement des données
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
$("#gplaces").click(function(){
    $("#selectRestaurant").empty();
    let userlat = parseFloat(sessionStorage.getItem("userlat"));
    let userlng = parseFloat(sessionStorage.getItem("userlng"));
    
    let request = {
        location : new google.maps.LatLng(userlat, userlng),
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
            for (let i = 0 ; i < results.length ; i++) {
                checkIfAlreadyExist(results[i].name)
                rName.push(results[i].name);
                rAddress.push(results[i].vicinity);
                rLat.push(results[i].geometry.location.lat());
                rLong.push(results[i].geometry.location.lng());
                let rating = [{stars : results[i].rating}];
                rRatings.push(rating);
            }        
        }
            for (let i = 0 ; i < rName.length ; i++) {
                restos[i] = new Resto (i+1,rName[i],rAddress[i],rLat[i],rLong[i],rRatings[i]);
                restos[i].displayRestaurant();
            }
            addMarkers(restos);
            showVisibleMarkers(rRatings);
    }   
    

    
});

 

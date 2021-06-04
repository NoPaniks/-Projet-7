let map ; let markers = []; let element;
let userlng;
let userlat;



if (navigator.geolocation) { //géolocalisation avec javascript
    var watchId = navigator.geolocation.watchPosition(successCallback,
        errorGeo,
        {
            enableHighAccuracy:true, 
            timeout: 120000
        }
        );
}
else {
    alert("Votre navigateur ne prend pas en compte la géolocalisation HTML5");
}


function errorGeo(error) {
    let msg;
    switch(error.code) {
        case error.TIMEOUT :
            msg = 'le temps de la requête à expiré';
            break;
        case error.UNKNOW_ERROR :
            msg = "Une erreur inconnue c'est produite";
            break;
        case error.POSITION_UNVAILABLE : 
            msg = "Une erreur technique c'est produite";
            break;
        case error.TIMEOUT : 
            msg = "Le temps de réponse de la requête à expiré";
            break;
        case error.PERMISSION_DENIED : 
            msg = "Vous avez refuser d'activer la géolocalisation";
            break;
    }
    alert (msg);
}
function successCallback(position){
 userlat =  parseFloat(position.coords.latitude);
 userlng =  parseFloat(position.coords.longitude);
 
sessionStorage.setItem("userlat",position.coords.latitude);
sessionStorage.setItem("userlng",position.coords.longitude);
    
    let markerUser = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        map: map,
        icon:"https://img.icons8.com/nolan/1x/marker.png"
    });
    map.setCenter(markerUser.getPosition());
};

function initMap() {
    // firefox affiche un nombre trop court pour être reconnu en tant que position GPS
    // chrome affiche le nombre float correspondant bien à la position GPS
    let mapOptions = {
        zoom: 13,
        center: {lat : 48.8737815, lng : 2.3501649},
        mapId : 'd4bc720774e69f9d' //correspond à l'id de la map dans le MAP STYLE de google (personnalisé par S.Gilbert)
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function addMarkers(restos) {
    $.each(markers, function() {
        this.setMap(null);
        });
    markers= []; //RAZ du tableau des marqueurs
    for (let i = 0; i < restos.length; i++) {
            const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
            let myLatLng = new google.maps.LatLng(restos[i].lat, restos[i].long),
            marker = new google.maps.Marker({
                position: myLatLng,
                title: restos[i].name,
                animation: google.maps.Animation.DROP,
                id : restos[i].id-1,
                label : markerLetter
            });
            
        //Info Window :
        const contentString = 
            "<h6>"+restos[i].name+"</h6>" +
            "<br><p>"+ restos[i].address + "</p>" +
            '<br><img src="https://maps.googleapis.com/maps/api/streetview?size=200x200&location='+restos[i].lat+","+restos[i].long+
            '&fov=80&heading=70&pitch=0&key=AIzaSyB1UzDu9tfrHhpV_QcXAP5Yubctg0_tbCc"</img>';

        const InfoWindow = new google.maps.InfoWindow({
            content : contentString,
            });
        //Ajoute un écouteur de clique sur chaque Marker
        marker.addListener("click", () => {
            InfoWindow.open(map,marker);
            restos[marker.id].showStreetView();
            $('#restaurantName').html(restos[marker.id].name);
            $("#restaurantAddress").html(restos[marker.id].address);
            $("#restaurantAverage").show();
            $("#restaurantComment").show();
        })		
        marker.setMap(map);
        // Place le marqueur dans le tableau global
        markers.push(marker);
    }
map.addListener("click", (mapsMouseEvent) => { //permet l'ajout de restaurant via le /main.js
    var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
        keyboard: true,
        focus : true
        })
        myModal.show();
        $("#formRestaurant")[0].reset();
        $("#addComment").hide();
        $("#Name").show();
        $("#Address").show();
        $("#addRestaurant").show();
        $("#addComment").hide();
    let b  = mapsMouseEvent.latLng.toJSON();
    sessionStorage.setItem("newLat",b.lat); //on envoi la Latitude par le sessionStorage
    sessionStorage.setItem("newLong",b.lng);//on envoi la Longitude par le sessionStorage
    });
}

$(document).on("click",".form-check-input",function() {
    element = ($(this));
});
 function showVisibleMarkers(averageTab) { //gère les restaurant visible dans la partie de gauche
    let tabId = [];
    let bounds = map.getBounds();
    
    let min = document.getElementById("filterRanking").value;
        for (let i = 0; i < markers.length; i++) { //on boucle sur le nombre de markers qui est = au nombre de restaurants
            let marker = markers[i],
            infoPanel = $("#restaurant-" + (i+1) ); //on dit que l'infoPanel est = à l'id de chaque restaurant
            infoPanel.hide(); // on cache tous les restaurants de la map ! (dans le panel de gauche)
            // console.log("infoPanel : "+infoPanel[0].id);       Renvoi le nom complet des restaurants présent dans la Base de données       
            if (bounds.contains(marker.getPosition())===true) {
                let infoPanelId = (infoPanel[0].id).replace("restaurant-",""); // Pour chaque marker présent dans la map affichée : on récupère l'id du restaurant en supprimant "restaurant-" placé devant.
                //console.log(infoPanelId);
                tabId.push(infoPanelId-1); // on retire "1" pour avoir l'index du restaurant présent à l'affichage dans la map
                // console.log("ID contenu dans la map : "+(infoPanelId-1));    Renvoi le numéro INDEX du/des restaurant(s) présent dans la map
            }
        }
        for (let i = 0 ; i < markers.length ; i++) {
            markers[i].setVisible(false);
        }
        for (let i = 0; i < tabId.length ; i++) {
            if (averageTab[tabId[i]] >= min ) {
                $("#restaurant-"+(tabId[i]+1)).show(); // on affiche le restaurants présent dans la map qui a pour index : tabId[i]+1 (récupérer ligne 72)
                markers[tabId[i]].setVisible(true);
            }
        }
}


export { initMap, addMarkers, showVisibleMarkers,map };


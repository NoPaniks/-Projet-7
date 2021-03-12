function initMap() {
    // MAP OPTION : 
    let options = {
        center :{ lat: 48.0591, lng: -0.935265 },
        zoom: 15
     }
    
     //CREATE MAP
    map = new google.maps.Map(document.getElementById("map"),options)

     //CREATE MARKER : 
     const marker = new google.maps.Marker({
        position:{lat:48.06439285125025, lng:-0.9311328668047022},
        map:map,
        //ICON CHANGE : 
        icon:"https://img.icons8.com/nolan/1x/marker.png"
     });

     //Info Window : 
     let detailWindow = new google.maps.InfoWindow({
        content : `<h2>Le Lac de Ouf de Loiron</h2>`
    });
        marker.addListener("mouseover", () => {
            detailWindow.open(map,marker);
        })

    /* https://www.youtube.com/watch?v=uPhWSyRqQDA
    function addMarker(location) {
        const marker = new google.maps.Marker({
            position: location,
            map:map,
            icon:"https://img.icons8.com/nolan/1x/marker.png"
        });
    }
    addMarker({lat:48.06439285125025, lng:-0.9311328668047022});
    =====> On pourait passer en argument le tableau JSON du coup.
    */

    /* OU FAIRE çà : 
    function addMarker(property) {
        const marker = new google.maps.Marker({
            position: property.location,
            map:map,
            icon: property.imageIcon
        });
    }
    addMarker({  créer un marker avec un style d'icone
        location:{lat:48.06439285125025, lng:-0.9311328668047022},
        imageIcon: "https://img.icons8.com/nolan/1x/marker.png"
    })
    addMarker({ créer un marker avec un autre style d'icone
        location:{lat:..............., lng:..............},
        imageIcon: ".............."
    })
    addMarker({ créer un marker avec le style icone par défaut
        location:{lat:..............., lng:..............},
    })
    */
}


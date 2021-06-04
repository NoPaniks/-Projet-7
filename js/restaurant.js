export default class Resto {
    constructor (id,name,address,lat,long,ratings,placeId) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.lat = lat;
        this.long = long;
        this.ratings = ratings;
        this.placeId = placeId;
    }

    displayRestaurant() { //gère l'affichage de chaque restaurant
        let domWrite = $('#selectRestaurant');
        let box = $('<div>').addClass("restaurant align-self-center");
        let id = String.fromCharCode("A".charCodeAt(0) + (this.id-1 % 26));
        box.attr('id',"restaurant-"+this.id);
        box.html(id+" - "+this.name);
        box.click(()=> {
            $('#restaurantName').html(this.name);
            $("#restaurantAddress").html(this.address);
            $("#restaurantAverage").show();
            $("#restaurantComment").show();
        });
        domWrite.append(box);
    }
    displayComment(tab) { //gère l'affichage des commentaires 
        $('#containerComment').empty();
        let white = "white";
        let grey = "grey";
        for (let i = 0; i < tab.length ; i++) {
            if(i%2 == 0) {
                this.constructorComment(tab,i,white)
            }
            else {
                this.constructorComment(tab,i,grey)
            }
            this.showStreetView();
        }
    }
    showAverage(tab) {//Récupère la note moyenne et l'affiche sur la page
        let average = [];
        for (let y = 0 ; y < tab.length; y++) {
            average.push(tab[y].stars);
        }
        $("#restaurantAverage").html("Note moyenne : "+ this.numAverage(average)); // j'affiche la moyenne du restaurant
    }
    numAverage(average) { //Calcul de la note moyenne du restaurant
        var b = average.length,
            c = 0, i;
        for (i = 0; i < b; i++){
          c += Number(average[i]);
        }
        let n = (c/b);
        return n.toPrecision(2); //arrondit la valeur de la moyenne
    }
    showStreetView() {//Gère l'affichage de l'image StreetView
        let streetImage = document.createElement("img");
        streetImage.src = "https://maps.googleapis.com/maps/api/streetview?size=400x400&location="+this.lat+","+this.long+
        "&fov=80&heading=70&pitch=0&key=AIzaSyB1UzDu9tfrHhpV_QcXAP5Yubctg0_tbCc";
        streetImage.style.height = '200px';
        streetImage.style.width = '200px';
        $("#restaurantImage").html(streetImage);
    }
    constructorComment(tab,i,color) {
        let domWriteContainer = $('#containerComment');
            let boxComment = $('<div>').addClass("commentContainer"+i+" d-flex flex-column "+color);
            boxComment.attr('id','comment'+i);
            domWriteContainer.append(boxComment);

            let domWriteA = $('#comment'+i);
            let box12 = $('<div>').addClass("firstRowComment d-flex flex-start");
            box12.attr('id','firstRowComment'+i);
            domWriteA.append(box12);

            let domWriteBLeft = $('#firstRowComment'+i);
            let box1 = $('<div>').addClass("col-8 text-left Name&Date fontSize10 padding10 align-self-center");
            box1.attr('id','Name&Date'+i);
            box1.html('<span class=blue>'+tab[i].name+'</span>'+'<span class=oblique>'+", édité le : "+'</span>'+tab[i].date);
            domWriteBLeft.append(box1);

            let domWriteBRight = $('#firstRowComment'+i);
            let box2 = $('<div>').addClass("col-4 StarC text-left");
            box2.attr('id','StarC'+i);
            domWriteBRight.append(box2);

            for (let y = 0; y < tab[i].stars; y++) {
                let domWriteC = $('#StarC'+i);
                let box3 = $('<div>').addClass("fas fa-star ");
                box3.attr('id','star'+y);
                domWriteC.append(box3);
            }

            let domWrite = $('#comment'+i);
            let box = $('<div>').addClass("comment text-left ");
            box.html(tab[i].comment);
            domWrite.append(box);
    }
}










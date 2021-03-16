export default class Resto {
    constructor (size,id,name,adress,lat,long,ratings) {
        this.size = size;
        this.id = id;
        this.name = name;
        this.adress = adress;
        this.lat = lat;
        this.long = long;
        this.ratings = ratings;
        /* 
        $('#selectRestaurant').html(this.name);
        $('#restaurantName').html(this.name);
        $('#restaurantAdress').html(this.adress);
        */
    }
    displayRestaurant() {
            let domWrite = $('#selectRestaurant');
            let box = $('<div>').addClass("resto");
            box.attr('id','resto-'+this.id);
            box.html(this.name);
            box.click(()=> {
                this.displayComment()
            });
            domWrite.append(box);
    }
    displayComment() {
        $("#comment").empty();
        for (let i = 0; i < this.ratings.length ; i++) {
            let domWrite = $('#comment');
            let box = $('<div>').addClass("comment");
            box.attr('id','comment-'+i);
            box.html(this.ratings[i].comment);
            domWrite.append(box);
        }
    }
    calculateAverage() {
        let ratingStar = [];
        let notation = "";
        for (let y = 0; y < this.ratings.length ; y++) { //pour la longueure total du nombre de commentaires
            notation = this.ratings[y].stars // je prend chaque note (stars)
            ratingStar.push(notation); // que je pousse dans mon tableau ratingStar
        }
        function numAverage(ratingStar) { //je réalise une fonction MOYENNE avec comme parametre chaque note (stars)
            var b = ratingStar.length,
                c = 0, i;
            for (i = 0; i < b; i++){
              c += Number(ratingStar[i]);
            }
            return Math.round(c/b); //arrondit la valeur de la moyenne
          }
        return numAverage(ratingStar); // je retourne la moyenne de chaque restaurant
    }
    displayCheckedRestaurant(min,max,averageForAll) {
        $(".resto").hide();
        for (let i = 0; i<this.size; i++) {
            if (averageForAll[i]>=min && averageForAll[i]<max) {
                $("#resto-"+(i+1)).show();
            }
        }
    }
    checkBoxchecked(averageForAll) {
        if ($('input[name=oneStar]').is(':checked') ) {
            this.displayCheckedRestaurant(1,2,averageForAll);
        }
        else if ($('input[name=twoStar]').is(':checked') ) {
            this.displayCheckedRestaurant(2,3,averageForAll);
        }
        else if ($('input[name=threeStar]').is(':checked') ) {
            this.displayCheckedRestaurant(3,4,averageForAll);
        }
        else if ($('input[name=fourStar]').is(':checked') ) {
            this.displayCheckedRestaurant(4,5,averageForAll);
        }
        else if ($('input[name=fiveStar]').is(':checked') ) {
            this.displayCheckedRestaurant(5,5,averageForAll);
        }
        else this.displayCheckedRestaurant(0,5,averageForAll);
    }
}

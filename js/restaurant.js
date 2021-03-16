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
    generateRestaurant() {
            let domWrite = $('#selectRestaurant');
            let box = $('<div>').addClass("resto");
            box.attr('id','resto-'+this.id);
            box.html(this.name);
            box.click(()=> {
                this.generateComment()
            });
            domWrite.append(box);
    }
    generateComment() {
        $("#comment").empty();
        for (let i = 0; i < this.ratings.length ; i++) {
            let domWrite = $('#comment');
            let box = $('<div>').addClass("comment");
            box.attr('id','comment-'+i);
            box.html(this.ratings[i].comment);
            domWrite.append(box);
        }
    }
}

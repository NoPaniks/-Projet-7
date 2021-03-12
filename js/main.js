$.get('/restaurant.json')
    .done(data => {
        console.log(data);
    });

console.log(JSON.parse(restaurant).data[0].restaurantName);
/*Search Results*/
window.FoodItem = Backbone.Model.extend({});

window.FoodItemsList = Backbone.Collection.extend({
    model: FoodItem
});

/*Day Ration*/
window.DayFoodList = Backbone.Collection.extend({
    model: FoodItem
});

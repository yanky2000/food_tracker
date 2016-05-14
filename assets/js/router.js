window.App = new (Backbone.Router.extend({
    routes: {
      "": 'index'  
    },
    initialize: function () { 
        this.foodItemList = new FoodItemsList();

        $('input.search-form').click(function () {
            this.searchItem = 2; 
        })
    },


    index: function () { },
    start: function () {
        Backbone.history.start();
     }

   
}));
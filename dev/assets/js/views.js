window.FoodItemView = Backbone.View.extend({
    tagName: 'li',
    render: function () {
        // this.$el.text(this.model.toJSON());
        this.$el.text(this.model.get('name'));
        console.log('model attr:' + this.model.toJSON());
        return this;
    }
});


window.FoodItemsView = Backbone.View.extend({
    // el: '#search-results',
    tagName: 'ul',
    initialize: function () {
        this.listenTo(this.collection, 'change', this.render);
    },
    render: function () {
        this.addAll();
        console.log(this.$el);
        $('#search-results').html(this.$el);
        return this;
    },
    addAll: function () {
        this.$el.empty();
        this.collection.forEach(this.addOne, this);
    },

    addOne: function (foodItem) {
        // console.log(foodItem);
        var foodItemView = new FoodItemView({ model: foodItem });
        this.$el.append(foodItemView.render().el);
        // debugger;
    },


});
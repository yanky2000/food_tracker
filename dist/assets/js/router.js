window.App = new (Backbone.Router.extend({
    routes: {
        "": 'index'
    },
    initialize: function () {
        var self = this;

        self.foodItemsList = new FoodItemsList();
        self.foodItemsView = new FoodItemsView({
            collection: self.foodItemsList
        });

        $(function () {
            searchFood.oninput = function () {
                var searchItem = this.value;
                $('#searchItem').text(window.App.searchItem);
                loadData(searchItem);


            };

        });

        function loadData(searchItem) {
            // loadData: function (searchItem) {

            var $resultsBox = $('#search-results');

            $resultsBox.empty();

            var requestTimeout = setTimeout(function () {
                $resultsBox.text('failed to load data');
            }, 8000);

            $.ajax({
                url: "https://api.nutritionix.com/v1_1/search/" + searchItem + "?results=0:20&fields=item_name,brand_name,item_id,nf_calories&appId=e8a630a4&appKey=42986a4f50f2c7d8c8f701478e5438f1",

                success: function (response) {
                    
                    // We take only neccessary data from AJAX response, batch iterations store results as Backbone collection. 
                    var resultsArray = makeFoodList(response); 
                    self.foodItemsList.set(resultsArray);

                    // extract item name and calories from ajax response to foodItemsList
                    function makeFoodList(data) {
                        var foodList = [];

                        for (var i = 0, respLength = data.hits.length; i < respLength; i++) {

                            var item = {
                                /* Saves only name and calories data from AJAX response, add other fields if needed*/
                                name: data.hits[i].fields.item_name,
                                calories: data.hits[i].fields.nf_calories,
                            };

                            foodList.push(item);
                        }
                        return foodList;
                    }


                    // console.info('response is: ' + self.foodItemsList.get(0));
                    // debugger;
                    // console.log(data.hits[0].fields.item_name);
                    // console.log(self.foodItemsList.at(0).get('name');

                    self.foodItemsView.render();

                    // $resultsBox.text(data[2].length)


                    // var wikiList = [];

                    // /** Formats new wiki articles array for given location */
                    // for (var i = 0, respLength = data.hits.length; i < respLength; i++) {
                    //     var item = {

                    //         name: data.hits[i].fields.item_name,
                    //         calories: data.hits[i].fields.nf_calories,
                    //     };

                    //     itemList.push(wikiItem);
                    // }

                    // self.wikiArticlesList(wikiList);
                    clearTimeout(requestTimeout);

                },

                /** In case of problems connecting to wiki api */
                fail: function () {
                    $resultsBox.text("Sorry, could not load wiki links");
                }
            });

            return false;
        }
    },




    // searchFood.oninput = function () {

    //     if (isNaN(this.value)) { // введено не число
    //         // показать ошибку
    //         this.className = "error";
    //         error.innerHTML = 'Вы ввели не число. Исправьте, пожалуйста.'
    //     
    // };
    // },


    index: function () { },

    start: function () {
        Backbone.history.start();
    }


}));
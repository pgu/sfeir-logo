(function() {

    var article = $('#pgu-berlin');
    article.html('<div></div>');
    article.addClass('pgu-article pgu-article-black');

    window.SLIDES['pgu-berlin'] = {
        id: 'pgu-berlin'
        , reset: function() {
            console.log('reset');
        }
        , execute: function() {
            console.log('execute');
            // get 2 geek sentences
            // for each, show string or picture
            // the user clicks on the winner
            // saves the result (and compute rating)
            // go get other 2 geek sentences
            //
            // display a button to see the rankings
            //

                console.log("GET");
            $.getJSON('geekMash/compare', function (data) {
                console.log("data");
                console.log(data);
            });
        }
    };

})();
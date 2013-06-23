(function() {

    var dom_of_article = [
          '<div class="container_mash">'
        , ' <div class="mash_row">'
        , '  <div class="mash_col">'
        , '   <img id="pic_a" class="pic_mash" />'
        , '   <p id="txt_a" class="txt_mash" />'
        , '  </div>'
        , '  <div class="mash_col">'
        , '   <img id="pic_b" class="pic_mash" />'
        , '   <p id="txt_b" class="txt_mash" />'
        , '  </div>'
        , '  <div class="clearfix"></div>'
        , ' </div>'
        , ' <div class="ranking_row">'
        , '  <div id="ranking_col_higher" class="ranking_col"></div>'
        , '  <div id="ranking_col_lower"  class="ranking_col"></div>'
        , '  <div class="clearfix"></div>'
        , '  <div class="ranking_dl"><input type="button" class="ranking_dl_btn" value="The whole ranking"/></div>'
        , ' </div>'
        , '</div>'
    ];

    var article = $('#pgu-berlin');
    article.html(dom_of_article.join(''));
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
            $.getJSON('mash/geek', function (data) {
                console.log("data");
                console.log(data);
            });

            var entity_a = {
                type: 'geek',
                text: 'Networking is one letter from "Not working"',
                pictureUrl: 'http://25.media.tumblr.com/f74d771d1fc640d6eb32d4f7242b4b71/tumblr_moca9xWmSv1rcufs7o1_1280.png'
            }
            var entity_b = {
                type: 'geek',
                text: 'Teamwork: Tackle life side by side.',
                pictureUrl: 'http://24.media.tumblr.com/9eed7a0ca40b301569a67fe29e3d3cc6/tumblr_mnotrbV7Hz1rcufs7o1_1280.png'
            }

            $('#pic_a').attr('src', entity_a.pictureUrl);
            $('#pic_b').attr('src', entity_b.pictureUrl);

            $('#txt_a').text(entity_a.text);
            $('#txt_b').text(entity_b.text);


            var highers = [
                {text: 'Networking is one letter from Not working'},
                {text: 'N2tworking is one letter from Not working'},
                {text: 'N3tworking is one letter from Not working'},
                {text: 'N4tworking is one letter from Not working'},
                {text: 'N5tworking is one letter from Not working'}
            ];

            var higher_rankings = highers.map(function(higher) {
                return '<div class="high_ranking ranking_cell" title="' + higher.text + '">' + higher.text + '</div>';
            });
            $('#ranking_col_higher').html(higher_rankings.join(''));

            var lowers = [
                {text: 'Teamwork: tackle life side by side'},
                {text: 'T2amwork: tackle life side by side'},
                {text: 'T3amwork: tackle life side by side'},
                {text: 'T4amwork: tackle life side by side'},
                {text: 'T5amwork: tackle life side by side'}
            ];

            var lower_rankings = lowers.map(function(lower) {
                return '<div class="low_ranking ranking_cell" title="' + lower.text + '">' + lower.text + '</div>';
            });
            $('#ranking_col_lower').html(lower_rankings.join(''));

        }
    };

})();
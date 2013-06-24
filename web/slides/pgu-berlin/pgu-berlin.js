(function() {

    var dom_of_article = [
          '<div class="container_mash">'
        , ' <div class="mash_row">'
        , '  <div id="col_a" class="mash_col">'
        , '   <img id="pic_a" class="pic_mash" />'
        , '   <p id="txt_a" class="txt_mash" />'
        , '  </div>'
        , '  <div id="col_b" class="mash_col">'
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

    var sendWinnerOfChallenge = function(winner, data) {

        data.winnerId = winner.id;
        $.post('mash', JSON.stringify(data));

        fetchAChallenge();
    };

    var fetchAChallenge = function() {
        $.getJSON('mash', function (data) {

            console.log(data);

            var player1 = data.player1;
            var player2 = data.player2;

            $('#pic_a').attr('src', player1.pictureUrl);
            $('#pic_b').attr('src', player2.pictureUrl);

            $('#txt_a').text(player1.text);
            $('#txt_b').text(player2.text);

            $('#col_a').off('click').on('click', function () {
                sendWinnerOfChallenge(player1, data);
            });

            $('#col_b').off('click').on('click', function () {
                sendWinnerOfChallenge(player2, data);
            });

        });
    }

    window.SLIDES['pgu-berlin'] = {
        id: 'pgu-berlin'
        , reset: function() {
            console.log('reset');
        }
        , execute: function() {
            console.log('execute');

            fetchAChallenge();

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
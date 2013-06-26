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
        $.post('mash/challenge', JSON.stringify(data));

        fetchAChallenge();
    };

    var fetchAChallenge = function() {
        $.getJSON('mash/challenge', function (data) {

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

    var fetchRanking = function() {
        $.getJSON('mash/ranking', function (data) {

//            data = {
//                highests : [
//                    {text: 'Networking is one letter from Not working'},
//                    {text: 'N2tworking is one letter from Not working'},
//                    {text: 'N3tworking is one letter from Not working'},
//                    {text: 'N4tworking is one letter from Not working'},
//                    {text: 'N5tworking is one letter from Not working'}
//                ],
//                lowests : [
//                    {text: 'Teamwork: tackle life side by side'},
//                    {text: 'T2amwork: tackle life side by side'},
//                    {text: 'T3amwork: tackle life side by side'},
//                    {text: 'T4amwork: tackle life side by side'},
//                    {text: 'T5amwork: tackle life side by side'}
//                ]
//            }
//            ;
            console.log(data);
            var highest_rankings = data.highests.map(function(highest) {
                return '<div class="high_ranking ranking_cell" title="' + highest.text + '">' + highest.text + '</div>';
            });
            $('#ranking_col_higher').html(highest_rankings.join(''));

            var lowest_rankings = data.lowests.map(function(lowest) {
                return '<div class="low_ranking ranking_cell" title="' + lowest.text + '">' + lowest.text + '</div>';
            });
            $('#ranking_col_lower').html(lowest_rankings.join(''));

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

            fetchRanking();

            // TODO
            // + https://github.com/pgu/pgu-track/blob/master/war/Pgu_track.html

        }
    };

})();
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
        , ' <div class="ranking_row_headers">'
        , '  <div class="ranking_col ranking_col_header">Highest scores</div>'
        , '  <div class="ranking_col ranking_col_header">Lowest scores</div>'
        , ' </div>'
        , ' <div class="ranking_row">'
        , '  <div id="ranking_col_higher" class="ranking_col"></div>'
        , '  <div id="ranking_col_lower"  class="ranking_col"></div>'
        , '  <div class="clearfix"></div>'
        , '  <div class="ranking_dl"><a href="mash_all_scores.html" target="_blank" class="ranking_dl_btn" title="Open the whole ranking">&#9660</a></div>'
        , ' </div>'
        , '</div>'
    ];

    var article = $('#pgu-berlin');
    article.html(dom_of_article.join(''));
    article.addClass('pgu-article pgu-article-black');

    var sendWinnerOfChallenge = function(winner, data) {

        $('.mash_col').fadeOut('fast');

        data.winnerId = winner.id;
        $.post('mash/challenge', JSON.stringify(data));

        fetchAChallenge();
    };

    var fetchAChallenge = function() {
        $.getJSON('mash/challenge', function (data) {

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

            $('.mash_col').fadeIn('fast');
        });
    }

    var buildRankingTable = function(data) {
        var highest_rankings = data.highests.map(function(highest) {
            return '<div data-playerid="' +  highest.id + '" class="high_ranking ranking_cell" title="' + highest.text + ' [' + highest.rating + ']">' + highest.text + '</div>';
        });
        $('#ranking_col_higher').html(highest_rankings.join(''));

        var lowest_rankings = data.lowests.map(function(lowest) {
            return '<div data-playerid="' +  lowest.id + '" class="low_ranking ranking_cell" title="' + lowest.text + ' [' + lowest.rating + ']">' + lowest.text + '</div>';
        });
        $('#ranking_col_lower').html(lowest_rankings.join(''));
    }

    var fetchRanking = function() {
        $.getJSON('mash/ranking', function (data) {
            buildRankingTable(data);
        });
    }

    window.SLIDES['pgu-berlin'] = {
        id: 'pgu-berlin'
        , reset: function() {
            console.log('reset');
        }
        , execute: function() {
            fetchAChallenge();
            fetchRanking();
        }
    };

    window.SOCKET_LISTENERS.push(function(data) {
        console.log('berlin got json');
        console.log(data);


        var ids_new_highs = [];
        var idx = 0;

        $('.high_ranking').each(function() {
            console.log($(this)[0].dataset['playerid']);
            var is_the_same = $(this)[0].dataset['playerid'] === data.highests[idx].id + '';

            if (!is_the_same) {
                ids_new_highs.push(data.highests[idx].id);
            }

            idx++;
        });

        var ids_new_lows = [];
        idx = 0;
        $('.low_ranking').each(function() {
            var is_the_same = $(this)[0].dataset['playerid'] === data.lowests[idx].id + '';

            if (!is_the_same) {
                ids_new_lows.push(data.highests[idx].id);
            }

            idx++;
        });

        buildRankingTable(data);

        console.log("low..");
        for (var i = 0, ii = ids_new_lows.length; i < ii; i++) {
            console.log($('.low_ranking[data-playerid="' + ids_new_lows[i] + '"]'));
            $('.low_ranking[data-playerid="' + ids_new_lows[i] + '"]').animate({color: '#FF8C00 !important'});
        }

        console.log("high..");
        for (var i = 0, ii = ids_new_highs.length; i < ii; i++) {
            console.log($('.high_ranking[data-playerid="' + ids_new_highs[i] + '"]'));
            $('.high_ranking[data-playerid="' + ids_new_highs[i] + '"]').animate({color: '#FF8C00 !important'}, {duration: 1000, complete: function() {
                $(this).css('color', '');
            }});
        }

    });

})();
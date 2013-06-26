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
    };

    var buildRankingCol = function(id_col, class_cell, players) {
        var dom_players = players.map(function(player) {
            return '<div data-playerid="' +  player.id + '" class="' + class_cell + ' ranking_cell" title="' + player.text + ' [' + player.rating + ']">' + player.text + '</div>';
        });
        $(id_col).html(dom_players.join(''));
    };

    var buildRankingTable = function(data) {
        buildRankingCol('#ranking_col_higher', 'high_ranking', data.highests);
        buildRankingCol('#ranking_col_lower', 'low_ranking', data.lowests);
    };

    var fetchRanking = function() {
        $.getJSON('mash/ranking', function (data) {
            buildRankingTable(data);
        });
    };

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

    var getDiffFromNewRanks = function(class_rank, new_ranks) {
        var ids_new = [];
        var idx = 0;

        $(class_rank).each(function() {
            var is_the_same = $(this)[0].dataset['playerid'] === new_ranks[idx].id + '';

            if (!is_the_same) {
                ids_new.push(new_ranks[idx].id);
            }

            idx++;
        });

        return ids_new;
    };

    var highlightNewRanks = function(class_rank, ids_new_ranks) {
        for (var i = 0, ii = ids_new_ranks.length; i < ii; i++) {

            $(class_rank + '[data-playerid="' + ids_new_ranks[i] + '"]') //
                .animate({color: '#FF8C00 !important'},
                    {
                        duration: 1000,
                        complete: function() {
                            $(this).css('color', '');
                        }
                    }
                );
        }
    }

    window.SOCKET_LISTENERS.push(function(data) {

        // identify new ranks
        var ids_new_highs = getDiffFromNewRanks('.high_ranking', data.highests);
        var ids_new_lows = getDiffFromNewRanks('.low_ranking', data.lowests);

        // display new table
        buildRankingTable(data);

        // highlight the identified new ranks
        highlightNewRanks('.high_ranking', ids_new_highs);
        highlightNewRanks('.low_ranking', ids_new_lows);
    });

})();
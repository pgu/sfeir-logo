(function() {

    var dom_of_article = [
        , '  <div id="pgu-ny-logo"       class="pgu-row-logo">'
        , '    <div id="pgu-ny-open"       class="pgu-open">[</div>'
        , '    <div id="pgu-ny-e"          class="pgu-e">≡</div>'
        , '    <div id="pgu-ny-close"      class="pgu-close">]</div>'
        , '  </div>'
        , '  <div id="pgu-ny-cube"       class="pgu-ny-cube">'
        , '    <div id="pgu-ny-cube-container"  class="pgu-ny-cube-container"></div>'
        , '    <div id="pgu-ny-cube-mask"       class="pgu-ny-cube-mask"></div>'
        , '  </div>'
    ]

    var article = $('#pgu-new-york');
    article.html(dom_of_article.join(''));
    article.addClass('pgu-article pgu-article-black');

    window.pgu_new_york = function() {
        var is_on = false;

        return {
            set_ON: function(on) {
                is_on = on;
            }
            , is_ON: function() {
                return is_on;
            }
        }
    }();

    window.SLIDES['pgu-new-york'] = {
        id: 'pgu-new-york'
        , reset: function() {
            console.log('reset new-york');
            window.pgu_new_york.set_ON(false);
        }
        , execute: function() {
            console.log('execute new-york');
            window.pgu_new_york.set_ON(true);

            $('#pgu-ny-e').off('click').on('click', function () {

                $('#pgu-ny-e').off('click');

                $('#pgu-ny-open').addClass('pgu-ny-go-to-left');
                $('#pgu-ny-close').addClass('pgu-ny-go-to-right');

                $('#pgu-ny-e').addClass('pgu-ny-go-big');

                $('#pgu-ny-logo').delay(1300).fadeOut('slow',
                    function() {
                        if (!window.pgu_new_york.is_ON()) {return;}

                        console.log('do something');
                });

            });
        }

    };

})();
(function() {

    var dom_of_article = [
        , '  <div id="pgu-nt-sf" class="pgu-nt pgu-nt-sf">SF</div>'
        , '  <div id="pgu-nt-e" class="pgu-nt pgu-nt-e">≡</div>'
        , '  <div id="pgu-nt-ir" class="pgu-nt pgu-nt-ir">IR</div>'
    ]

    var article = $('#pgu-nantes');
    article.html(dom_of_article.join(''));

    article.addClass('pgu-article');
    article.addClass('pgu-article-black');

    window.pgu_nantes_onslideenter = function() {
        console.log('nantes enter');
    };

    window.pgu_nantes_onslideleave = function() {
        console.log('nantes leave');
    };

})();


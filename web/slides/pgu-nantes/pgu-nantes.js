(function() {

    // init DOM
    var dom_of_article = [
        , '  <div id="pgu-nt-sf" class="pgu-nt pgu-nt-sf">SF</div>'
        , '  <div id="pgu-nt-e" class="pgu-nt pgu-nt-e">≡</div>'
        , '  <div id="pgu-nt-ir" class="pgu-nt pgu-nt-ir">IR</div>'
    ]

    var article = $('#pgu-nantes');
    article.html(dom_of_article.join(''));

    article.addClass('pgu-article');
    article.addClass('pgu-article-black');










    // when the user gets to the slide,
    // animate it!
    window.SLIDES['pgu-nantes'] = {
        'reset': function() {
                console.log('reset nantes');
        }
      , 'execute': function() {
                console.log('execute nantes');
        }
    };

})();


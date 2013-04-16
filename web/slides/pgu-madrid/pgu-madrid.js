(function() {

    var dom = [
        , '  <div id="pgu-md-sf" class="pgu-md pgu-md-sf">SF</div>'
        , '  <div id="pgu-md-e" class="pgu-md pgu-md-e">≡</div>'
        , '  <div id="pgu-md-ir" class="pgu-md pgu-md-ir">IR</div>'
    ]

    $('#pgu-madrid').html(dom.join(''));
    $('#pgu-madrid').addClass('pgu-md-article');

    window.SLIDES['pgu-madrid'] = {
        'reset': function() {
            console.log('reset madrid');
        }
        , 'execute': function() {
            console.log('execute madrid');
        }
    };

})();

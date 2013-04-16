(function() {

    // init DOM
    var dom_of_article = [
        , '  <div id="pgu-nt-logo"       class="pgu-nt-logo">'
        , '    <div id="pgu-nt-open"       class="pgu-nt-open">[</div>'
        , '    <div id="pgu-nt-sf"         class="pgu-nt-sf">SF</div>'
        , '    <div id="pgu-nt-e"          class="pgu-nt-e">≡</div>'
        , '    <div id="pgu-nt-ir"         class="pgu-nt-ir">I R</div>'
        , '    <div id="pgu-nt-close"      class="pgu-nt-close">]</div>'
        , '  </div>'
        , '  <div id="pgu-nt-cube"       class="pgu-nt-cube">'
        , '    <div id="pgu-nt-cube-container"  class="pgu-nt-cube-container"></div>'
        , '    <div id="pgu-nt-cube-mask"       class="pgu-nt-cube-mask"></div>'
        , '  </div>'
    ]

    var article = $('#pgu-nantes');
    article.html(dom_of_article.join(''));

    article.addClass('pgu-article');
    article.addClass('pgu-article-black');

    // when the user gets to the slide,
    // animate it!
    window.SLIDES['pgu-nantes'] = {
        id: 'pgu-nantes'
      , reset: function() {
                console.log('reset nantes');

            $('#pgu-nt-cube-mask').removeClass('pgu-nt-transparency');

            window.killFirstRender('pgu-nt-cube-container');
            $('#pgu-nt-cube').removeClass('pgu-nt-cube-go-front');
            $('#pgu-nt-e').removeClass('pgu-nt-rotate');

            $('#pgu-nt-e').fadeIn();

            $('#pgu-nt-open').removeClass('pgu-nt-go-to-left');
            $('#pgu-nt-close').removeClass('pgu-nt-go-to-right');

        }
      , execute: function() {
                console.log('execute nantes');

            $('#pgu-nt-e').off('click').on('click', function () {
                $('#pgu-nt-open').addClass('pgu-nt-go-to-left');
                $('#pgu-nt-close').addClass('pgu-nt-go-to-right');

                setTimeout(function() {
                    $('#pgu-nt-e').addClass('pgu-nt-rotate');
                }, 400);

                $('#pgu-nt-e').delay(2700).fadeOut('slow',
                    function() {
                        // avance mask & container
                        $('#pgu-nt-cube').addClass('pgu-nt-cube-go-front');

                        setTimeout(function() {
                            // hide mask
                            $('#pgu-nt-cube-mask').addClass('pgu-nt-transparency');

                            // show end of animation
                            show_logo_when_animation_is_over('pgu-nantes');

                        }, 400);

                        var callback = function(scene) {
                            var loader = new THREE.ColladaLoader();
                            loader.options.convertUpAxis= true;
                            loader.options.upAxis = 'Y';

                            loader.load('/slides/pgu-nantes/pgu-cube.dae',
                                function(collada)
                                {
                                    var scale = new THREE.Vector3(1,1,1);
                                    var model = collada.scene;
                                    model.position.z = 0;
                                    model.position.y = -20;
                                    model.scale.copy(scale);
                                    model.name = "pgu-nt-cube";

                                    // window.model_E = model;

                                    scene.add(model);
                                } );
                        }

                        // render cube
                        var config = {
                            id: 'pgu-nt-cube-container'
                          , callback: callback
                          , wants_to_rotate: true
                        }

                        window.firstRender(config);
                    }
                );

            });


        }
    };

})();


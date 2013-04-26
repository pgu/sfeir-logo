(function() {

    var dom_of_article = [
          '  <div id="pgu-md-android"        class="pgu-md-cube pgu-md-android"></div>'
        , '  <div id="pgu-md-android-static" class="pgu-md-static pgu-md-logo-android"></div>'
        , '  <div id="pgu-md-gwt"            class="pgu-md-cube pgu-md-gwt"></div>'
        , '  <div id="pgu-md-gwt-static"     class="pgu-md-static pgu-md-logo-gwt"></div>'
        , '  <div id="pgu-md-logo"       class="pgu-row-logo">'
        , '    <div id="pgu-md-open"       class="pgu-open">[</div>'
        , '    <div id="pgu-md-e"          class="pgu-e pgu-md-e">≡</div>'
        , '    <div id="pgu-md-close"      class="pgu-close">]</div>'
        , '  </div>'
        , '  <div id="pgu-md-sfeir"            class="pgu-md-sfeir"></div>'
        , '  <div id="pgu-md-angular"         class="pgu-md-cube pgu-md-angular"></div>'
        , '  <div id="pgu-md-angular-static"  class="pgu-md-static pgu-md-logo-angular"></div>'
        , '  <div id="pgu-md-dart"            class="pgu-md-cube pgu-md-dart"></div>'
        , '  <div id="pgu-md-dart-static"     class="pgu-md-static pgu-md-logo-dart"></div>'
    ];

    var article = $('#pgu-madrid');
    article.html(dom_of_article.join(''));
    article.addClass('pgu-article pgu-article-black');

    var pgu_madrid = function() {

        var delay = 1000;
        var is_on = false;

        var logos = [
            {
                id: 'pgu-md-sfeir'
              , img: '/slides/pgu-madrid/img/sfeir_logo.png'
            }
          , {
                id: 'pgu-md-android'
              , img: '/slides/pgu-madrid/img/android_logo.jpg'
            }
          , {
                id: 'pgu-md-gwt'
              , img: '/slides/pgu-madrid/img/gwt_logo.png'
            }
          , {
                id: 'pgu-md-angular'
              , img: '/slides/pgu-madrid/img/angular_logo.png'
            }
          , {
                id: 'pgu-md-dart'
              , img: '/slides/pgu-madrid/img/dart_logo.png'
            }
          ];

        function render_logo(logo) {

            var render = function() {
                var render_callback = function(scene) {
                    var texture = THREE.ImageUtils.loadTexture(logo.img);
                    // textured cube
                    var cube = new THREE.Mesh(
                        new THREE.CubeGeometry(95, 95, 95),
                        new THREE.MeshLambertMaterial({map: texture}) );
                    cube.position.y = -7;
                    cube.rotation.x = 0.5;
                    cube.rotation.z = 0.5;
                    cube.name = logo.id + "-cube";
                    scene.add(cube);
                }

                var config = {
                    id: logo.id
                    , callback: render_callback
                    , wants_to_rotate: true
                }
                window.firstRender(config);
            }

            var static_img = $('#' + logo.id + '-static');
            if (static_img.length > 0) {
                static_img.fadeOut('slow',
                    function() {
                        render();
                    });

            } else {
                render();
            }

        };

        function render_late(idx) {
            return function() {
                    setTimeout(function() {
                        if (!is_on) {return;}
                        render_logo(logos[idx]);
                    }, delay * idx);
            }
        };

        return {
            set_ON: function(on) {
                is_on = on;
            }
          , is_ON: function() {
                 return is_on;
            }
          , render_logos: function() {
                for(var i = 0; i < logos.length; i++) {
                    render_late(i)();
                }
                setTimeout(function() {
                    if (!is_on) {return;}

                    // show end of animation
                    window.show_social_bar_when_animation_is_over('pgu-madrid');
                }, delay * logos.length);
            }
          , clear_logos: function() {
                for(var i = 0; i < logos.length; i++) {
                    var logo_id = logos[i].id;

                    window.killFirstRender(logo_id);

                    var static_img = $('#' + logo_id + '-static');
                    if (static_img.length > 0) {
                        static_img.fadeIn();
                    }
                }
            }
        }
    } ();

    window.SLIDES['pgu-madrid'] = {
        id: 'pgu-madrid'

      , reset: function() {
//            console.log('reset madrid');

            pgu_madrid.set_ON(false);
            pgu_madrid.clear_logos();

            $('#pgu-md-e').removeClass();
            $('#pgu-md-e').addClass('pgu-e pgu-md-e');

            $('#pgu-md-logo').fadeIn();
            $('#pgu-md-open').removeClass('pgu-go-to-left');
            $('#pgu-md-close').removeClass('pgu-go-to-right');
        }

      , execute: function() {
//            console.log('execute madrid');
            pgu_madrid.set_ON(true);

            $('#pgu-md-e').off('click').on('click', function () {

                $('#pgu-md-e').off('click');

                $('#pgu-md-e').addClass('pgu-md-logo-small-1');
                setTimeout(function() {
                    if (!pgu_madrid.is_ON()) {return;}

                    $('#pgu-md-e').removeClass('pgu-md-logo-small-1');
                    $('#pgu-md-e').addClass('pgu-md-logo-big-1');

                    setTimeout(function() {
                        if (!pgu_madrid.is_ON()) {return;}

                        $('#pgu-md-e').removeClass('pgu-md-logo-big-1');
                        $('#pgu-md-e').addClass('pgu-md-logo-small-2');

                        setTimeout(function() {
                            if (!pgu_madrid.is_ON()) {return;}

                            $('#pgu-md-e').removeClass('pgu-md-logo-small-2');
                            $('#pgu-md-e').addClass('pgu-md-logo-big-2');

                            setTimeout(function() {
                                if (!pgu_madrid.is_ON()) {return;}

                                $('#pgu-md-open').addClass('pgu-go-to-left');
                                $('#pgu-md-close').addClass('pgu-go-to-right');
                            }, 50);

                            $('#pgu-md-logo').delay(1000).fadeOut(600);
                            setTimeout(function() {
                                if (!pgu_madrid.is_ON()) {return;}
                                pgu_madrid.render_logos();
                            }, 750);

                        }, 1000);
                    }, 1000);
                }, 700);
            });

        }
    };

})();

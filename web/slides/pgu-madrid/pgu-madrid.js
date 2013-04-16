(function() {

    var dom_of_article = [
          '  <div id="pgu-md-android"        class="pgu-md-android"></div>'
        , '  <div id="pgu-md-android-static" class="pgu-md-static pgu-md-logo-android"></div>'
        , '  <div id="pgu-md-gwt"            class="pgu-md-gwt"></div>'
        , '  <div id="pgu-md-gwt-static"     class="pgu-md-static pgu-md-logo-gwt"></div>'
        , '  <div id="pgu-md-logo"       class="pgu-row-logo">'
        , '    <div id="pgu-md-open"       class="pgu-open">[</div>'
        , '    <div id="pgu-md-e"          class="pgu-e pgu-md-e">≡</div>'
        , '    <div id="pgu-md-close"      class="pgu-close">]</div>'
        , '  </div>'
        , '  <div id="pgu-md-sfeir"            class="pgu-md-sfeir"></div>'
        , '  <div id="pgu-md-angular"         class="pgu-md-angular"></div>'
        , '  <div id="pgu-md-angular-static"  class="pgu-md-static pgu-md-logo-angular"></div>'
        , '  <div id="pgu-md-dart"            class="pgu-md-dart"></div>'
        , '  <div id="pgu-md-dart-static"     class="pgu-md-static pgu-md-logo-dart"></div>'
    ]

    var article = $('#pgu-madrid');
    article.html(dom_of_article.join(''));

    article.addClass('pgu-article');
    article.addClass('pgu-article-black');

    window.pgu_madrid = function() {

        var logos = [
            {
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
          , {
                id: 'pgu-md-sfeir'
              , img: '/slides/pgu-madrid/img/sfeir_logo.png'
            }
          ];
        var current_logo_idx = 0;

        return {
            render_next_logo: function() {
                if (current_logo_idx === logos.length) {
                    return;
                }

                var next_logo_idx = current_logo_idx++;
                var next_logo = logos[next_logo_idx];

                if (next_logo_idx === logos.length - 1) {
                    $('#pgu-md-logo').fadeOut('slow');
                    // show end of animation
                    window.show_logo_when_animation_is_over('pgu-madrid');
                }

                var render = function() {
                    var render_callback = function(scene) {
                        var texture = THREE.ImageUtils.loadTexture(next_logo.img);
                        // textured cube
                        var cube = new THREE.Mesh(
                            new THREE.CubeGeometry(95, 95, 95),
                            new THREE.MeshLambertMaterial({map: texture}) );
                        cube.position.y = -7;
                        cube.rotation.x = 0.5;
                        cube.rotation.z = 0.5;
                        cube.name = next_logo.id + "-cube";
                        scene.add(cube);
                    }

                    var config = {
                        id: next_logo.id
                        , callback: render_callback
                        , wants_to_rotate: true
                    }
                    window.firstRender(config);
                }

                var static_img = $('#' + next_logo.id + '-static');
                if (static_img.length > 0) {
                static_img.fadeOut('slow',
                        function() {
                            render();
                        });

                } else {
                    render();
                }

            }
        }
    } ();

    window.SLIDES['pgu-madrid'] = {
        id: 'pgu-madrid'

      , reset: function() {
            console.log('reset madrid');
        }

      , execute: function() {
            console.log('execute madrid');

            $('#pgu-md-e').off('click').on('click', function () {

                if (window.is_md_animation_on) {
                    return;
                }

                window.is_md_animation_on = true;

                $('#pgu-md-e').addClass('pgu-md-logo-small');
                setTimeout(function() {
                    $('#pgu-md-e').removeClass('pgu-md-logo-small');
                    $('#pgu-md-e').addClass('pgu-md-logo-big');

                    setTimeout(function() {
                        $('#pgu-md-e').removeClass('pgu-md-logo-big');

                        window.pgu_madrid.render_next_logo();
                        window.is_md_animation_on = false;

                    }, 1000);

                }, 1000);

            });

        }
    };

})();

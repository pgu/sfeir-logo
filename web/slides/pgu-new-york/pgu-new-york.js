(function() {

    var dom_of_article = [
        , '  <div id="pgu-ny-logo"       class="pgu-row-logo">'
        , '    <div id="pgu-ny-open"       class="pgu-open">[</div>'
        , '    <div id="pgu-ny-e"          class="pgu-e">≡</div>'
        , '    <div id="pgu-ny-close"      class="pgu-close">]</div>'
        , '  </div>'
        , '  <div id="pgu-ny-cube"          class="pgu-ny-cube"></div>'
        , '  <div id="pgu-ny-cube-controls" class="pgu-ny-cube-controls">'
        , '    <div id="pgu-ny-cube-direction" class="pgu-ny-cube-direction pgu-ny-cube-control">'
        , '      <div id="pgu-ny-cube-dir-pause" class="pgu-ny-cube-arrow pgu-ny-cube-pause">≡</div>' //∞
        , '      <div id="pgu-ny-cube-dir-left" class="pgu-ny-cube-arrow pgu-ny-cube-left">◄</div>'
        , '      <div id="pgu-ny-cube-dir-up" class="pgu-ny-cube-arrow pgu-ny-cube-up">▲</div>'
        , '      <div id="pgu-ny-cube-dir-right" class="pgu-ny-cube-arrow pgu-ny-cube-right">►</div>'
        , '      <div id="pgu-ny-cube-dir-down" class="pgu-ny-cube-arrow pgu-ny-cube-down">▼</div>'
        , '      <div id="pgu-ny-cube-dir-bg" class="pgu-ny-cube-arrow pgu-ny-cube-bg"><div class="arr-bg">↑</div></div>'
        , '      <div id="pgu-ny-cube-dir-fg" class="pgu-ny-cube-arrow pgu-ny-cube-fg"><div class="arr-fg">↓</div></div>'
        , '    </div>'
        , '    <div id="pgu-ny-cube-orientation" class="pgu-ny-cube-orientation pgu-ny-cube-control">'
        , '      <div id="pgu-ny-cube-or-left" class="pgu-ny-cube-arrow pgu-ny-cube-left">◄</div>'
        , '      <div id="pgu-ny-cube-or-up" class="pgu-ny-cube-arrow pgu-ny-cube-up">▲</div>'
        , '      <div id="pgu-ny-cube-or-right" class="pgu-ny-cube-arrow pgu-ny-cube-right">►</div>'
        , '      <div id="pgu-ny-cube-or-down" class="pgu-ny-cube-arrow pgu-ny-cube-down">▼</div>'
        , '      <div id="pgu-ny-cube-or-bg" class="pgu-ny-cube-arrow pgu-ny-cube-bg"><div class="arr-bg">↑</div></div>'
        , '      <div id="pgu-ny-cube-or-fg" class="pgu-ny-cube-arrow pgu-ny-cube-fg"><div class="arr-fg">↓</div></div>'
        , '    </div>'
        , '  </div>'
    ]

    var article = $('#pgu-new-york');
    article.html(dom_of_article.join(''));
    article.addClass('pgu-article pgu-article-black');

    $('#pgu-ny-cube-controls').fadeOut();

    var pgu_new_york = function() {
        var z_max = 188;
        var z_min = -200;
        var x_max_coef = -0.42; // parseFloat((-80/190).toFixed(2));
        var x_min_coef = 0.42; // parseFloat((79/190).toFixed(2));
        var y_max_coef = -0.305; // parseFloat((-58/190).toFixed(2));
        var y_min_coef = 0.335; // parseFloat((58/190).toFixed(2));

        var is_on = false;

        var selected_axis = 'z';
        var coeff_dir = 1;

        var interval_id_for_animation = null;
        var the_cube = null;

        var y = y_max = y_min = x = x_max = x_min = -1;

        var should_run = true;

        var is_opening_scene = true;
        var opening_coef = 1;

        var reset_animation = function() {

//            console.log('reset animation');

            clearInterval(interval_id_for_animation);
            killFirstRender('pgu-ny-cube');

            $('#pgu-ny-cube-controls').fadeOut();

            is_on = false;

            selected_axis = 'z';
            coeff_dir = 1;

            interval_id_for_animation = null;
            the_cube = null;

            y = y_max = y_min = x = x_max = x_min = -1;

            should_run = true;
            $('#pgu-ny-cube-dir-pause')[0].innerHTML = '≡';

            is_opening_scene = true;
            opening_coef = 1;
        }

        var move_cube = function(model) {

            if (!is_on) {return;}

            the_cube = model;

            interval_id_for_animation = setInterval(function() {

                if (!is_on) {return;}

                //
                // opening scene, no controls for the user
                //
                if (is_opening_scene) {
                    var current_z = the_cube.position.z;

                    // once the cube came to user, makes it come back
                    if (opening_coef === 1 && current_z > 300) {
                        opening_coef = -1;
                    }

                    // the opening scene is over, let the user handles the cube
                    if (opening_coef === -1 && current_z === 40) {
                        is_opening_scene = false;

                        // let the cube going on
                        selected_axis = 'z';
                        coeff_dir = opening_coef;

                        // show controls
                        initControls();

                        // show end of animation
                        show_social_bar_when_animation_is_over('pgu-new-york');
                        return;
                    }

                    // animate the cube
                    the_cube.position.z = the_cube.position.z + 4 * opening_coef;
                    return;
                }

                //
                // animation for the user
                //
                if (!should_run) {
                     return;
                }

                var z = the_cube.position.z;
                x = the_cube.position.x;
                y = the_cube.position.y;

                y_max = y_max_coef * z + 44;
                y_min = y_min_coef * z - 80;

                x_max = x_max_coef * z + 90;
                x_min = x_min_coef * z - 89;

                if (selected_axis === 'z') {
                    if (!(z_min < z && z < z_max)) {
                        coeff_dir *= -1;
                    }
                } else if (selected_axis === 'y') {
                    if (!(y_min < y && y < y_max)) {
                        coeff_dir *= -1;
                    }
                } else if (selected_axis === 'x') {
                    if (!(x_min < x && x < x_max)) {
                        coeff_dir *= -1;
                    }
                } else {
                    throw 'No selected axis!';
                }

                the_cube.position[selected_axis] = the_cube.position[selected_axis] + (4 * coeff_dir);

                // update borders
                if (x < x_min) {
                    the_cube.position.x = x_min + 1;
                }
                if (x_max < x) {
                    the_cube.position.x = x_max - 1;
                }
                if (y < y_min) {
                    the_cube.position.y = y_min + 1;
                }
                if (y_max < y) {
                    the_cube.position.y = y_max - 1;
                }

                // only for debug
//                console.log('z: ' + the_cube.position.z);
//                console.log('x: ' + the_cube.position.x + ', max: '+ x_max + ', min: ' + x_min);
//                console.log('y: ' + the_cube.position.y + ', max: '+ y_max + ', min: ' + y_min);

            }, 50);
        }

        var render_callback = function(scene) {

            var loader = new THREE.ColladaLoader();
            loader.options.convertUpAxis= true;
            loader.options.upAxis = 'Y';

            loader.load('/slides/pgu-new-york/pgu-cube.dae',
                function(collada)
                {
                    var scale = new THREE.Vector3(1,1,1);
                    var model = collada.scene;
                    model.position.z = 0;
                    model.position.y = -17;
                    model.scale.copy(scale);
                    model.name = "pgu-ny-cube";

                    scene.add(model);

//                    window.debug_model = model; // only for debug

                    move_cube(model);
                } );
        }

        // render cube
        var config = {
            id: 'pgu-ny-cube'
            , callback: render_callback
            , wants_to_rotate: false
        }

        var initControls = function() {
            $('#pgu-ny-cube-controls').fadeIn('slow');

            $('#pgu-ny-cube-dir-pause').off('click').on('click', function() {
                should_run = !should_run;
                $('#pgu-ny-cube-dir-pause')[0].innerHTML = should_run ? '≡' : '∞';
            });

            $('#pgu-ny-cube-dir-left').off('click').on('click', function() {
                if (x_min < x && x < x_max) {
                    selected_axis = 'x';
                    coeff_dir = -1;
                }
            });

            $('#pgu-ny-cube-dir-right').off('click').on('click', function() {
                if (x_min < x && x < x_max) {
                    selected_axis = 'x';
                    coeff_dir = 1;
                }
            });

            $('#pgu-ny-cube-dir-up').off('click').on('click', function() {
                if (y_min < y && y < y_max) {
                    selected_axis = 'y';
                    coeff_dir = 1;
                }
            });

            $('#pgu-ny-cube-dir-down').off('click').on('click', function() {
                if (y_min < y && y < y_max) {
                    selected_axis = 'y';
                    coeff_dir = -1;
                }
            });

            $('#pgu-ny-cube-dir-fg').off('click').on('click', function() {
                selected_axis = 'z';
                coeff_dir = 1;
            });

            $('#pgu-ny-cube-dir-bg').off('click').on('click', function() {
                selected_axis = 'z';
                coeff_dir = -1;
            });

            //
            // orientation
            //
            var coeff_rotation = 0.75;

            $('#pgu-ny-cube-or-left').off('click').on('click', function() {
                the_cube.rotation.y -= coeff_rotation;
            });

            $('#pgu-ny-cube-or-right').off('click').on('click', function() {
                the_cube.rotation.y += coeff_rotation;
            });

            $('#pgu-ny-cube-or-up').off('click').on('click', function() {
                the_cube.rotation.x -= coeff_rotation;
            });

            $('#pgu-ny-cube-or-down').off('click').on('click', function() {
                the_cube.rotation.x += coeff_rotation;
            });

            $('#pgu-ny-cube-or-fg').off('click').on('click', function() {
                the_cube.rotation.z += coeff_rotation;
            });

            $('#pgu-ny-cube-or-bg').off('click').on('click', function() {
                the_cube.rotation.z -= coeff_rotation;
            });

        }

        return {
            set_ON: function(on) {
                is_on = on;
            }
          , is_ON: function() {
                return is_on;
            }
          , show_cube: function() {
                window.firstRender(config);
            }
          , reset: function() {
                reset_animation();
            }
    }
    }();

    window.SLIDES['pgu-new-york'] = {
        id: 'pgu-new-york'

        , reset: function() {
//            console.log('reset new-york');
            pgu_new_york.set_ON(false);
            pgu_new_york.reset();

            $('#pgu-ny-open').removeClass('pgu-ny-go-to-left');
            $('#pgu-ny-close').removeClass('pgu-ny-go-to-right');

            $('#pgu-ny-e').removeClass('pgu-ny-go-big');

            $('#pgu-ny-logo').fadeIn();
        }

        , execute: function() {
//            console.log('execute new-york');
            pgu_new_york.set_ON(true);

            $('#pgu-ny-e').off('click').on('click', function () {

                $('#pgu-ny-e').off('click');

                $('#pgu-ny-open').addClass('pgu-ny-go-to-left');
                $('#pgu-ny-close').addClass('pgu-ny-go-to-right');

                $('#pgu-ny-e').addClass('pgu-ny-go-big');

                $('#pgu-ny-logo').delay(1300).fadeOut('slow',
                    function() {
                        if (!pgu_new_york.is_ON()) {return;}
                        pgu_new_york.show_cube();
                });

            });
        }

    };

})();
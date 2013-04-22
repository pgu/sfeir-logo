// see http://animateyourhtml5.appspot.com/
function firstRender(config)
{
    // dimensions
    var canvascontainer = document.getElementById(config.id);
    // relaunch if not ready
    if (canvascontainer == null || canvascontainer.clientWidth == 0 || canvascontainer.clientHeight == 0 || canvascontainer.animation === -1) { window.setTimeout(function() {firstRender(id);}, 200); return; }

    // do nothing if already running
    if (canvascontainer.animation)
        return;
    else
        canvascontainer.animation = true;

    var width  = canvascontainer.clientWidth;
    var height = canvascontainer.clientHeight-2; // unfathomable bug: why do I get a scroll bar with the full height ???

    // renderer
    var renderer = null;
    try {
        renderer = new THREE.WebGLRenderer ({antialias: true});
    } catch (e) {
        window.inform_user_of_webgl_error();
        throw e;
    }
    renderer.setSize(width, height);

    // glue to HTML element
    canvascontainer.appendChild(renderer.domElement);
    renderer.setClearColorHex(0x000000, 0);
    renderer.clear();

    // camera
    var camera = new THREE.PerspectiveCamera(35, width / height, 1, 3000);
    camera.position.z = 300; // 300

    // scene
    var scene = new THREE.Scene();

    // lights
    var light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 0.3);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(-1, 1, -0.3);
    scene.add(light2);

    var light3 = new THREE.DirectionalLight(0xffffff, 0.7);
    light3.position.set(0.5, -0.5, 1);
    scene.add(light3);

    // textured cube
    config.callback(scene);

    var t0 = new Date().getTime();

    var anim = function()
    {
        var t = new Date().getTime();
        // when the canvas dies, abort animation loop
        if (canvascontainer.animation)
        {
            scene.traverse(function(object)
            {
                if (config.wants_to_rotate) {
                    // models: slow rotation
                    if (object instanceof THREE.Object3D)
                    {
                        object.rotation.y = (t-t0)/1000 - Math.PI/2;
                    };
                }
            } );

            renderer.render(scene, camera);
            requestAnimationFrame(anim);
        }
    };
    requestAnimationFrame(anim);
}

function killFirstRender(id)
{
    var canvascontainer = document.getElementById(id);
    canvascontainer.animation = -1; // dying (set this wether the animation is running or not)
    window.setTimeout(function()
    {
        // signal death of this animation
        delete canvascontainer.animation;
        if (canvascontainer.firstChild !== null) {
            //              canvascontainer.removeChild(canvascontainer.firstChild); // [pgu] it does not work
            canvascontainer.innerHTML = "";
        }

    }, 300);
}

function show_social_bar_when_animation_is_over(article_id) {
    var article = $('#' + article_id)[0];

    var social_bar = $('#sfeir_social_bar')[0];
    social_bar.style.top =  article.offsetTop + 10 + 'px';
    social_bar.style.left = article.offsetLeft + 293 + 'px';

    $('#sfeir_social_bar').delay(1000).fadeIn();
}

function hide_social_bar() {
    $('#sfeir_social_bar').fadeOut();
}

function inform_user_of_webgl_error() {
    $('.frame-error-for-webgl').remove();
    $('article.current').append('<iframe src="/error_with_webGL.html" class="frame-error-for-webgl"></iframe>');
}
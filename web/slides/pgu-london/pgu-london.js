(function() {
    var dom_of_article = '<canvas class="sfeir-invaders-container"></canvas>';   // Here is the dom that will be appended to your 'article'

    var article = $('#pgu-london');
    article.html(dom_of_article.join(''));
    article.addClass('pgu-article pgu-article-black');

    var pgu_london = function() {
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

    window.SLIDES['pgu-london'] = {
        id: 'pgu-london'
        , reset: function() {

        }
        , execute: function() {

        }
    }

    var game = new function() {
        var KEY_CODES = { 106: 'left', 108: 'right', 107: 'fire' };
        this.keys = {};

        this.initialize = function(canvas_dom, callbacks) {
            this.canvas_elem = $(canvas_dom)[0];
            this.canvas = this.canvas_elem.getContext('2d');
            this.width = 800;
            this.height = 700;

            $(window).keydown(function(event) {
                var action = KEY_CODES[event.keyCode];
                if (action) {
                    game.keys[action] = true;
                }
            });

            $(window).keyup(function(event) {
                var action = KEY_CODES[event.keyCode];
                if (action) {
                    game.keys[action] = false;
                }
            });

            this.callbacks = callbacks;
        }

        this.loadBoard = function(board) {
            game.board = board;
        }

        this.loop = function() {
            game.board.step(30/100);
            game.board.render(game.canvas);
            setTimeout(game.loop, 30);
        }
    }

    var pictures = new function() {

        this.map = {};

        var img_android = new Image();
        img_android.src = '/slides/pgu-london/img/android.png';

        var img_angular = new Image();
        img_android.src = '/slides/pgu-london/img/angularjs.png';

        var img_appengine = new Image();
        img_appengine.src = '/slides/pgu-london/img/appengine.png';

        var img_bug = new Image();
        img_bug.src = '/slides/pgu-london/img/bug.png';

        var img_cloud = new Image();
        img_cloud.src = '/slides/pgu-london/img/cloud.png';

        var img_compute = new Image();
        img_compute.src = '/slides/pgu-london/img/compute.png';

        var img_dart = new Image();
        img_dart.src = '/slides/pgu-london/img/dart.png';

        var img_sfeir = new Image();
        img_sfeir.src = '/slides/pgu-london/img/sfeir.png';

        this.draw = function(canvas, img_name, x, y, frame) {
            var img = this.map[img_name];
            if(!frame) frame = 0;
            canvas.drawImage(img, x, y);
        }
    }

    var game_screen = function(text, text2, callback) {
        this.step = function(dt) {
            if (game.keys['fire'] && callback) callback();
        }

        this.render = function(canvas) {
            canvas.clearRect(0, 0, game.width, game.height);
            canvas.font = "bold 40px arial";

            var measure = canvas.measureText(text);
            canvas.fillStyle = "#FFF";
            canvas.fillText(text, game.width /2 - measure.width/2, game.height/2);
            canvas.font = "bold 20px arial";

            var measure2 = canvas.measureText(text2);
            canvas.fillText(text2, game.width/2 - measure2.width/2, game.height/2 + 40);
        }
    }

    function start_game() {
        var screen = new GameScreen('Sfeir Invaders', 'press "k" to start', function() {
//            game.loadBoard(new );
        })
    }


})();
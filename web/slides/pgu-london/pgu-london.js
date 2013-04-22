(function() {
    var dom_of_article = '<canvas id="sfeir-invaders" class="sfeir-invaders-container"></canvas>';   // Here is the dom that will be appended to your 'article'

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
            game.initialize('#sfeir-invaders', {
                'start': start_game(),
                'die': end_game(),
                'wind': win_game()
            });
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

    var pictures_data = {
        'bug': { cls: Bug, w: 110, h: 110}
      , 'player': { cls: Player, w: 110, h: 110}
      , 'missile': { cls: Missile, w: 50, h: 50}
    }


    var GameScreen = function(text, text2, callback) {
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
        var screen = new GameScreen('Sfeir Invaders', 'press "k" to start',
            function() {
                game.loadBoard(new GameBoard());
            }
        );
        game.loadBoard(screen);
        game.loop();
    }

    var GameBoard = function()  {
        this.removed_objs = [];
        this.missiles = 0;

        var board = this;

        this.add = function(obj) { obj.board = this; this.objects.push(obj); return obj;}
        this.remove = function(obj) { this.removed_objs.push(obj); }

        this.addPicture = function(name, x, y, opts) {
            var ref = pictures.map[name];
            var picture = this.add(new ref.cls(opts));
            picture.name = name;
            picture.x = x; picture.y = y;
            picture.w = ref.w;
            picture.h = ref.h;
            return picture;
        }
    }

    this.iterate = function(fn) {
        for (var i= 0, len=this.objects.length; i<len; i++) {
            fn.call(this.objects[i]);
        }
    }

    this.detect = function(fn) {
        for (var i= 0, val = null, len = this.objects.length; i< len; i++) {
            if (fn.call(this.objects[i])) return this.objects[i];
        }
        return false;
    }

    this.step = function(dt) {
        this.removed_objs = [];
        this.iterate(function() {
            if (!this.step(dt)) this.die();
        });

        for(var i = 0, len = this.removed_objs.length; i < len; i++) {
            var idx = this.objects.indexOf(this.removed_objs[i]);
            if(idx != -1) this.objects.splice(idx, 1);
        }
    }

    this.render = function(canvas) {
        canvas.clearRect(0, 0, game.width, game.height);
        this.iterate(function() {
            this.draw(canvas);
        })
    }

    this.collision = function(o1, o2) {
        return !(
                 (o1.y + o1.h -1 < o2.y)
              || (o1.y > o2.y + o2.h -1)
              || (o1.x + o1.w -1 < o2.x)
              || (o1.x > o2.x + o2.w - 1)
            );
    }

    this.collide = function(obj) {
        return this.detect(function() {
            if(obj != this) {
                return board.collision(obj, this) ? this: false;
            }
        })
    }

    var game_level = [
        [1, 1, 1, 1, 1, 1, 1]
      , [1, 1, 1, 1, 1, 1, 1]
      , [1, 1, 1, 1, 1, 1, 1]
      , [1, 1, 1, 1, 1, 1, 1]
      , [1, 1, 1, 1, 1, 1, 1]
      , [1, 1, 1, 1, 1, 1, 1]
    ]

    this.loadLevel = function(level) {

        this.objects = [];
        this.player = this.addPicture('player'
            , game.width / 2 // x
            , game.height - pictures.map['player'].h - 10 // y
        );

        var flock = this.add(new BugFlock());
        for (var y = 0, rows = level.length; y < rows; y++) {
            for (var x = 0, cols = level[y].length; x < cols; x++) {
                var bug = pictures.map['bug'];
                if(bug) {
                    this.addPicture('bug',
                        (bug.w + 10) * x,
                        bug.h * y,
                        {flock : flock} // options
                    );
                }
            }
        }

    }

    this.loadLevel(game_level);


})();
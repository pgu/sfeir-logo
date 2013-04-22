//https://github.com/cykod/AlienInvasion/blob/master/engine.js
//https://github.com/cykod/AlienInvasion/blob/master/game.js

(function() {

    var article = $('#pgu-london');
    article.html('<canvas id="sfeir-invaders" class="sfeir-invaders-container"></canvas>');
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

        var board = {};

        this.initialize = function(canvas_id, callbacks) {

            this.width = 800;
            this.height = 700;

            this.canvas = document.getElementById(canvas_id);

            this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
            if(!this.ctx) { return alert("Please upgrade your browser to play"); }

            this.setupInput();

            this.loop();

            // TODO pictures.load();

            this.callbacks = callbacks;
        }

        var KEY_CODES = { 106: 'left', 108: 'right', 107: 'fire' };
        this.keys = {};

        this.setupInput = function() {
            $(window).keydown(function(event) {
                var action = KEY_CODES[event.keyCode];
                if (action) {
                    game.keys[action] = true;
                    event.preventDefault();
                }
            });

            $(window).keyup(function(event) {
                var action = KEY_CODES[event.keyCode];
                if (action) {
                    game.keys[action] = false;
                    event.preventDefault();
                }
            });
        }

        var lastTime = new Date().getTime();
        var maxTime = 1/30;

        this.loop = function() {
//            game.board.step(30/100);
//            game.board.render(game.canvas);
//            setTimeout(game.loop, 30);

            var curTime = new Date().getTime();
            requestAnimationFrame(game.loop);
            var dt = (curTime - lastTime)/1000;
            if(dt > maxTime) { dt = maxTime; }

            board.step(dt);
            board.draw(game.ctx);
            lastTime = curTime;
        }

        this.setBoard = function(a_board) {
            board = a_board;
        }

    }

    var pictures_data = {
        'bug': { cls: Bug, w: 110, h: 110}
        , 'player': { cls: Player, w: 110, h: 110}
        , 'missile': { cls: Missile, w: 50, h: 50}
    }

    var pictures = new function() {

        // my_map
        this.my_map = {};

        var pics = ['bug', 'sfeir', 'android', 'angularjs', 'appengine', 'cloud', 'compute', 'dart'];
        for (var i = 0; i < pics.length; i++) {
            var pic_name = pics[i];

            var pic = new Image();
            pic.src = '/slides/pgu-london/img/' + pic_name + '.png';

            this.my_map[pic_name] = pic;
        }


        // pictures
        this.map = {};

        this.load = function(pictures_data, callback) {
            this.map = pictures_data;
        }

        this.draw = function(ctx, img_name, x, y, frame) {

            var pic_name = null;

            if ('bug' === img_name) {
                pic_name = 'bug';

            } else if ('player' === img_name) {
                pic_name = 'sfeir';

            } else if ('missile' === img_name) {
                pic_name = 'android'; // TODO aleatoire

            } else {
                throw 'unknown img_name: ' + img_name;
            }

            var pic = this.my_map[pic_name];
            var img_data = this.map[img_name];

            if(!frame) frame = 0;
            ctx.drawImage(pic, Math.floor(x), Math.floor(y), img_data.w, img_data.h);
        };

        return this;
    }

    var TitleScreen = function(title, subtitle, callback) {
        var up = false;

        this.step = function(dt) {
            if (!game.keys['fire']) up = true;
            if (up && game.keys['fire'] && callback) callback();
        }

        this.draw = function(ctx) {
            ctx.fillStyle = "#FFFFFF";

            ctx.font = "bold 40px bangers";
            var measure = ctx.measureText(title);
            ctx.fillText(title, game.width/2 - measure.width/2, game.height/2);

            ctx.font = "bold 20px bangers";
            var measure2 = ctx.measureText(subtitle);
            ctx.fillText(subtitle, game.width/2 - measure2.width/2, game.height/2 + 40);
        }
    }

    var GameBoard = function()  {
        var board = this;

        this.objects = [];
        this.cnt = {};

        this.removed_objs = [];
        this.missiles = 0;


        this.add = function(obj) {
            obj.board=this;
            this.objects.push(obj);
            this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
            return obj;
        };

        // Mark an object for removal
        this.remove = function(obj) {
            var idx = this.removed.indexOf(obj);
            if(idx == -1) {
                this.removed.push(obj);
                return true;
            } else {
                return false;
            }
        };

        // Reset the list of removed objects
        this.resetRemoved = function() { this.removed = []; };

        // Removed an objects marked for removal from the list
        this.finalizeRemoved = function() {
            for(var i=0,len=this.removed.length;i<len;i++) {
                var idx = this.objects.indexOf(this.removed[i]);
                if(idx != -1) {
                    this.cnt[this.removed[i].type]--;
                    this.objects.splice(idx,1);
                }
            }
        };

        // Call the same method on all current objects
        this.iterate = function(funcName) {
            var args = Array.prototype.slice.call(arguments,1);
            for(var i=0,len=this.objects.length;i<len;i++) {
                var obj = this.objects[i];
                obj[funcName].apply(obj,args);
            }
        };

        // Find the first object for which func is true
        this.detect = function(func) {
            for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
                if(func.call(this.objects[i])) return this.objects[i];
            }
            return false;
        };

        // Call step on all objects and them delete
        // any object that have been marked for removal
        this.step = function(dt) {
            this.resetRemoved();
            this.iterate('step',dt);
            this.finalizeRemoved();
        };

        this.addPicture = function(name, x, y, opts) {
            var ref = pictures.map[name];
            var picture = this.add(new ref.cls(opts));
            picture.name = name;
            picture.x = x; picture.y = y;
            picture.w = ref.w;
            picture.h = ref.h;
            return picture;
        }

        this.draw= function(ctx) {
            this.iterate('draw',ctx);
        };

        // Check for a collision between the
        // bounding rects of two objects
        this.overlap = function(o1,o2) {
            return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
                (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
        };

        // Find the first object that collides with obj
        // match against an optional type
        this.collide = function(obj,type) {
            return this.detect(function() {
                if(obj != this) {
                    var col = (!type || this.type & type) && board.overlap(obj,this);
                    return col ? this : false;
                }
            });
        };

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
        this.player = game.board.addPicture('player'
            , game.width / 2 // x
            , game.height - pictures.map['player'].h - 10 // y
        );

        var flock = this.add(new BugFlock());
        for (var y = 0, rows = level.length; y < rows; y++) {
            for (var x = 0, cols = level[y].length; x < cols; x++) {
                var bug = pictures.map['bug'];
                if(bug) {
                    game.board.addPicture('bug',
                        (bug.w + 10) * x,
                        bug.h * y,
                        {flock : flock} // options
                    );
                }
            }
        }

    }

    this.loadLevel(game_level);

    var Missile = function() {
    }

    Missile.prototype.draw = function(canvas) {
        pictures.draw(canvas, 'missile', this.x, this.y);
    }

    Missile.prototype.step = function(dt) {
        this.y += this.dy *dt;

        var enemy = this.board.collide(this);
        if (enemy) {
            enemy.die();
            return false;
        }

        return !(this.y < 0 || this.y > game.height);
    }

    Missile.prototype.die = function() {
        if(this.player) {
            this.board.missiles--;
        }

        if (this.board.missiles < 0) {
            this.board.missiles = 0;
        }

        this.board.remove(this);
    }

    var Player = function Player(opts) {
        this.reloading = 0;
    }

    Player.prototype.draw = function(canvas) {
        pictures.draw(canvas, 'player', this.x, this.y);
    }

    Player.prototype.die = function() {
        game.callbacks['die']();
    }

    Player.prototype.step = function(dt) {
        if (game.keys['left']) { this.x -= 100 *dt; }
        if (game.keys['right']) { this.x += 100 *dt; }

        if (this.x < 0) this.x = 0;
        if (this.x > game.width - this.w) this.x = game.width = this.w;

        this.reloading--;

        if (game.keys['fire'] && this.reloading <= 0 && this.board.missiles < 3) {
            this.board.addPicture('missile',
                this.x + this.w / 2 - pictures.map.missile.w / 2,
                this.y - this.h,
                { dy: -100, player: true}
            );
            this.board.missiles++;
            this.reloading = 10;
        }
        return true;
    }

    var BugFlock = function() {
        this.dx = 10; this.dy = 10;
        this.hit = 1; this.lastHit = 0;
        this.speed = 10;

        this.draw = function() {};

        this.die = function() {
            game.callbacks['win']();
        }
    }

    this.step = function(dt) {
        if (this.hit && this.hit != this.lastHit) {
            this.lastHit = this.hit;
            this.dy = this.speed;
        } else {
            this.dy = 0;
        }
        this.dx = this.speed * this.hit;

        var max = {}, cnt = 0;

        this.board.iterate(function() {
            if (this instanceof Bug) {
                if (!max[this.x] || this.y > max[this.x]) {
                    max[this.x] = this.y;
                }
                cnt++;
            }
        });

        if(cnt ==0) {this.die();}

        this.max_y = max;
        return true;
    }

    var Bug = function (opts) {
        this.flock = opts['flock'];
        this.frame = 0;
        this.mx = 0;
    }

    Bug.prototype.draw = function(canvas) {
        pictures.draw(canvas, this.name, this.x, this.y);
//        pictures.draw(canvas, this.name, this.x, this.y, this.frame);
    }

    Bug.prototype.die = function() {
        this.flock.speed +=1;
        this.board.remove(this);
    }

    Bug.prototype.step = function(dt) {
        this.mx += dt * this.flock.dx;
        this.y += this.flock.dy;

        if(Math.abs(this.mx) > 10) {
            if (this.y == this.flock.max_y[this.x]) {
                this.fireSometimes();
            }
            this.x += this.mx;
            this.mx = 0;
            this.frame = (this.frame+1) % 2;
            if (this.x > game.width - pictures.map.bug.w *2) this.flock.hit = -1;
            if (this.x < pictures.map.bug.w) this.flock.hit = 1;
        }
        return true;
    }

    Bug.prototype.fireSometimes = function() {
        if (Math.random() * 100 < 10) {
            this.board.addPicture('missile', this.x + this.w/2 - pictures.map.missile.w / 2,
                this.y + this.h,
                {dy: 100});
        }
    }

    function start_game() {
        var screen = new TitleScreen('Sfeir Invaders', 'press "k" to start',
            function() {
                game.loadBoard(new GameBoard());
            }
        );
        game.loadBoard(screen);
        game.loop();
    }


})();
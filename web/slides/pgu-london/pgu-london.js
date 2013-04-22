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
            Game.initialize('sfeir-invaders', sprites, start_game);
        }
    }

    // engine.js
    var Game = new function() {

        var boards = [];

        this.initialize = function(canvas_id, sprite_data, callback) {

            this.width = 800;
            this.height = 700;

            this.canvas = document.getElementById(canvas_id);

            this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
            if(!this.ctx) { return alert("Please upgrade your browser to play"); }

            this.setupInput();

            this.loop();

            SpriteSheet.load(sprite_data, callback);
        }

        var KEY_CODES = { 106: 'left', 108: 'right', 107: 'fire' };
        this.keys = {};

        this.setupInput = function() {
            $(window).keydown(function(event) {
                var action = KEY_CODES[event.keyCode];
                if (action) {
                    Game.keys[action] = true;
                    event.preventDefault();
                }
            });

            $(window).keyup(function(event) {
                var action = KEY_CODES[event.keyCode];
                if (action) {
                    Game.keys[action] = false;
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
            requestAnimationFrame(Game.loop);
            var dt = (curTime - lastTime)/1000;
            if(dt > maxTime) { dt = maxTime; }

            for(var i=0,len = boards.length;i<len;i++) {
                if(boards[i]) {
                    boards[i].step(dt);
                    boards[i].draw(Game.ctx);
                }
            }

            lastTime = curTime;
        }

        // Change an active game board
        this.setBoard = function(num,board) { boards[num] = board; };
    }

    var SpriteSheet = new function() {

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

        this.load = function(spriteData, callback) {
            this.map = spriteData;
            callback();
        }

        this.draw = function(ctx, img_name, x, y, frame) {

            var pic_name = null;

            if ('enemy' === img_name) {
                pic_name = 'bug';

            } else if ('enemy_missile' === img_name) {
                pic_name = 'dart'; // TODO fixit

            } else if ('player' === img_name) {
                pic_name = 'sfeir';

            } else if ('missile' === img_name) {
                pic_name = 'android'; // TODO aleatoire

            } else if ('explosion' === img_name) {
                pic_name = 'angularjs'; // TODO fixit

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
            if (!Game.keys['fire']) up = true;
            if (up && Game.keys['fire'] && callback) callback();
        }

        this.draw = function(ctx) {
            ctx.fillStyle = "#FFFFFF";

            ctx.font = "bold 40px bangers";
            var measure = ctx.measureText(title);
            ctx.fillText(title, Game.width/2 - measure.width/2, Game.height/2);

            ctx.font = "bold 20px bangers";
            var measure2 = ctx.measureText(subtitle);
            ctx.fillText(subtitle, Game.width/2 - measure2.width/2, Game.height/2 + 40);
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
            var ref = SpriteSheet.map[name];
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

    };

    var Sprite = function() { };

    Sprite.prototype.setup = function(sprite,props) {
        this.sprite = sprite;
        this.merge(props);
        this.frame = this.frame || 0;
        this.w =  SpriteSheet.map[sprite].w;
        this.h =  SpriteSheet.map[sprite].h;
    };

    Sprite.prototype.merge = function(props) {
        if(props) {
            for (var prop in props) {
                this[prop] = props[prop];
            }
        }
    };

    Sprite.prototype.draw = function(ctx) {
        SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
    };

    Sprite.prototype.hit = function(damage) {
        this.board.remove(this);
    };

    var Level = function(levelData,callback) {
        this.levelData = [];
        for(var i =0; i<levelData.length; i++) {
            this.levelData.push(Object.create(levelData[i]));
        }
        this.t = 0;
        this.callback = callback;
    };

    Level.prototype.step = function(dt) {
        var idx = 0, remove = [], curShip = null;

        // Update the current time offset
        this.t += dt * 1000;

        //   Start, End,  Gap, Type,   Override
        // [ 0,     4000, 500, 'step', { x: 100 } ]
        while((curShip = this.levelData[idx]) &&
            (curShip[0] < this.t + 2000)) {
            // Check if we've passed the end time
            if(this.t > curShip[1]) {
                remove.push(curShip);
            } else if(curShip[0] < this.t) {
                // Get the enemy definition blueprint
                var enemy = enemies[curShip[3]],
                    override = curShip[4];

                // Add a new enemy with the blueprint and override
                this.board.add(new Enemy(enemy,override));

                // Increment the start time by the gap
                curShip[0] += curShip[2];
            }
            idx++;
        }

        // Remove any objects from the levelData that have passed
        for(var i=0,len=remove.length;i<len;i++) {
            var remIdx = this.levelData.indexOf(remove[i]);
            if(remIdx != -1) this.levelData.splice(remIdx,1);
        }

        // If there are no more enemies on the board or in
        // levelData, this level is done
        if(this.levelData.length === 0 && this.board.cnt[OBJECT_ENEMY] === 0) {
            if(this.callback) this.callback();
        }

    };

    Level.prototype.draw = function(ctx) { };

    var GamePoints = function() {
        Game.points = 0;

        var pointsLength = 8;

        this.draw = function(ctx) {
            ctx.save();
            ctx.font = "bold 18px arial";
            ctx.fillStyle= "#FFFFFF";

            var txt = "" + Game.points;
            var i = pointsLength - txt.length, zeros = "";
            while(i-- > 0) { zeros += "0"; }

            ctx.fillText(zeros + txt,10,20);
            ctx.restore();

        };

        this.step = function(dt) { };
    };

    // game.js

//    var pictures_data = {
//        'bug': { cls: Bug, w: 110, h: 110}
//        , 'player': { cls: Player, w: 110, h: 110}
//        , 'missile': { cls: Missile, w: 50, h: 50}
//    }

    var sprites = {
        player: { w: 110, h: 110, frames: 1 },
        missile: { w: 50, h: 50, frames: 1 },
        enemy: { w: 110, h: 110, frames: 1 },
        enemy_missile: { w: 50, h: 50, frame: 1 },
        explosion: { w: 50, h: 50, frames: 1 }
    };

    var enemies = {
//        straight: { x: 0,   y: -50, sprite: 'enemy_ship', health: 10,
//            E: 100, missiles: 2 },
        ltr:      { x: 0,   y: -100, sprite: 'enemy', health: 10,
            B: 75, C: 1, E: 100, missiles: 2  }
//        circle:   { x: 250,   y: -50, sprite: 'enemy_circle', health: 10,
//            A: 0,  B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 },
//        wiggle:   { x: 100, y: -50, sprite: 'enemy_bee', health: 20,
//            B: 50, C: 4, E: 100, firePercentage: 0.001, missiles: 2 },
//        step:     { x: 0,   y: -50, sprite: 'enemy_circle', health: 10,
//            B: 150, C: 1.2, E: 75 }
    };

    var OBJECT_PLAYER = 1,
        OBJECT_PLAYER_PROJECTILE = 2,
        OBJECT_ENEMY = 4,
        OBJECT_ENEMY_PROJECTILE = 8,
        OBJECT_POWERUP = 16;

    function start_game() {
        coonsole.log('start game');
        Game.setBoard(0,new Starfield(20,0.4,100,true));
        Game.setBoard(1,new Starfield(50,0.6,100));
        Game.setBoard(2,new Starfield(100,1.0,50));
        Game.setBoard(3,new TitleScreen("Sfeir Invasion",
            'press "k" to start',
            playGame));
    }

    // TODO keep only 1 level
    var level1 = [
        // Start,   End, Gap,  Type,   Override
        [ 0,      4000,  500, 'ltr' ]
        // [ 6000,   13000, 800, 'ltr' ],
        // [ 10000,  16000, 400, 'circle' ],
        // [ 17800,  20000, 500, 'straight', { x: 50 } ],
        // [ 18200,  20000, 500, 'straight', { x: 90 } ],
        // [ 18200,  20000, 500, 'straight', { x: 10 } ],
        // [ 22000,  25000, 400, 'wiggle', { x: 150 }],
        // [ 22000,  25000, 400, 'wiggle', { x: 100 }]
    ];

    var playGame = function() {
        var board = new GameBoard();
        board.add(new PlayerShip());
        board.add(new Level(level1,winGame));
        Game.setBoard(3,board);
        Game.setBoard(5,new GamePoints(0));
    };

    var winGame = function() {
        Game.setBoard(3,new TitleScreen("You win!",
            "Press fire to play again",
            playGame));
    };

    var loseGame = function() {
        Game.setBoard(3,new TitleScreen("You lose!",
            "Press fire to play again",
            playGame));
    };

    var Starfield = function(speed,opacity,numStars,clear) {

        // Set up the offscreen canvas
        var stars = document.createElement("canvas");
        stars.width = Game.width;
        stars.height = Game.height;
        var starCtx = stars.getContext("2d");

        var offset = 0;

        // If the clear option is set,
        // make the background black instead of transparent
        if(clear) {
            starCtx.fillStyle = "#000";
            starCtx.fillRect(0,0,stars.width,stars.height);
        }

        // Now draw a bunch of random 2 pixel
        // rectangles onto the offscreen canvas
        starCtx.fillStyle = "#FFF";
        starCtx.globalAlpha = opacity;
        for(var i=0;i<numStars;i++) {
            starCtx.fillRect(Math.floor(Math.random()*stars.width),
                Math.floor(Math.random()*stars.height),
                2,
                2);
        }

        // This method is called every frame
        // to draw the starfield onto the canvas
        this.draw = function(ctx) {
            var intOffset = Math.floor(offset);
            var remaining = stars.height - intOffset;

            // Draw the top half of the starfield
            if(intOffset > 0) {
                ctx.drawImage(stars,
                    0, remaining,
                    stars.width, intOffset,
                    0, 0,
                    stars.width, intOffset);
            }

            // Draw the bottom half of the starfield
            if(remaining > 0) {
                ctx.drawImage(stars,
                    0, 0,
                    stars.width, remaining,
                    0, intOffset,
                    stars.width, remaining);
            }
        };

        // This method is called to update
        // the starfield
        this.step = function(dt) {
            offset += dt * speed;
            offset = offset % stars.height;
        };
    };

    var PlayerShip = function() {
        this.setup('player', { vx: 0, reloadTime: 0.25, maxVel: 200 });

        this.reload = this.reloadTime;
        this.x = Game.width/2 - this.w / 2;
        this.y = Game.height - Game.playerOffset - this.h;

        this.step = function(dt) {
            if(Game.keys['left']) { this.vx = -this.maxVel; }
            else if(Game.keys['right']) { this.vx = this.maxVel; }
            else { this.vx = 0; }

            this.x += this.vx * dt;

            if(this.x < 0) { this.x = 0; }
            else if(this.x > Game.width - this.w) {
                this.x = Game.width - this.w;
            }

            this.reload-=dt;
            if(Game.keys['fire'] && this.reload < 0) {
                Game.keys['fire'] = false;
                this.reload = this.reloadTime;

                this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
                this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
            }
        };
    };

    PlayerShip.prototype = new Sprite();
    PlayerShip.prototype.type = OBJECT_PLAYER;

    PlayerShip.prototype.hit = function(damage) {
        if(this.board.remove(this)) {
            loseGame();
        }
    };


    var PlayerMissile = function(x,y) {
        this.setup('missile',{ vy: -700, damage: 10 });
        this.x = x - this.w/2;
        this.y = y - this.h;
    };

    PlayerMissile.prototype = new Sprite();
    PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

    PlayerMissile.prototype.step = function(dt)  {
        this.y += this.vy * dt;
        var collision = this.board.collide(this,OBJECT_ENEMY);
        if(collision) {
            collision.hit(this.damage);
            this.board.remove(this);
        } else if(this.y < -this.h) {
            this.board.remove(this);
        }
    };


    var Enemy = function(blueprint,override) {
        this.merge(this.baseParameters);
        this.setup(blueprint.sprite,blueprint);
        this.merge(override);
    };

    Enemy.prototype = new Sprite();
    Enemy.prototype.type = OBJECT_ENEMY;

    Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0,
        E: 0, F: 0, G: 0, H: 0,
        t: 0, reloadTime: 0.75,
        reload: 0 };

    Enemy.prototype.step = function(dt) {
        this.t += dt;

        this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
        this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        var collision = this.board.collide(this,OBJECT_PLAYER);
        if(collision) {
            collision.hit(this.damage);
            this.board.remove(this);
        }

        if(Math.random() < 0.01 && this.reload <= 0) {
            this.reload = this.reloadTime;
            if(this.missiles == 2) {
                this.board.add(new EnemyMissile(this.x+this.w-2,this.y+this.h));
                this.board.add(new EnemyMissile(this.x+2,this.y+this.h));
            } else {
                this.board.add(new EnemyMissile(this.x+this.w/2,this.y+this.h));
            }

        }
        this.reload-=dt;

        if(this.y > Game.height ||
            this.x < -this.w ||
            this.x > Game.width) {
            this.board.remove(this);
        }
    };

    Enemy.prototype.hit = function(damage) {
        this.health -= damage;
        if(this.health <=0) {
            if(this.board.remove(this)) {
                Game.points += this.points || 100;
                this.board.add(new Explosion(this.x + this.w/2,
                    this.y + this.h/2));
            }
        }
    };

    var EnemyMissile = function(x,y) {
        this.setup('enemy_missile',{ vy: 200, damage: 10 });
        this.x = x - this.w/2;
        this.y = y;
    };

    EnemyMissile.prototype = new Sprite();
    EnemyMissile.prototype.type = OBJECT_ENEMY_PROJECTILE;

    EnemyMissile.prototype.step = function(dt)  {
        this.y += this.vy * dt;
        var collision = this.board.collide(this,OBJECT_PLAYER)
        if(collision) {
            collision.hit(this.damage);
            this.board.remove(this);
        } else if(this.y > Game.height) {
            this.board.remove(this);
        }
    };



    var Explosion = function(centerX,centerY) {
        this.setup('explosion', { frame: 0 });
        this.x = centerX - this.w/2;
        this.y = centerY - this.h/2;
    };

    Explosion.prototype = new Sprite();

    Explosion.prototype.step = function(dt) {
        this.frame++;
        if(this.frame >= 2) {
        // if(this.frame >= 12) {
            this.board.remove(this);
        }
    };

            //TODO
//    var game_level = [
//        [1, 1, 1, 1, 1, 1, 1]
//      , [1, 1, 1, 1, 1, 1, 1]
//      , [1, 1, 1, 1, 1, 1, 1]
//      , [1, 1, 1, 1, 1, 1, 1]
//      , [1, 1, 1, 1, 1, 1, 1]
//      , [1, 1, 1, 1, 1, 1, 1]
//    ]
//
//    this.loadLevel = function(level) {
//
//        this.objects = [];
//        this.player = Game.board.addPicture('player'
//            , Game.width / 2 // x
//            , Game.height - SpriteSheet.map['player'].h - 10 // y
//        );
//
//        var flock = this.add(new BugFlock());
//        for (var y = 0, rows = level.length; y < rows; y++) {
//            for (var x = 0, cols = level[y].length; x < cols; x++) {
//                var bug = SpriteSheet.map['bug'];
//                if(bug) {
//                    Game.board.addPicture('bug',
//                        (bug.w + 10) * x,
//                        bug.h * y,
//                        {flock : flock} // options
//                    );
//                }
//            }
//        }
//
//    }
//
//    this.loadLevel(game_level);
//
//    var Missile = function() {
//    }
//
//    Missile.prototype.draw = function(canvas) {
//        SpriteSheet.draw(canvas, 'missile', this.x, this.y);
//    }
//
//    Missile.prototype.step = function(dt) {
//        this.y += this.dy *dt;
//
//        var enemy = this.board.collide(this);
//        if (enemy) {
//            enemy.die();
//            return false;
//        }
//
//        return !(this.y < 0 || this.y > Game.height);
//    }
//
//    Missile.prototype.die = function() {
//        if(this.player) {
//            this.board.missiles--;
//        }
//
//        if (this.board.missiles < 0) {
//            this.board.missiles = 0;
//        }
//
//        this.board.remove(this);
//    }
//
//    var Player = function Player(opts) {
//        this.reloading = 0;
//    }
//
//    Player.prototype.draw = function(canvas) {
//        SpriteSheet.draw(canvas, 'player', this.x, this.y);
//    }
//
//    Player.prototype.die = function() {
//        Game.callbacks['die']();
//    }
//
//    Player.prototype.step = function(dt) {
//        if (Game.keys['left']) { this.x -= 100 *dt; }
//        if (Game.keys['right']) { this.x += 100 *dt; }
//
//        if (this.x < 0) this.x = 0;
//        if (this.x > Game.width - this.w) this.x = Game.width = this.w;
//
//        this.reloading--;
//
//        if (Game.keys['fire'] && this.reloading <= 0 && this.board.missiles < 3) {
//            this.board.addPicture('missile',
//                this.x + this.w / 2 - SpriteSheet.map.missile.w / 2,
//                this.y - this.h,
//                { dy: -100, player: true}
//            );
//            this.board.missiles++;
//            this.reloading = 10;
//        }
//        return true;
//    }
//
//    var BugFlock = function() {
//        this.dx = 10; this.dy = 10;
//        this.hit = 1; this.lastHit = 0;
//        this.speed = 10;
//
//        this.draw = function() {};
//
//        this.die = function() {
//            Game.callbacks['win']();
//        }
//    }
//
//    this.step = function(dt) {
//        if (this.hit && this.hit != this.lastHit) {
//            this.lastHit = this.hit;
//            this.dy = this.speed;
//        } else {
//            this.dy = 0;
//        }
//        this.dx = this.speed * this.hit;
//
//        var max = {}, cnt = 0;
//
//        this.board.iterate(function() {
//            if (this instanceof Bug) {
//                if (!max[this.x] || this.y > max[this.x]) {
//                    max[this.x] = this.y;
//                }
//                cnt++;
//            }
//        });
//
//        if(cnt ==0) {this.die();}
//
//        this.max_y = max;
//        return true;
//    }
//
//    var Bug = function (opts) {
//        this.flock = opts['flock'];
//        this.frame = 0;
//        this.mx = 0;
//    }
//
//    Bug.prototype.draw = function(canvas) {
//        SpriteSheet.draw(canvas, this.name, this.x, this.y);
////        pictures.draw(canvas, this.name, this.x, this.y, this.frame);
//    }
//
//    Bug.prototype.die = function() {
//        this.flock.speed +=1;
//        this.board.remove(this);
//    }
//
//    Bug.prototype.step = function(dt) {
//        this.mx += dt * this.flock.dx;
//        this.y += this.flock.dy;
//
//        if(Math.abs(this.mx) > 10) {
//            if (this.y == this.flock.max_y[this.x]) {
//                this.fireSometimes();
//            }
//            this.x += this.mx;
//            this.mx = 0;
//            this.frame = (this.frame+1) % 2;
//            if (this.x > Game.width - SpriteSheet.map.bug.w *2) this.flock.hit = -1;
//            if (this.x < SpriteSheet.map.bug.w) this.flock.hit = 1;
//        }
//        return true;
//    }
//
//    Bug.prototype.fireSometimes = function() {
//        if (Math.random() * 100 < 10) {
//            this.board.addPicture('missile', this.x + this.w/2 - SpriteSheet.map.missile.w / 2,
//                this.y + this.h,
//                {dy: 100});
//        }
//    }


})();
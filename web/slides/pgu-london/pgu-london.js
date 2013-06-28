//
// The original code is from https://github.com/cykod/AlienInvasion
// A big thank to their team, they've made a wonderful work.
//
// Also, you can see their presentation at http://www.slideshare.net/cykod/html5-space-invaders
// "Presentation at the Boston HTML5 Game Development Meetup: Building a Space Invaders clone from Scratch with HTML5"
//

// https://github.com/cykod/AlienInvasion/blob/master/engine.js
// https://github.com/cykod/AlienInvasion/blob/master/game.js

(function() {

    var article = $('#pgu-london');
    article.html('<div id="container_invaders"><canvas id="sfeir-invaders" class="sfeir-invaders-container"></canvas></div>');
    article.addClass('pgu-article pgu-article-black');

    window.SLIDES['pgu-london'] = {
        id: 'pgu-london'
        , reset: function() {

            if (request_id) {
                window.cancelAnimationFrame(request_id);
            }
            var canvas = document.getElementById('sfeir-invaders');
            canvas.animation = -1;

            window.setTimeout(function()
            {
                // signal death of this animation
                delete canvas.animation;
                Game.clearCtx();
                if (canvas.firstChild !== null) {
                    canvas.innerHTML = "";
                }

            }, 300);

        }
        , execute: function() {
            SpriteSheet.loadAllPictures();
            Game.initialize("sfeir-invaders",sprites,startGame);
        }
    }

    var request_id = null;

    // engine.js
    var Game = new function() {
        var boards = [];

        // Game Initialization
        this.initialize = function(canvasElementId,sprite_data,callback) {
            this.canvas = document.getElementById(canvasElementId);

            this.playerOffset = 10;
            this.canvasMultiplier= 1;
            this.setupMobile();

            this.width = this.canvas.width;
            this.height= this.canvas.height;

            this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
            if(!this.ctx) { return alert("Please upgrade your browser to play"); }

            this.setupInput();

            this.loop();

            if(this.mobile) {
                this.setBoard(4,new TouchControls());
            }

            SpriteSheet.load(sprite_data,callback);
        };

        this.clearCtx = function() {
            if (this.ctx) {this.ctx.clearRect(0,0,this.width,this.height);}
            boards = [];
        }

        // Handle Input
//        var KEY_CODES = { 37:'left', 39:'right', 32 :'fire' };
        var KEY_CODES = { 74:'left', 76:'right', 75 :'fire' };
        this.keys = {};

        this.setupInput = function() {
            window.addEventListener('keydown',function(e) {
                if(KEY_CODES[e.keyCode]) {
                    Game.keys[KEY_CODES[e.keyCode]] = true;
                    e.preventDefault();
                }
            },false);

            window.addEventListener('keyup',function(e) {
                if(KEY_CODES[e.keyCode]) {
                    Game.keys[KEY_CODES[e.keyCode]] = false;
                    e.preventDefault();
                }
            },false);
        };

        var lastTime = new Date().getTime();
        var maxTime = 1/30;
        // Game Loop
        this.loop = function() {
            var curTime = new Date().getTime();
            request_id = requestAnimationFrame(Game.loop);

            // slow the game
            var dt = (curTime - lastTime)/3000;
//            var dt = (curTime - lastTime)/1000;

            if(dt > maxTime) { dt = maxTime; }

            for(var i=0,len = boards.length;i<len;i++) {
                if(boards[i]) {
                    boards[i].step(dt);
                    boards[i].draw(Game.ctx);
                }
            }
            lastTime = curTime;
        };

        // Change an active game board
        this.setBoard = function(num,board) { boards[num] = board; };


        this.setupMobile = function() {
            var container = document.getElementById("container_invaders"),
                hasTouch =  !!('ontouchstart' in window),
                w = window.innerWidth, h = window.innerHeight;

            if(hasTouch) { this.mobile = true; }

            if(screen.width >= 1280 || !hasTouch) { return false; }

            if(w > h) {
                alert("Please rotate the device and then click OK");
                w = window.innerWidth; h = window.innerHeight;
            }

            container.style.height = h*2 + "px";
            window.scrollTo(0,1);

            h = window.innerHeight + 2;
            container.style.height = h + "px";
            container.style.width = w + "px";
            container.style.padding = 0;

            if(h >= this.canvas.height * 1.75 || w >= this.canvas.height * 1.75) {
                this.canvasMultiplier = 2;
                this.canvas.width = w / 2;
                this.canvas.height = h / 2;
                this.canvas.style.width = w + "px";
                this.canvas.style.height = h + "px";
            } else {
                this.canvas.width = w;
                this.canvas.height = h;
            }

            this.canvas.style.position='absolute';
            this.canvas.style.left="0px";
            this.canvas.style.top="0px";

        };

    };

    var SpriteSheet = new function() {
        this.map = { };

        this.pictures = {};

        var pictures_enemies = ['bug_big', 'bug_small', 'bug_large', 'bug_thin'];
        var pictures_enemies2 = ['bug_big2', 'bug_small2', 'bug_large2', 'bug_thin2'];
        var pictures_enemies_missiles = ['missile_big', 'missile_small', 'missile_large', 'missile_thin'];

        var pictures_missiles = ['android', 'angularjs', 'appengine', 'compute', 'dart'];

        var picture_names = ['sfeir', 'cloud']
            .concat(pictures_missiles)
            .concat(pictures_enemies)
            .concat(pictures_enemies2)
            .concat(pictures_enemies_missiles)
            ;

        this.loadAllPictures = function() {
            if ($.isEmptyObject(this.pictures)) {
                for (var i = 0; i < picture_names.length; i++) {

                    var pic_name = picture_names[i];

                    var img = new Image();
                    img.src = '/slides/pgu-london/img/' + pic_name + '.png';

                    this.pictures[pic_name] = img;
                }
            }
        }

        this.load = function(spriteData,callback) {
            this.map = spriteData;

            callback();
//            this.image = new Image();
//            this.image.onload = callback;
//            this.image.src = '/slides/pgu-london/img/sprites.png';
        };

        this.draw = function(ctx,sprite,x,y,frame) {
            if(!frame) frame = 0;

            var s = this.map[sprite];
            var the_image = null;

            if ('ship' === sprite) {
                the_image = this.pictures['sfeir'];


            } else if ('missile_and' === sprite) {
                the_image = this.pictures['android'];

            } else if ('missile_ang' === sprite) {
                the_image = this.pictures['angularjs'];

            } else if ('missile_app' === sprite) {
                the_image = this.pictures['appengine'];

            } else if ('missile_com' === sprite) {
                the_image = this.pictures['compute'];

            } else if ('missile_dar' === sprite) {
                the_image = this.pictures['dart'];


            } else if ('enemy_big' === sprite) {
                the_image = (frame & 1) ? this.pictures['bug_big'] : this.pictures['bug_big2'] ;

            } else if ('enemy_small' === sprite) {
                the_image = (frame & 1) ? this.pictures['bug_small'] : this.pictures['bug_small2'] ;

            } else if ('enemy_large' === sprite) {
                the_image = (frame & 1) ? this.pictures['bug_large'] : this.pictures['bug_large2'] ;

            } else if ('enemy_thin' === sprite) {
                the_image = (frame & 1) ? this.pictures['bug_thin'] : this.pictures['bug_thin2'] ;


            } else if ('explosion' === sprite) {
                the_image = this.pictures['cloud'];


            } else if ('enemy_missile_big' === sprite) {
                the_image = this.pictures['missile_big'];

            } else if ('enemy_missile_small' === sprite) {
                the_image = this.pictures['missile_small'];

            } else if ('enemy_missile_large' === sprite) {
                the_image = this.pictures['missile_large'];

            } else if ('enemy_missile_thin' === sprite) {
                the_image = this.pictures['missile_thin'];

            } else {
                throw 'Unknown sprite ' + sprite;
            }

            ctx.drawImage(the_image,
                Math.floor(x), Math.floor(y),
                s.w, s.h);
        };

        return this;
    };

    var TitleScreen = function TitleScreen(title,subtitle,callback) {
        var up = false;
        this.step = function(dt) {
            if(!Game.keys['fire']) up = true;
            if(up && Game.keys['fire'] && callback) callback();
        };

        this.draw = function(ctx) {
            ctx.fillStyle = "#FFFFFF";

            ctx.font = "bold 40px bangers";
            var measure = ctx.measureText(title);
            ctx.fillText(title,Game.width/2 - measure.width/2,Game.height/2);

            ctx.font = "bold 20px bangers";
            var measure2 = ctx.measureText(subtitle);
            ctx.fillText(subtitle,Game.width/2 - measure2.width/2,Game.height/2 + 40);
        };
    };


    var GameBoard = function() {
        var board = this;

        // The current list of objects
        this.objects = [];
        this.cnt = {};

        // Add a new object to the object list
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

        // Draw all the objects
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


    var TouchControls = function() {

        var gutterWidth = 10;
        var unitWidth = Game.width/5;
        var blockWidth = unitWidth-gutterWidth;

        this.drawSquare = function(ctx,x,y,txt,on) {
            ctx.globalAlpha = on ? 0.9 : 0.6;
            ctx.fillStyle =  "#CCC";
            ctx.fillRect(x,y,blockWidth,blockWidth);

            ctx.fillStyle = "#FFF";
            ctx.globalAlpha = 1.0;
            ctx.font = "bold " + (3*unitWidth/4) + "px arial";

            var txtSize = ctx.measureText(txt);

            ctx.fillText(txt,
                x+blockWidth/2-txtSize.width/2,
                y+3*blockWidth/4+5);
        };

        this.draw = function(ctx) {
            ctx.save();

            var yLoc = Game.height - unitWidth;
            this.drawSquare(ctx,gutterWidth,yLoc,"\u25C0", Game.keys['left']);
            this.drawSquare(ctx,unitWidth + gutterWidth,yLoc,"\u25B6", Game.keys['right']);
            this.drawSquare(ctx,4*unitWidth,yLoc,"A",Game.keys['fire']);

            ctx.restore();
        };

        this.step = function(dt) { };

        this.trackTouch = function(e) {
            var touch, x;

            e.preventDefault();
            Game.keys['left'] = false;
            Game.keys['right'] = false;
            for(var i=0;i<e.targetTouches.length;i++) {
                touch = e.targetTouches[i];
                x = touch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft;
                if(x < unitWidth) {
                    Game.keys['left'] = true;
                }
                if(x > unitWidth && x < 2*unitWidth) {
                    Game.keys['right'] = true;
                }
            }

            if(e.type == 'touchstart' || e.type == 'touchend') {
                for(i=0;i<e.changedTouches.length;i++) {
                    touch = e.changedTouches[i];
                    x = touch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft;
                    if(x > 4 * unitWidth) {
                        Game.keys['fire'] = (e.type == 'touchstart');
                    }
                }
            }
        };

        Game.canvas.addEventListener('touchstart',this.trackTouch,true);
        Game.canvas.addEventListener('touchmove',this.trackTouch,true);
        Game.canvas.addEventListener('touchend',this.trackTouch,true);

        // For Android
        Game.canvas.addEventListener('dblclick',function(e) { e.preventDefault(); },true);
        Game.canvas.addEventListener('click',function(e) { e.preventDefault(); },true);

        Game.playerOffset = unitWidth + 20;
    };


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
    var sprites = {
//        ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
//        missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
//        enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
//        enemy_bee: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
//        enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
//        enemy_circle: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
//        explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
//        enemy_missile: { sx: 9, sy: 42, w: 3, h: 20, frame: 1}
//
        ship: { w: 25, h: 14, frame: 1 },
        missile_and: { w: 20, h: 15, frame: 1 },
        missile_ang: { w: 20, h: 15, frame: 1 },
        missile_app: { w: 20, h: 15, frame: 1 },
        missile_com: { w: 20, h: 15, frame: 1 },
        missile_dar: { w: 20, h: 15, frame: 1 },

        enemy_big: { w: 30, h: 20, frame: 1 },
        enemy_small: { w: 20, h: 10, frame: 1 },
        enemy_large: { w: 30, h: 10, frame: 1 },
        enemy_thin: { w: 20, h: 20, frame: 1 },

        explosion: { w: 20, h: 15, frame: 12 },

        enemy_missile_big: { w: 10, h: 8, frame: 1},
        enemy_missile_small: { w: 3, h: 6, frame: 1},
        enemy_missile_large: { w: 10, h: 8, frame: 1},
        enemy_missile_thin: { w: 3, h: 10, frame: 1}
    };

    var player_missiles_sprite = ['missile_and', 'missile_ang', 'missile_app', 'missile_com', 'missile_dar'];

    var enemies = {
        straight: { x: 0,   y: -50, sprite: 'enemy_large', health: 10,
            E: 100 },
        ltr:      { x: 0,   y: -100, sprite: 'enemy_big', health: 10,
            B: 75, C: 1, E: 100, missiles: 2  },
        circle:   { x: 250,   y: -50, sprite: 'enemy_thin', health: 10,
            A: 0,  B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 },
        wiggle:   { x: 100, y: -50, sprite: 'enemy_small', health: 10,
            B: 50, C: 4, E: 100, firePercentage: 0.001, missiles: 2 },
        step:     { x: 0,   y: -50, sprite: 'enemy_large', health: 10,
            B: 150, C: 1.2, E: 75 }
    };

    var OBJECT_PLAYER = 1,
        OBJECT_PLAYER_PROJECTILE = 2,
        OBJECT_ENEMY = 4,
        OBJECT_ENEMY_PROJECTILE = 8,
        OBJECT_POWERUP = 16;

    var startGame = function() {
        var ua = navigator.userAgent.toLowerCase();

        // Only 1 row of stars
        if(ua.match(/android/)) {
            Game.setBoard(0,new Starfield(50,0.6,100,true));
        } else {
            // slow the stars
            Game.setBoard(0,new Starfield(15,0.4,10,true));
            Game.setBoard(1,new Starfield(37,0.6,10));
            Game.setBoard(2,new Starfield(75,1.0,5));
//            Game.setBoard(0,new Starfield(20,0.4,100,true));
//            Game.setBoard(1,new Starfield(50,0.6,100));
//            Game.setBoard(2,new Starfield(100,1.0,50));
        }
        Game.setBoard(3,new TitleScreen("Bugs Attack !",
            "left ' j ', fire ' k ', right ' l '...  Fire!",
            playGame));
    };

    var levels = [
        [
            [ 0,       4000, 250, 'step' ],
            [ 6000,   13000, 800, 'circle' ],
            [ 10000,  16000, 400, 'ltr' ],
            [ 17800,  20000, 500, 'wiggle', { x: 150, B: 160 } ]
        ]
      , [
            [ 0,       4000, 500, 'circle' ],
            [ 6000,   13000, 500, 'step' ],
            [ 10000,  16000, 500, 'wiggle', { x: 120, B: 160 } ],
            [ 17800,  20000, 400, 'ltr']
        ]
      , [
            [ 0,       4000, 400, 'step' ],
            [ 6000,   13000, 800, 'ltr' ],
            [ 10000,  16000, 400, 'circle' ],
            [ 17800,  20000, 500, 'wiggle', { x: 50 , B: 150} ]
        ]
      , [
            [ 0,       4000, 500, 'wiggle', { x: 100 , B: 180} ],
            [ 6000,   13000, 800, 'circle'],
            [ 10000,  16000, 400, 'ltr' ],
            [ 17800,  20000, 500, 'wiggle', { x: 100 , B: 200} ]
        ]
    ];

//    var level1 = [
        // Start,   End, Gap,  Type,   Override
//        [ 0,       4000, 500, 'step' ],
//        [ 6000,   13000, 800, 'ltr' ],
//        [ 10000,  16000, 400, 'circle' ],
//        [ 17800,  20000, 500, 'straight', { x: 50 } ],
//        [ 18200,  20000, 500, 'straight', { x: 90 } ],
//        [ 18200,  20000, 500, 'straight', { x: 10 } ],
//        [ 22000,  25000, 400, 'wiggle', { x: 150 }],
//        [ 22000,  25000, 400, 'wiggle', { x: 100 }]
//    ];



    var playGame = function() {
        hide_social_bar();

        var board = new GameBoard();
        board.add(new PlayerShip());

        var min = 0;
        var max = levels.length - 1;
        var idx = getRandomInt(min, max);

        var levelX = levels[idx];

        board.add(new Level(levelX,winGame));
        Game.setBoard(3,board);
        Game.setBoard(5,new GamePoints(0));
    };

    var winGame = function() {
        show_social_bar_when_animation_is_over('pgu-london');
        Game.setBoard(3,new TitleScreen("You win!",
            "Press fire to play again",
            playGame));
    };

    var loseGame = function() {
        show_social_bar_when_animation_is_over('pgu-london');
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
        // increase player's speed
        this.setup('ship', { vx: 0, reloadTime: 0.15, maxVel: 800 });
//        this.setup('ship', { vx: 0, reloadTime: 0.25, maxVel: 200 });

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

                var min = 0;
                var max = player_missiles_sprite.length - 1;
                var idx = getRandomInt(min, max);

                var missile_sprite = player_missiles_sprite[idx];

                this.board.add(new PlayerMissile(missile_sprite, this.x,this.y+this.h/2));
                this.board.add(new PlayerMissile(missile_sprite, this.x+this.w,this.y+this.h/2));
            }
        };
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    PlayerShip.prototype = new Sprite();
    PlayerShip.prototype.type = OBJECT_PLAYER;

    PlayerShip.prototype.hit = function(damage) {
        if(this.board.remove(this)) {
            loseGame();
        }
    };


    var PlayerMissile = function(sprite,x,y) {
        this.setup(sprite,{ vy: -100, damage: 10 });
//        this.setup('missile',{ vy: -700, damage: 10 });
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
        this.frame_delay = 20;
    };

    Enemy.prototype = new Sprite();
    Enemy.prototype.type = OBJECT_ENEMY;

    Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0,
        E: 0, F: 0, G: 0, H: 0,
        t: 0, reloadTime: 0.75,
        reload: 0 };

    Enemy.prototype.step = function(dt) {
        if (this.frame_delay === 0) {
            this.frame++;
            this.frame_delay = 20;
        } else {
            this.frame_delay--;
        }

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

            var missile_sprite = null;
            if (this.sprite === 'enemy_big') {
                missile_sprite = 'enemy_missile_big';

            } else if (this.sprite === 'enemy_small') {
                missile_sprite = 'enemy_missile_small';

            } else if (this.sprite === 'enemy_large') {
                missile_sprite = 'enemy_missile_thin';

            } else if (this.sprite === 'enemy_thin') {
                missile_sprite = 'enemy_missile_large';

            } else {
                throw 'Unknown sprite ' + this.sprite;
            }

            if(this.missiles == 2) {
                this.board.add(new EnemyMissile(missile_sprite, this.x+this.w-2,this.y+this.h));
                this.board.add(new EnemyMissile(missile_sprite, this.x+2,this.y+this.h));
            } else {
                this.board.add(new EnemyMissile(missile_sprite, this.x+this.w/2,this.y+this.h));
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

    var EnemyMissile = function(sprite, x,y) {
        this.setup(sprite,{ vy: 120, damage: 10 });
//        this.setup('enemy_missile',{ vy: 200, damage: 10 });
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
        if(this.frame >= 12) {
            this.board.remove(this);
        }
    };

})();
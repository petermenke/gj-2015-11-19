var stage;
var queue;
var grid;

var tanks;

var mousex = 0;
var mousey = 0;

var list = ['bluebot', 'greenbot', 'redbot', 'yellowbot'];

var coin;
var score = 1;

var scoreimg;

var modi = [];
modi['bluebot'] = 1;
modi['greenbot'] = 1.3;
modi['yellowbot'] = 1.5;
modi['redbot'] = 1.7;

function init() {
	//var $j = jQuery.noConflict();
	$(window).resize(function(e) {
		// Make canvas full screen
		var canvas = document.getElementById('canvas');
		canvas.height = window.innerHeight - 5;
		canvas.width = window.innerWidth;

	    // Make canvas not blurry
		var context = canvas.getContext('2d');
		context.webkitImageSmoothingEnabled = false;
		context.mozImageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;
	});
	$(window).resize();

    /** Stage Setup **/
    stage = new createjs.Stage('canvas');
	 stage.enableMouseOver(10);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);

	/** Image Progress Bar **/
	var loading = new Loading();
	loading.name = "loading";
	stage.addChild(loading);

	/** Load assets into queue **/
    queue = new createjs.LoadQueue();
    queue.on("fileload", handleFileLoad, this);
    queue.on("complete", handleComplete, this);
	queue.on("progress", handleFileProgress, this);

	$.get('manifest.json?' + Math.random(), function(data) {
        if (typeof data == 'string')
            queue.loadManifest(JSON.parse(data));
	        else
            queue.loadManifest(data);
    });

	$(document).mousemove(function(event){
    	mousex = event.pageX;
		mousey = event.pageY;
	});
}

function tick() {
    stage.update();
	if (tanks) {
		for (var i = 0; i < list.length; i++) {
			var tank = tanks[list[i]];
			var xdist = mousex - tank.x;
			var ydist = mousey - tank.y;
			var angle = toDegrees(Math.atan2(ydist, xdist));
			tank.rotation = angle;

			tank.x = Math.floor(tank.x + (sign(xdist) * (score / 3) * modi[list[i]]));
			tank.y = Math.floor(tank.y + (sign(ydist) * (score / 3) * modi[list[i]]));
		}
	}
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function sign(number) {
	return number && number / Math.abs(number);
}

function handleFileLoad(q) {

}

function handleFileProgress(e) {
    var p = e.progress;
    var loading = stage.getChildByName('loading');
	loading.progress(p);
}

function handleComplete(e) {

	stage.removeChild(stage.getChildByName('loading'));

    // keybindings
    Mousetrap.bind('d', function() {

    });

	var img = queue.getItem('rpgTile040');
	queue.remove('rpgTile040');
	var bitmap = new createjs.Bitmap(img.src);

	grid = new Grid(parseInt(screen.width / 64), parseInt(screen.height / 64), 64, 64);
	grid.fill(bitmap.clone());

	stage.addChild(grid);

	// init entities

		coin = new createjs.Bitmap(queue.getItem('chip').src)
		coin.x = Math.floor((Math.random() * (screen.width - 200)));
		coin.y = Math.floor((Math.random() * (screen.height - 200)));
		coin.addEventListener('click', function(event) {
			coin.x = Math.floor((Math.random() * (screen.width - 200)));
			coin.y = Math.floor((Math.random() * (screen.height - 200)));
			score = score + 1;
			scoreimg.text = score + " points";
		});
		stage.addChild(coin);


	tanks = [];
	var scale = .5;
	for (var i = 0; i < list.length; i++) {
		var bmp = new createjs.Bitmap(queue.getItem(list[i]).src);
		bmp.scaleX = scale;
		bmp.scaleY = scale;
		bmp.name = list[i];

		bmp.x = Math.floor((Math.random() * (screen.width - 64)));
		bmp.y = Math.floor((Math.random() * (screen.height - 64)));

		bmp.addEventListener('rollover', function(e) {
			score = 0;
			console.log('ping');
		});

		tanks[list[i]] = bmp;
		stage.addChild(bmp);
	}

	var scoreimg = new createjs.Text("0 points", "20px Arial", "black");
	scoreimg.x = 20;
	scoreimg.y = 20;
	scoreimg.name = "score";
	stage.addChild(scoreimg);
}

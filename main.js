const app = new PIXI.Application({
  backgroundColor: 0x1099bb,
  antialias: true
});

var graphics = new PIXI.Graphics();

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);

// create a texture from an image path
const texture = PIXI.Texture.from('./images/cat.jpg');

// Scale mode for pixelation
texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

let points=[];
for (let i = 0; i < 4; i++) {
  createBunny(
    Math.floor(Math.random() * app.screen.width),
    Math.floor(Math.random() * app.screen.height),
  );
}

function createGraphic(){
  graphics.clear()
  graphics.lineStyle(2, 0xffd900, 1);
  // graphics.beginFill(0x1099bb);
  graphics.moveTo(points[0].x, points[0].y);
  points.forEach(function (i) {
      graphics.lineTo(i.x, i.y);
  });
  graphics.closePath();
  graphics.endFill();
  app.stage.addChild(graphics);
}

function createBunny(x, y) {
  points.push({x,y})
  console.log(points)
  // create our little bunny friend..
  const bunny = new PIXI.Sprite(texture);
  bunny.index=points.length - 1;
  // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
  bunny.interactive = true;

  // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
  bunny.buttonMode = true;

  // center the bunny's anchor point
  bunny.anchor.set(0.5);

  // make it a bit bigger, so it's easier to grab
  bunny.scale.set(0.1);

  // setup events for mouse + touch using
  // the pointer events
  bunny
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);

  // For mouse-only events
  // .on('mousedown', onDragStart)
  // .on('mouseup', onDragEnd)
  // .on('mouseupoutside', onDragEnd)
  // .on('mousemove', onDragMove);

  // For touch-only events
  // .on('touchstart', onDragStart)
  // .on('touchend', onDragEnd)
  // .on('touchendoutside', onDragEnd)
  // .on('touchmove', onDragMove);

  // move the sprite to its designated position
  bunny.x = x;
  bunny.y = y;

  // add it to the stage
  app.stage.addChild(bunny);
  createGraphic()
}

function onDragStart(event) {
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
}

function onDragEnd() {
  this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.data = null;
  
}

function onDragMove() {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
    points[this.index].x=newPosition.x;
    points[this.index].y=newPosition.y;
  }
  createGraphic()
}

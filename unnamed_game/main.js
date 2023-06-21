import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";
import loader from "./loader.js";

kaboom({
  width: 1024,
  height: 512,
  crisp: true,
  // canvas: document.getElementById('kaboom'),
  background: [20,20,40],
  global: true,
})

loader();

camScale(0.25);

const map = addLevel([
  "=========",
  "=       =",
  "=       =",
  "=       =",
  "=       =",
  "=       =",
  "=       =",
  "=       =",
  "========="
], {
  tileWidth: 256,
  tileHeight: 256,
  tiles: {
    "=": () => [
      sprite("wall"),
      body({isStatic: true}),
      area(),
      "wall",
    ]
  }
})

const player = add([
  sprite("cat", {anim: "base"}), 
  scale(1),
  area({shape: new Polygon([vec2(0), vec2(125, 20), vec2(125, 100), vec2(0, 125), vec2(-50, 100), vec2(-50, 20)]) }),
  body(),
  pos(width()/2, height()/2),
  anchor("center"),
  {
    speed: 512,
    aim: 1,
  }
])

player.onUpdate(() => {
  // Set the viewport center to player.pos
  camPos(player.pos)
})

const pointer = player.add([
  sprite("pointer", {anim: "pointer"}),
  anchor("center"),
  scale(0.5),
  pos(180, 50),
  rotate(0),
  {
    translate: (player) => {
      if(player.aim == 1){
        return 0;
      }
      if(player.aim == 2){
        return 45;
      }
      if(player.aim == 3){
        return 315;
      }
      if(player.aim == 4){
        return 270;
      }
      if(player.aim == 5){
        return 90;
      }
      if(player.aim == -1){
        return 180;
      }
      if(player.aim == -2){
        return 135;
      }
      if(player.aim == -3){
        return 225;
      }
    }
  }
])

pointer.onUpdate(() => {
  if(player.aim > 0){
    if(player.aim == 2){
      pointer.pos.x = 150;
      pointer.pos.y = 150;
      pointer.angle = 45;
    }else if(player.aim == 3){
      pointer.angle = -45;
      pointer.pos.y = -50;
      pointer.pos.x = 100;
    } else if(player.aim == 4){
      pointer.pos.x = 0;
      pointer.pos.y = -90;
      pointer.angle = -90;
    } else if(player.aim == 5){
      pointer.pos.x = 0;
      pointer.pos.y = 150;
      pointer.angle = 90;
    } else {
      pointer.pos.x = 180;
      pointer.pos.y = 50;
      pointer.angle = 0;
    }
  }else {
    if(player.aim == -2){
      pointer.pos.x = -150
      pointer.pos.y = 150;
      pointer.angle = -225;
    }
    else if(player.aim == -3){
      pointer.pos.x = -100;
      pointer.pos.y = -50;
      pointer.angle = 225;
    }else {
      pointer.pos.x = -180;
      pointer.pos.y = 50;
      pointer.angle = 180;
    }
  }
})

onKeyPress("left", () => {
  player.flipX = true;
  player.area.offset = vec2(-75, 0);
})

onKeyPress("right", () => {
  player.flipX = false;
  player.area.offset = vec2(0, 0);
})

const dirs = {
  "left": LEFT,
  "right": RIGHT,
  "up": UP,
  "down": DOWN,
}

for (const dir in dirs) {
  onKeyDown(dir, () => {
    player.move(dirs[dir].scale(player.speed))
  })
}

onKeyPress("a", () => {
  add([
    sprite("cat_bullet", {anim: "idle"}),
    scale(0.8),
    pos(player.pos.x, player.pos.y + 35),
    area({scale: 0.7}),
    anchor("center"),
    move(pointer.translate(player), 1800),
    offscreen({ destroy: true }),
    "bullet"
  ])
})

onCollide("bullet", "wall", (b, w) => {
  b.destroy();
})

onUpdate(() => {
  if(isKeyDown("up")){
    player.aim = 4;
  }
  if(isKeyDown("down")){
    player.aim = 5;
  }

  if(isKeyDown("left")){
    if(isKeyDown("up")){
      player.aim = -3;
    }
    else if(isKeyDown("down")){
      player.aim = -2;
    }
    else {
      player.aim = -1;
    }
  }

  if(isKeyDown("right")){
    if(isKeyDown("up")){
      player.aim = 3;
    }
    else if(isKeyDown("down")){
      player.aim = 2;
    }
    else {
      player.aim = 1;
    }
  }

  console.log(player.aim);
})

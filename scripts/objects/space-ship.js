
function degToRad(degrees){
    return degrees * Math.PI/180;
}


// --------------------------------------------------------------
//
// Creates a SpaceShip object, with functions for managing state.
//
// spec = {
//         imageSrc: image,
//         center: { x: , y: },
//         size: { width: , height:  },
//         speed: { rotation: , x: , y: },
//         maxSpeed: {x: , y: },
//         minSpeed: {x: , y: },
//         gravity: ,
//         thrustPower: ,
//         thrustActive: bool
// }
//
// --------------------------------------------------------------
MyGame.objects.SpaceShip = function(spec) {
    'use strict';

    let rotation = 0;
    let imageReady = false;
    let image = new Image();

    image.onload = function() {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    function rotateLeft(elapsedTime) {
        rotation -= (spec.speed.rotation * elapsedTime);
        if (rotation < degToRad(-90)) {
            rotation = degToRad(-90);
        }
    }

    function rotateRight(elapsedTime) {
        rotation += (spec.speed.rotation * elapsedTime);
        if (rotation > degToRad(90)) {
            rotation = degToRad(90);
        }
    }
    
    function move() {
        spec.speed.y += spec.gravity;
        if (spec.speed.y > spec.maxSpeed.y) {
            spec.speed.y = spec.maxSpeed.y;
        }

        spec.center.x += spec.speed.x;
        spec.center.y += spec.speed.y;
    }

    function applyThrust(elapsedTime){
        spec.speed.x += (spec.thrustPower * elapsedTime) * Math.sin(rotation);
        spec.speed.y -= (spec.thrustPower * elapsedTime) * Math.cos(rotation);

        if (spec.speed.y < spec.minSpeed.y) {
            spec.speed.y = spec.minSpeed.y;
        }
        if (spec.speed.x > spec.maxSpeed.x) {
            spec.speed.x = spec.maxSpeed.x;
        }
        else if (spec.speed.x < spec.minSpeed.x) {
            spec.speed.x = spec.minSpeed.x;
        }
    }


    let api = {
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        move: move,
        applyThrust: applyThrust,

        get imageReady() { return imageReady; },
        get rotation() { return rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; }
    };

    return api;
}

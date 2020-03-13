// --------------------------------------------------------------
//
// Creates a Logo object, with functions for managing state.
//
// spec = {
//    imageSrc: ,   // Web server location of the image
//    center: { x: , y: },
//    size: { width: , height: }
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
        console.log(rotation);
    }

    function rotateRight(elapsedTime) {
        rotation += (spec.speed.rotation * elapsedTime);
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
        spec.speed.y -= (spec.thrustPower * elapsedTime);

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

    // function moveLeft(elapsedTime) {
    //     spec.center.x -= (spec.moveRate * elapsedTime);
    // }
    //
    // function moveRight(elapsedTime) {
    //     spec.center.x += (spec.moveRate * elapsedTime);
    // }
    //
    // function moveUp(elapsedTime) {
    //     spec.center.y -= (spec.moveRate * elapsedTime);
    // }
    //
    // function moveDown(elapsedTime) {
    //     spec.center.y += (spec.moveRate * elapsedTime);
    // }

    function moveTo(pos) {
        spec.center.x = pos.x;
        spec.center.y = pos.y;
    }

    let api = {
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        move: move,
        applyThrust: applyThrust,
        // moveLeft: moveLeft,
        // moveRight: moveRight,
        // moveUp: moveUp,
        // moveDown: moveDown,
        moveTo: moveTo,
        get imageReady() { return imageReady; },
        get rotation() { return rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; }
    };

    return api;
}

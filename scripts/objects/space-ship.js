
function degToRad(degrees){
    return degrees * Math.PI/180;
}

function radToDeg(radians){
    return radians * 180/Math.PI;
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
//         fuel: num
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
        if (!spec.freeze) {
            spec.speed.y += spec.gravity;

            spec.center.x += spec.speed.x;
            spec.center.y += spec.speed.y;
        }
    }

    function applyThrust(elapsedTime){
        if (spec.fuel > 0) {
            let posX = spec.center.x - Math.sin(rotation) * (spec.size.width/2);
            let posY = spec.center.y + Math.cos(rotation) * (spec.size.width/2);
            spec.emitThrustParticles(elapsedTime, rotation + Math.PI, {x: posX, y: posY});
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
            spec.fuel -= elapsedTime/100;
        }
        else if (spec.fuel < 0) {
            spec.fuel = 0;
        }
        else {
            spec.stopThrustParticles();
        }
    }

    function toggleFreeze(isFrozen) {
        spec.freeze = isFrozen;
    }


    let api = {
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        move: move,
        applyThrust: applyThrust,
        toggleFreeze: toggleFreeze,

        get imageReady() { return imageReady; },
        get rotation() { return rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; },
        get fuel() { return spec.fuel },
        get verticalSpeed() { return spec.speed.y * 3},
        get angle() {
            let angle = radToDeg(rotation);
            if (angle < 0) {
                angle = angle + 360;
            }
            return angle
        }
    };

    return api;
};

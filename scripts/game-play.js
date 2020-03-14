MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input, controls) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let myKeyboard = input.Keyboard();
    let terrain = null;
    let spaceShip = objects.SpaceShip({
        imageSrc: 'assets/space-ship.png',
        center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 4},
        size: { width: 50, height: 75 },
        speed: { rotation: .0015, x: 0, y: 0},
        maxSpeed: {x: 2 },
        minSpeed: {x: -2, y: -2},
        gravity: .01,
        thrustPower: .0025,
        thrustActive: false,
        fuel: 100,
    });

    function generateTerrain(canvas) {
        // initialize path of terrain array with bottom left and right points for
        // connecting the terrain shape and filling the terrain color
        let linePath = [
            {x: -5, y: canvas.height + 5},
            {x: canvas.width + 5, y: canvas.height + 5}
        ];
        let landZoneLength = 150;  //TODO: change this based on level 1 or level 2
        let terrainIterations = 100;
        let landZoneStartMax = (canvas.width * .85) - landZoneLength;
        let landZoneStartMin = canvas.width * .15;
        let minTerrainY = canvas.height * .6;
        let maxTerrainY = canvas.height - 15;

        // landing zone start and end points
        let landZoneA = {
            x: Math.floor(Math.random() * (landZoneStartMax - landZoneStartMin + 1)) + landZoneStartMin,
            y: Math.floor(Math.random() * (maxTerrainY - minTerrainY + 1)) + minTerrainY,
        };
        let landZoneB = {
            x: landZoneA.x + landZoneLength,
            y: landZoneA.y,
        };
        linePath.push(landZoneA, landZoneB);

        // terrain start and end points
        let pointA = {
            x: 0,
            y: Math.floor(Math.random() * (maxTerrainY - minTerrainY + 1)) + minTerrainY,
        };
        let pointB = {
            x: canvas.width,
            y: Math.floor(Math.random() * (maxTerrainY - minTerrainY + 1)) + minTerrainY,
        };
        linePath.push(pointA, pointB);

        // ratio for how many iterations on each side of the land zone based on the land zone position
        let landZonePositionX = (landZoneA.x + landZoneB.x) / 2;
        let leftTerrainRatio = landZonePositionX / canvas.width;
        let rightTerrainRatio = 1 - leftTerrainRatio;
        let leftTerrainIterations = terrainIterations * leftTerrainRatio;
        let rightTerrainIterations = terrainIterations * rightTerrainRatio;


        // Create new terrain points between start point and start of land zone
        getNewPoints(pointA, landZoneA, leftTerrainIterations);
        // Create new terrain points between end of land zone and end point
        getNewPoints(landZoneB, pointB, rightTerrainIterations);

        // sort points in linePath array based on their x value
        linePath.sort((a,b) => (a.x < b.x) ? -1 : 1);

        return linePath;

        /******************** Helper Functions for Terrain Generation Function *********************/
        // helper function to get Gaussian random number
        function gaussianRandom() {
            let u = 0, v = 0;
            while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
            while(v === 0) v = Math.random();
            return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        }
        // helper function to recursively generate terrain points
        function getNewPoints(a, b, count) {
            if (count > 1) {
                count = count/2;
                let s = 1; // surface roughness factor
                let r = s * gaussianRandom() * Math.abs(b.x - a.x);

                let newY = Math.floor((a.y + b.y)/2 + r);
                if (newY < minTerrainY) {newY = minTerrainY;}
                if (newY > maxTerrainY) {newY = maxTerrainY;}

                let c = { x: (a.x + b.x)/2, y: newY };

                linePath.push(c);

                getNewPoints(a, c, count);
                getNewPoints(c, b, count);
            }
        }
    }

    function checkCollision(){
        let len = terrain.length -1;
        for (let i = 0; i < len; i++) {
            if (rectIntersection(terrain[i], terrain[i+1], spaceShip.center, spaceShip.size)) {
                return true;
            }
        }
        return false;

        function rectIntersection(p1, p2, pos, size) {
            // pos: the center position of the ship
            let topLeftCorner = {x: pos.x - size.width/2, y: pos.y - size.height/2};
            let topRightCorner = {x: pos.x + size.width/2, y: pos.y - size.height/2};
            let bottomLeftCorner = {x: pos.x - size.width/2, y: pos.y + size.height/2};
            let bottomRightCorner = {x: pos.x + size.width/2, y: pos.y + size.height/2};

            let left = lineIntersection(p1, p2, topLeftCorner, bottomLeftCorner);
            let right = lineIntersection(p1, p2, topRightCorner, bottomRightCorner);
            let top = lineIntersection(p1, p2, topLeftCorner, topRightCorner);
            let bottom = lineIntersection(p1, p2, bottomLeftCorner, bottomRightCorner);

            return (left || right || top || bottom);
        }

        function lineIntersection(p1, p2, p3, p4) {
            // calculate the direction of the lines
            let uA = ((p4.x-p3.x)*(p1.y-p3.y) - (p4.y-p3.y)*(p1.x-p3.x)) / ((p4.y-p3.y)*(p2.x-p1.x) - (p4.x-p3.x)*(p2.y-p1.y));
            let uB = ((p2.x-p1.x)*(p1.y-p3.y) - (p2.y-p1.y)*(p1.x-p3.x)) / ((p4.y-p3.y)*(p2.x-p1.x) - (p4.x-p3.x)*(p2.y-p1.y));

            // if uA and uB are between 0-1, then the lines are colliding
            return (uA >= 0 && uA <=1 && uB >= 0 && uB <= 1);
        }
    }


    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update() {
        spaceShip.move();
        checkCollision();
    }

    function render() {
        graphics.clear();
        renderer.Terrain.render(terrain);
        renderer.SpaceShip.render(spaceShip);
        renderer.ShipInfo.render({
            fuel: spaceShip.fuel,
            verticalSpeed: spaceShip.verticalSpeed,
            angle: spaceShip.angle
        });
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update();
        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {

        myKeyboard.register('Escape', function() {
            //
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            //
            // Then, return to the main menu
            game.showScreen('main-menu');
        });

        let canvas = document.getElementById('canvas');
        terrain = generateTerrain(canvas);
    }

    function run() {
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
        myKeyboard.register(controls['Rotate Left'], spaceShip.rotateLeft);
        myKeyboard.register(controls['Rotate Right'], spaceShip.rotateRight);
        myKeyboard.register(controls['Thrust'], spaceShip.applyThrust);
    }

    return {
        initialize : initialize,
        run : run
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.controls));

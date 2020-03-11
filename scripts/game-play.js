MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let myKeyboard = input.Keyboard();
    let terrain = null;
    let spaceShip = objects.SpaceShip({
        imageSrc: 'assets/space-ship.png',
        center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 4},
        size: { width: 50, height: 75 },
        rotationSpeed: .003,
        gravity: .1
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


    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update() {

    }

    function render() {
        graphics.clear();
        renderer.Terrain.render(terrain);
        renderer.SpaceShip.render(spaceShip);
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
        myKeyboard.register('a', spaceShip.rotateLeft);
        myKeyboard.register('d', spaceShip.rotateRight);
    }

    return {
        initialize : initialize,
        run : run
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input));

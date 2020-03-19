MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input, controls, screens) {
    'use strict';

    let myKeyboard = input.Keyboard();
    let terrain = null;
    let showNextLevelText = false;
    let showLandText = false;
    let level = 1;

    let imageSmoke = new Image();
    imageSmoke.src = 'assets/smoke.png';
    let imageThrust = new Image();
    imageThrust.src = 'assets/smoke.png';
    let imageFire = new Image();
    imageFire.src = 'assets/fire.png';


    let fireParticleSystem = objects.ParticleSystem(graphics, {
        image: imageFire,
        center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 5},
        size: {mean: 20, stdev: 3},
        speed: { mean: .08, stdev: 0.02},
        lifetime: { mean: 700, stdev: 100}
    });

    let smokeParticleSystem = objects.ParticleSystem(graphics, {
        image: imageSmoke,
        center: {x: 300, y: 300},
        size: {mean: 15, stdev: 3},
        speed: { mean: .05, stdev: 0.02},
        lifetime: { mean: 2000, stdev: 500}
    });

    let thrustParticleSystem = objects.ParticleSystem(graphics, {
        image: imageThrust,
        center: {x: 300, y: 300},
        size: {mean: 15, stdev: 3},
        speed: { mean: 0, stdev: 0.08},
        lifetime: { mean: 250, stdev: 100}
    });


    let lastTimeStamp,
        cancelNextRequest,
        gamePaused,
        gameOver,
        gameWon,
        countdownTime,
        spaceShip,
        score,
        thrustSound,
        explosionSound,
        successSound,
        backgroundMusic;

    function resetValues(levelToLoad = 1, lvlOneScore = 0) {
        fireParticleSystem.clearParticles();
        smokeParticleSystem.clearParticles();
        thrustParticleSystem.clearParticles();
        lastTimeStamp = performance.now();
        level = levelToLoad;
        cancelNextRequest = false;
        gamePaused = false;
        gameOver = false;
        gameWon = false;
        countdownTime = 3000;
        spaceShip = objects.SpaceShip({
            imageSrc: 'assets/space-ship.png',
            center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 5},
            size: { width: 50, height: 75 },
            speed: { rotation: .0015, x: 0, y: 0},
            maxSpeed: {x: 2 },
            minSpeed: {x: -2, y: -2},
            gravity: .01,
            thrustPower: .0025,
            emitThrustParticles: thrustParticleSystem.startShipThrust,
            stopThrustParticles: thrustParticleSystem.clearParticles,
            fuel: 100,
            freeze: true
        });
        score = lvlOneScore;
    }

    function shipControlsOff(){
        myKeyboard.deregister(controls['Rotate Left']);
        myKeyboard.deregister(controls['Rotate Right']);
        myKeyboard.deregister(controls['Thrust']);
        myKeyboard.deregisterToggle(controls['Thrust']);
    }

    function shipControlsOn(){
        myKeyboard.register(controls['Rotate Left'], spaceShip.rotateLeft);
        myKeyboard.register(controls['Rotate Right'], spaceShip.rotateRight);
        myKeyboard.register(controls['Thrust'], function(elapsedTime){
            spaceShip.applyThrust(elapsedTime);
            if(spaceShip.fuel > 0) {
                thrustSound.playSound();
            }
            else {
                thrustSound.stopSound();
            }
        });
        myKeyboard.registerToggle(controls['Thrust'], function(elapsedTime){
            thrustSound.stopSound();
            thrustParticleSystem.clearParticles();
        });
    }

    function generateTerrain(level) {
        let canvas = graphics.canvas;
        let terrainIterations = 40;
        let minTerrainY = canvas.height * .6;
        let maxTerrainY = canvas.height - 15;

        // initialize path of terrain array with bottom left and right points for
        // connecting the terrain shape and filling the terrain color
        let linePath = [
            {x: -5, y: canvas.height + 5},
            {x: canvas.width + 5, y: canvas.height + 5}
        ];

        if (level === 1) {
            generateLandZone(150, canvas.width * .15, canvas.width/2 - 160, 0, canvas.width/2);
            generateLandZone(150, canvas.width/2, canvas.width * .85 - 150, canvas.width/2, canvas.width);
        }
        else if (level === 2) {
            terrainIterations = 100;
            generateLandZone(100, canvas.width * .15, canvas.width * .85 - 100, 0, canvas.width);
        }

        function generateLandZone(lengthLZ, minLZ, maxLZ, startX, endX) {
            // landing zone start and end points
            let landZoneA = {
                x: Math.floor(Math.random() * (maxLZ - minLZ + 1)) + minLZ,
                y: Math.floor(Math.random() * (maxTerrainY - minTerrainY + 1)) + minTerrainY,
                isLandZone: true
            };
            let landZoneB = {
                x: landZoneA.x + lengthLZ,
                y: landZoneA.y,
                isLandZone: true
            };
            linePath.push(landZoneA, landZoneB);

            // terrain start and end points
            let pointA = {
                x: startX,
                y: Math.floor(Math.random() * (maxTerrainY - minTerrainY + 1)) + minTerrainY,
                isLandZone: false
            };
            let pointB = {
                x: endX,
                y: Math.floor(Math.random() * (maxTerrainY - minTerrainY + 1)) + minTerrainY,
                isLandZone: false
            };
            linePath.push(pointA, pointB);

            // ratio for how many iterations on each side of the land zone based on the land zone position
            let landZonePositionX = (landZoneA.x + landZoneB.x) / 2;
            let leftTerrainRatio = landZonePositionX / endX;
            let rightTerrainRatio = 1 - leftTerrainRatio;
            let leftTerrainIterations = terrainIterations * leftTerrainRatio;
            let rightTerrainIterations = terrainIterations * rightTerrainRatio;

            // Create new terrain points between start point and start of land zone
            getNewPoints(pointA, landZoneA, leftTerrainIterations);
            // Create new terrain points between end of land zone and end point
            getNewPoints(landZoneB, pointB, rightTerrainIterations);
        }

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

                let c = { x: (a.x + b.x)/2, y: newY, isLandZone: false };

                linePath.push(c);

                getNewPoints(a, c, count);
                getNewPoints(c, b, count);
            }
        }
    }

    function checkCollision() {
        let collisionPoints = [];
        let safeLanding = true;

        // check for collisions and add all collision terrain points to an array
        for (let i = 0; i < terrain.length -1; i++) {
            // if the next terrain point is to the right of the ship, then the rest of the points are also to the
            // the right of the ship, and therefore will not have a chance for collision. To save on performance,
            // we don't check these points, as there is no point.
            if (terrain[i] > spaceShip.center + spaceShip.size.width/2) {
                break;
            }
            if (rectIntersection(terrain[i], terrain[i+1], spaceShip.center, spaceShip.size)) {
                collisionPoints.push(terrain[i]);
                collisionPoints.push(terrain[i+1]);
            }
        }

        // if any collision terrain points aren't the landing zone, then mark the collision as a crash
        for (let i = 0; i < collisionPoints.length; i++) {
            if (!collisionPoints[i].isLandZone) {
                safeLanding = false;
                break;
            }
        }
        // if the spaceship does not meet landing requirements, then mark the collision as a crash
        if (spaceShip.verticalSpeed >= 2 || !(spaceShip.angle >= 355 || spaceShip.angle <= 5)) {
            safeLanding = false;
        }

        // if there is a collision, freeze the ship, turn off controls, and run an end of game sequence
        if (collisionPoints.length > 0) {
            if (safeLanding) {
                winSequence();
            }
            else {
                gameOverSequence();
            }
        }

        /** Helper functions for collision detection **/
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

    function updateCountdown(elapsedTime) {
        countdownTime -= elapsedTime;
        if (countdownTime <= 5500 && showLandText){
            showLandText = false;
            showNextLevelText = true;
        }
        else if (countdownTime <= 3500 && showNextLevelText){
            showNextLevelText = false;
            reset(2, spaceShip.fuel * (3 - spaceShip.verticalSpeed));
        }
        else if (countdownTime <= 0 && gameOver) {
            fireParticleSystem.clearParticles();
            smokeParticleSystem.clearParticles();
            game.toggleDialog('game-over-menu');
            cancelNextRequest = true;
        }
        else if (countdownTime <= 0) {
            shipControlsOn();
            spaceShip.toggleFreeze(false);
        }
    }

    function togglePauseGame() {
        if (!gameOver) {
            gamePaused = !gamePaused;
            if (gamePaused) {
                spaceShip.toggleFreeze(true);
                shipControlsOff();
            }
            else {
                lastTimeStamp = performance.now();
                countdownTime = 3000;
            }
            game.toggleDialog('pause-menu');
        }
    }

    function gameOverSequence() {
        shipControlsOff();
        spaceShip.toggleFreeze(true);
        thrustSound.stopSound();
        backgroundMusic.stopSound();
        thrustParticleSystem.clearParticles();
        explosionSound.playSound();
        gameOver = true;
        countdownTime = 3000;
        score = Math.round(score);
        screens['high-scores'].updateMostRecentScore(score);
    }

    function winSequence() {
        spaceShip.toggleFreeze(true);
        shipControlsOff();
        thrustSound.stopSound();
        thrustParticleSystem.clearParticles();
        successSound.playSound();
        // if going from level one to two, else end of level two / the game.
        if (level === 1) {
            showLandText = true;
            countdownTime = 8000;
        }
        else {
            gameWon = true;
            cancelNextRequest = true;
            score = Math.round(score + (spaceShip.fuel * (4 - spaceShip.verticalSpeed)));
            screens['high-scores'].updateMostRecentScore(score);
            game.toggleDialog('game-over-menu');
        }
    }


    function processInput(elapsedTime) {
        if (!gamePaused && !gameOver) {
            myKeyboard.update(elapsedTime);
        }
    }

    function update(elapsedTime) {
        if (countdownTime <= 0 && !gamePaused && !gameWon && !gameOver) {
            spaceShip.move();
            checkCollision();
        }
        else if (countdownTime >= 0 && !gamePaused) {
            updateCountdown(elapsedTime);
        }
        if (gameOver) {
            fireParticleSystem.shipExplosion(elapsedTime, spaceShip.center);
            smokeParticleSystem.shipExplosion(elapsedTime, spaceShip.center);
        }
    }

    function render() {
        graphics.clear();
        renderer.Terrain.render(terrain);
        if (!gameOver) {
            renderer.SpaceShip.render(spaceShip);
        }
        renderer.ScreenText.renderShipInfo({
            fuel: spaceShip.fuel,
            verticalSpeed: spaceShip.verticalSpeed,
            angle: spaceShip.angle
        });
        if (countdownTime <= 3499 && countdownTime >= 0 && !gameWon && !gameOver) {
            renderer.ScreenText.renderCountdown(countdownTime);
        }
        if (gameOver && countdownTime <= 0) {
            renderer.ScreenText.renderGameOver(score);
        }
        if (showLandText && level === 1) {
            renderer.ScreenText.renderSafeLanding();
        }
        else if (gameWon) {
            renderer.ScreenText.renderWin(score);
        }
        else if (showNextLevelText) {
            renderer.ScreenText.renderNextLevel();
        }
        thrustParticleSystem.render();
        smokeParticleSystem.render();
        fireParticleSystem.render();
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function reset(levelToLoad = 1, lvlOneScore = 0) {
        resetValues(levelToLoad, lvlOneScore);
        terrain = generateTerrain(level);
    }

    function initialize() {
        thrustSound = objects.Sound({src: 'assets/thrust1.mp3', volume: 1, loop: true});
        explosionSound = objects.Sound({src: 'assets/explosion.mp3', volume: .75, loop: false});
        successSound = objects.Sound({src: 'assets/success.mp3', volume: .55, loop: false});
        backgroundMusic = objects.Sound({src: 'assets/menu-music.mp3', volume: .04, loop: true});
        terrain = generateTerrain(level);
    }

    function run() {
        resetValues();
        backgroundMusic.playSound();
        myKeyboard.registerToggle('Escape', function(){togglePauseGame();});
        requestAnimationFrame(gameLoop);
    }

    function stopGame() {
        cancelNextRequest = true;
        myKeyboard.deregisterToggle('Escape');
        backgroundMusic.stopSound();
    }


    return {
        initialize : initialize,
        run : run,
        togglePauseGame : togglePauseGame,
        reset : reset,
        stopGame : stopGame
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.controls, MyGame.screens));

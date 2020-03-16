// --------------------------------------------------------------
//
// Renders the on screen information (Game over, countdown, etc).
//
// --------------------------------------------------------------
MyGame.render.ScreenText = (function(graphics) {
    'use strict';
    // --------------------------------------------------------------
    // spec = { fuel: , verticalSpeed: , angle: }
    // --------------------------------------------------------------
    function renderShipInfo(spec) {
        let fuelText = `Fuel: ${spec.fuel.toFixed(1)}`;
        graphics.drawText(fuelText, {x: 10, y: 40}, '30px Orbitron');

        let speedText = `Vertical Speed: ${spec.verticalSpeed.toFixed(1)}`;
        graphics.drawText(speedText, {x: 10, y: 90}, '30px Orbitron');

        let angleText = `Angle: ${spec.angle.toFixed(1)}`;
        graphics.drawText(angleText, {x: 10, y: 140}, '30px Orbitron');
    }

    function renderCountdown(time) {
        let spec = {
            font: '128px Orbitron',
            fill: '#f5eaea',
            text: Math.ceil(time / 1000).toString()
        };
        let textWidth = graphics.measureTextWidth(spec);
        let textHeight = graphics.measureTextHeight(spec);
        let position = {x: graphics.canvas.width/2 - textWidth/2, y: graphics.canvas.height/2 - textHeight};
        graphics.drawText(spec.text, position, spec.font);
    }

    function renderGameOver() {
        let spec = {
            font: '128px Orbitron',
            fill: '#f5eaea',
            text: "Game Over!"
        };
        let textWidth = graphics.measureTextWidth(spec);
        let textHeight = graphics.measureTextHeight(spec);
        let position = {x: graphics.canvas.width/2 - textWidth/2, y: graphics.canvas.height/2 - textHeight};
        graphics.drawText(spec.text, position, spec.font);
        //
        // spec.font = '36px Orbitron';
        // spec.text = 'Press ESC to go to main menu';
        // textWidth = graphics.measureTextWidth(spec);
        // textHeight = graphics.measureTextHeight(spec);
        // position = {x: graphics.canvas.width/2 - textWidth/2, y: graphics.canvas.height/2 - (textHeight + 30) };
        // graphics.drawText(spec.text, position, spec.font);
        //
        // spec.text = 'Press P to play again';
        // textWidth = graphics.measureTextWidth(spec);
        // position = {x: graphics.canvas.width/2 - textWidth/2, y: graphics.canvas.height/2 - (textHeight - 10) };
        // graphics.drawText(spec.text, position, spec.font);
    }

    return {
        renderShipInfo: renderShipInfo,
        renderCountdown: renderCountdown,
        renderGameOver: renderGameOver
    };
}(MyGame.graphics));
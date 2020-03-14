// --------------------------------------------------------------
//
// Renders the ship information.
//
// spec = {
//    fuel:
//    verticalSpeed:
//    angle:
// }
//
// --------------------------------------------------------------
MyGame.render.ShipInfo = (function(graphics) {
    'use strict';

    function render(spec) {
        let fuelText = `Fuel: ${spec.fuel.toFixed(1)}`;
        graphics.drawText(fuelText, {x: 10, y: 40}, '30px Orbitron');

        let speedText = `Vertical Speed: ${spec.verticalSpeed.toFixed(1)}`;
        graphics.drawText(speedText, {x: 10, y: 90}, '30px Orbitron');

        let angleText = `Angle: ${spec.angle.toFixed(1)}`;
        graphics.drawText(angleText, {x: 10, y: 140}, '30px Orbitron');
    }

    return {
        render: render
    };
}(MyGame.graphics));

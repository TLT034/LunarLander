// --------------------------------------------------------------
//
// Renders a SpaceShip object.
//
// spec = {
//    image: ,
//    center: { x: , y: },
//    size: { width: , height: }
// }
//
// --------------------------------------------------------------
MyGame.render.SpaceShip = (function(graphics) {
    'use strict';

    function render(spec) {
        if (spec.imageReady) {
            graphics.drawTexture(spec.image, spec.center, spec.rotation, spec.size);
        }
    }

    return {
        render: render
    };
}(MyGame.graphics));

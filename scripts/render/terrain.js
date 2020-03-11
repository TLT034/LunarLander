// --------------------------------------------------------------
//
// Renders terrain
//
// terrain = [{x: int, y: int }]
//
// --------------------------------------------------------------
MyGame.render.Terrain = (function(graphics) {
    'use strict';

    function render(terrain) {
        graphics.drawShape('#D8D8D8', '#3A3A3A',3, terrain);
    }

    return {
        render: render
    };
}(MyGame.graphics));
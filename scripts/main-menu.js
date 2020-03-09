MyGame.screens['main-menu'] = (function(game) {
    'use strict';

    function initialize() {
        //
        // Setup each of menu events for the screens
        document.getElementById('new-game-button').addEventListener(
            'click',
            function() {game.showScreen('game-play'); });

        document.getElementById('high-scores-button').addEventListener(
            'click',
            function() { game.showScreen('high-scores'); });

        document.getElementById('controls-button').addEventListener(
            'click',
            function() { game.showScreen('controls'); });

        document.getElementById('credits-button').addEventListener(
            'click',
            function() { game.showScreen('credits'); });
    }

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));

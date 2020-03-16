MyGame.screens['game-over-dialog'] = (function(game, screens) {
    'use strict';

    function initialize() {

        document.getElementById('game-over-restart-button').addEventListener(
            'click',
            function() {
                screens['game-play'].newGame();
                game.toggleDialog('game-over-menu');
            });

        document.getElementById('game-over-main-menu-button').addEventListener(
            'click',
            function() {
                screens['game-play'].reset();
                game.toggleDialog('game-over-menu');
                game.showScreen('main-menu')
            });
    }

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game, MyGame.screens));
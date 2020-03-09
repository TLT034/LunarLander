MyGame.screens['high-scores'] = (function(game) {
    'use strict';


    function initialize() {
        document.getElementById('high-scores-back-button').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });
    }

    function run() {
        // let lastScore = MyGame.lastScore;
        // let highScores = {};
        // let previousScores = localStorage.getItem('highScores');
        // if (previousScores !== null) {
        //     highScores = JSON.parse(previousScores);
        // }
        // checkNewHighScore();
        // report();
        //
        //
        // function checkNewHighScore() {
        //     if (lastScore !== null) {
        //         let lowestScore = 99999;
        //         let lowestScoreKey;
        //         // if there are high scores, get the lowest score
        //         for (let key in highScores) {
        //             if (highScores[key].score < lowestScore) {
        //                 lowestScoreKey = key;
        //                 lowestScore = highScores[key].score;
        //             }
        //         }
        //
        //         // if the last score is better than the lowest score or there are less than 5 high scores,
        //         // add last score to high scores
        //         if (lastScore.score > lowestScore || Object.keys(highScores).length < 5) {
        //             highScores[Date.now()] = lastScore;
        //             if (Object.keys(highScores).length > 5) {
        //                 delete highScores[lowestScoreKey];
        //             }
        //             localStorage['highScores'] = JSON.stringify(highScores);
        //         }
        //     }
        // }
        //
        // function report() {
        //     let htmlNode = document.getElementById('high-score-list');
        //     htmlNode.innerHTML = '';
        //     for (let key in highScores) {
        //         let listItem = document.createElement('li');
        //         let scoreObj = highScores[key];
        //         listItem.appendChild(
        //             document.createTextNode(`Score: ${scoreObj.score} | Time: ${scoreObj.time}s | Maze: ${scoreObj.size}`)
        //         );
        //         htmlNode.appendChild(listItem);
        //     }
        // }
        // MyGame.lastScore = null;
    }


    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
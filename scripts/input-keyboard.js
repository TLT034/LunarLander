MyGame.input.Keyboard = function () {
    let that = {
        keys: {},
        handlers: {},
        toggleKeys : {},
        toggleHandlers: {},
    };

    function keyDown(e) {
        that.keys[e.key] = e.timeStamp;
    }

    function keyRelease(e) {
        delete that.keys[e.key];
        that.toggleKeys[e.key] = e.key;
    }

    that.update = function (elapsedTime) {
        for (let key in that.keys) {
            if (that.keys.hasOwnProperty(key)) {
                if (that.handlers[key]) {
                    that.handlers[key](elapsedTime);
                }
            }
        }
        for (let key in that.toggleKeys) {
            if (that.toggleKeys.hasOwnProperty(key)) {
                if (that.toggleHandlers[key]) {
                    that.toggleHandlers[key]();
                }
            }
        }
        that.toggleKeys = {};
    };

    that.registerToggle = function (key, handler) {
        if (!(key in that.toggleKeys)){
            that.toggleHandlers[key] = handler;
        }
    };

    that.deregisterToggle = function (key) {
        delete that.toggleHandlers[key];
    };

    that.register = function (key, handler) {
        that.handlers[key] = handler;
    };

    that.deregister = function (key) {
        delete that.handlers[key];
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyRelease);

    return that;
};

/**
 * Created by Rock on 8/16/14.
 */

var TrembleEffect = cc.Class.extend({
    sprite: null,

    ctor: function( arg ) {
        this.sprite = arg;
        this.changeDir();
    },

    changeDir: function() {
        var time = 0.05;
        this.sprite.runAction(
            cc.sequence(
                cc.moveBy( time, cc.p(25, 0) ),
                cc.moveBy( time, cc.p(-50,0) ),
                cc.moveBy( time, cc.p(50,0) ),
                cc.moveBy( time, cc.p(-50,0) ),
                cc.moveBy( time, cc.p(25,0) )
            )
        )
    }
});

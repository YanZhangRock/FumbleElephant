/**
 * Created by Rock on 8/16/14.
 */

var g_elephCfg = {
    initPos: [
        [0.15,0.7], [0.53,0.7], [0.84,0.7],
        [0.16,0.45], [0.53,0.45], [0.84,0.45],
        [0.15,0.313], [0.52,0.3], [0.84,0.302]
    ]
}

var Elephant = cc.Sprite.extend({
    id: 0,
    mgr: null,
    listener: null,
    isTestHit: true,

    ctor:function ( arg ) {
        this._super( res["Eleph".concat( arg.toString().concat("_png") )] );
        this.id = arg;
        this.attr({
            x: g_size.width * g_elephCfg.initPos[this.id][0],
            y: g_size.height * g_elephCfg.initPos[this.id][1],
            scale: 0.82,
            rotation: 0
        });
        var self = this;
        this.listener =  cc.EventListener.create( {
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : true,
            onTouchBegan : function( touch, event ){ self.onTouchBegan( touch, event ) },
            onTouchEnded : function( touch, event ){ self.onTouchEnded( touch, event ) }
        } );
        cc.eventManager.addListener( this.listener, this );

    },

    setTestHit: function( val ) {
        this.isTestHit = val;
    },

    onTouchBegan:function (touch, event) {
        if( !this.isTestHit ) return false;
        var target = event.getCurrentTarget();
        //Check the click area
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);
        if (!cc.rectContainsPoint(rect, locationInNode)) return false;
        //on hit
        target.opacity = 255;
        //test
        cc.log("elephant id: "+target+", "+target.id);
        return true;
    },

    onTouchEnded:function (touch, event) {
        return true;
    }
});
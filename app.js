var g_size;

var ElephantLayer = cc.Layer.extend({
    sprite: null,

    ctor:function () {
        this._super();
        //close btn
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: g_size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });
        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);
        // hello label
//        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
//        // position the label on the center of the screen
//        helloLabel.x = g_size.width / 2;
//        helloLabel.y = 0;
//        // add the label as a child to this layer
//        this.addChild(helloLabel, 5);

//        this.sprite.runAction(
//            cc.sequence(
//                cc.rotateTo(2, 0),
//                cc.scaleTo(2, 1, 1)
//            )
//        );
//        helloLabel.runAction(
//            cc.spawn(
//                cc.moveBy(2.5, cc.p(0, g_size.height - 40)),
//                cc.tintTo(2.5,255,125,0)
//            )
//        );
        return true;
    }
});

var ElephantScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        g_size = cc.winSize;
        var layer = new ElephantLayer();
        var gameLayer = new GameLayer();
        this.addChild(layer, 0);
        this.addChild(gameLayer, 999);
        gameLayer.gameStart();
    }
});


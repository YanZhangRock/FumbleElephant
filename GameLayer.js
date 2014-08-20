/**
 * Created by Rock on 8/16/14.
 */
var GameLayer = cc.Layer.extend({
    elephants: new Array(),
    elephSeq: new Array(),
    curElephNum: 0,
    timerLabel: null,
    scoreLabel: null,
    titleLabel: null,
    resultLabel: null,
    restTime: 0,
    score: 0,
    percent: 0,
    restartMenu: null,
    shareBtn: null,
    shareSprite: null,
    coverMenu: null,
    shareMenu: null,
    curElephIdx: 0,
    showElephTimerIdx: 0,
    state: null,

    ctor: function(){
        this._super();
        document.title = GameLayer.TITLE;
        // restart label
        var label = new cc.LabelTTF("重新开始", "Arial", 60);
        var self = this;
        var restart = new cc.MenuItemLabel(label, function(){
            if( self.state == GameLayer.STATE.SHARE ) return;
            self.gameStart();
        } );
        var menu = new cc.Menu(restart);
        menu.x = g_size.width * 100;
        menu.y = g_size.height * 100;
        this.restartMenu = menu;
        this.addChild(menu, 0);
        // share label
        var label = new cc.LabelTTF("炫耀", "Arial", 60);
        var self = this;
        var share = new cc.MenuItemLabel(label, function(){
            if( self.state == GameLayer.STATE.SHARE ) return;
            self.shareResult();
        } );
        var menu = new cc.Menu(share);
        menu.x = g_size.width * 100;
        menu.y = g_size.height * 100;
        this.shareMenu = menu;
        this.addChild(menu, 0);
        // title label
        this.titleLabel = new cc.LabelTTF( GameLayer.TITLE, "Arial", 36, cc.size(g_size.width * 0.85, 100), cc.TEXT_ALIGNMENT_CENTER );
        this.titleLabel.attr({
            x: g_size.width * 0.45,
            y: g_size.height * 0.9,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(this.titleLabel, 0);
        // timer label
        this.timerLabel = new cc.LabelTTF( "", "Arial", 36, cc.size(g_size.width * 0.85, 320), cc.TEXT_ALIGNMENT_LEFT );
        this.timerLabel.attr({
            x: g_size.width * 0.5,
            y: g_size.height * 0.7,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(this.timerLabel, 0);
        // score label
        this.scoreLabel = new cc.LabelTTF( "", "Arial", 36, cc.size(g_size.width * 0.85, 320), cc.TEXT_ALIGNMENT_LEFT );
        this.scoreLabel.attr({
            x: g_size.width * 1.0,
            y: g_size.height * 0.7,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.addChild(this.scoreLabel, 0);
        // result label
        this.resultLabel = new cc.LabelTTF( "", "Arial", 36, cc.size(g_size.width * 0.85, 320), cc.TEXT_ALIGNMENT_LEFT );
        this.resultLabel.attr({
            x: g_size.width * 0.5,
            y: g_size.height * 0.2,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.resultLabel.setVisible( false );
        this.addChild(this.resultLabel, 0);
        // elephant
        for( var i=0; i<9; i++ ) {
            var elephant = new Elephant( i );
            this.addElephant( elephant );
        }
    },

    setRestTime: function( restTime ) {
        this.restTime = restTime;
        this.timerLabel.setString( "剩余时间: " + this.restTime.toString() );
    },

    setScore: function( score ) {
        this.score = score;
        this.scoreLabel.setString( "得分: " + this.score.toString() );
    },

    addElephant: function( elephant ){
        this.elephants.push( elephant );
        elephant.mgr = this;
        elephant.setVisible( false );
        elephant.setTestHit( false );
        this.addChild( elephant, 999 );
    },

    clearElephant: function() {
        for ( var i in this.elephants ) {
            this.elephants[i].setVisible( false );
            this.elephants[i].setTestHit( false );
            this.elephants[i].setOpacity( Elephant.UNCLICK_OPACITY );
        }
    },

    makeElephSeq: function() {
        this.elephSeq = [];
        this.curElephIdx = 0;
        var tmp = new Array();
        for ( var i in this.elephants ) {
            tmp.push(i);
        }
        for( var i=0; i<this.elephants.length; i++ ){
            var idx = Math.floor( Math.random() * tmp.length );
            this.elephSeq.push( tmp[idx] );
            tmp.splice( idx, 1 );
        }
    },

    showElephFrag: function() {
        if( this.showElephTimerIdx >= this.curElephNum-1 ) {
            this.state = GameLayer.STATE.GAME;
        }
        if( this.showElephTimerIdx >= this.curElephNum ) {
            this.showElephTimerIdx = 0;
            this.unschedule( this.showElephFrag );
            return;
        }
        var idx = this.elephSeq[this.showElephTimerIdx];
        this.elephants[idx].setVisible( true );
        this.elephants[idx].setTestHit( true );
        this.elephants[idx].setOpacity( Elephant.UNCLICK_OPACITY );
        this.showElephTimerIdx++;
    },

    onClickElephFrag: function( eleph ) {
        if( this.isCorrectSeq( eleph.id ) ) {
            eleph.setOpacity( Elephant.CLICK_OPACITY );
            this.score += GameLayer.CORRECT_SCORE;
            this.setScore( this.score );
            this.nextGuess();
        } else {
            this.score += GameLayer.WRONG_SCORE;
            this.setScore( this.score );
            if( this.score <= GameLayer.LOSE_SCORE ) {
                this.gameEnd();
            }
            new TrembleEffect( eleph );
        }
    },

    isCorrectSeq: function( idx ) {
        if( this.state != GameLayer.STATE.GAME ) return false;
        return idx == this.elephSeq[this.curElephIdx];
    },

    nextGuess: function() {
        if( this.curElephIdx < this.curElephNum-1 ) {
            this.curElephIdx++;
        } else {
            this.addDiffculty = ( this.addDiffculty + 1 ) %2;
            this.curElephNum += this.addDiffculty;
            this.curElephNum = this.curElephNum > GameLayer.MAX_ELEPH ? GameLayer.MAX_ELEPH : this.curElephNum;
            this.createElephant();
        }
    },

    createElephant: function() {
        this.clearElephant();
        this.makeElephSeq();
        this.state = GameLayer.STATE.DRAW_ELEPH;
        this.schedule( this.showElephFrag, GameLayer.ELEPH_SHOW_INTERVAL );
    },

    checkTimeUp: function() {
      if( this.restTime > 0 ) {
          this.setRestTime( --this.restTime );
      } else {
          this.gameEnd();
      }
    },

    showEndUI: function( isShow ) {
        if( isShow ) {
            this.restartMenu.x = g_size.width * 0.5;
            this.restartMenu.y = g_size.height * 0.5;
            this.shareMenu.x = g_size.width * 0.5;
            this.shareMenu.y = g_size.height * 0.6;
            this.resultLabel.setVisible( true );
        } else {
            this.restartMenu.x = g_size.width * 100;
            this.restartMenu.y = g_size.height * 100;
            this.shareMenu.x = g_size.width * 100;
            this.shareMenu.y = g_size.height * 100;
            this.resultLabel.setVisible( false );
        }
    },

    addCoverBtn: function() {
        var self = this;
        var btn = new cc.MenuItemImage(
            res.g,
            res.g,
            function () {
                self.cancelShare();
            }, this);
        btn.attr({
            x: g_size.width * 0.5,
            y: g_size.height * 0.5,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this.coverMenu = new cc.Menu(btn);
        this.coverMenu.x = 0;
        this.coverMenu.y = 0;
        this.coverMenu.setOpacity( 180 );
        this.coverMenu.setScale( 100 );
        this.addChild(this.coverMenu, 999);
    },

    shareResult: function() {
        this.addCoverBtn();
        this.state = GameLayer.STATE.SHARE;
        this.shareSprite = new cc.Sprite( res.Share );
        this.shareSprite.attr({
            x: g_size.width * 0.7,
            y: g_size.height * 0.9,
            scale: 1.0
        });
        this.addChild( this.shareSprite, 1000 );
        document.title = this.getShareResultStr( this.percent );
    },

    getShareResultStr: function( percent ) {
        var name = percent <= 0.5 ? "手残" : "圣手";
        var per = Math.round( percent*10000 ) / 100;
        var str = "本大瞎以惊人智商击败了全球%" + per.toString() + "的瞎子，获得‘摸象" +
            name + "'称号！";
        return str;
    },

    getResultStr: function( percent ) {
        var per = Math.round( percent*10000 ) / 100;
        var str = "您击败了全世界%" + per.toString() + "的瞎子！"
        return str;
    },

    cancelShare: function() {
        this.removeChild( this.coverMenu );
        this.state = GameLayer.STATE.END;
        if( this.shareSprite == null ) return;
        this.removeChild( this.shareSprite );
        this.shareSprite = null;
        document.title = GameLayer.TITLE;
    },

    gameEnd: function() {
        this.unschedule( this.checkTimeUp );
        this.unschedule( this.showElephFrag );
        this.showElephTimerIdx = 0;
        this.clearElephant();
        this.showEndUI( true );
        this.state = GameLayer.STATE.END;
        // request result
        if( this.score <= 0 ) {
            this.percent = 0;
            this.resultLabel.setString( this.getResultStr(this.percent) );
            return;
        }
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", "http://minihugscorecenter.appspot.com/scorecenter?Score="+this.score
            +"&Game=FumbleElephantTest2");
        var self = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                self.percent = parseFloat( xhr.responseText );
            }
            self.resultLabel.setString( self.getResultStr(self.percent) );
        };
        xhr.send();
    },

    gameStart: function() {
        this.showEndUI( false );
        this.setRestTime( GameLayer.TOTAL_TIME );
        this.setScore( 0 );
        this.schedule( this.checkTimeUp, 1 );
        this.createElephant();
        this.resultLabel.setString( "" );
        this.percent = 0;
        this.curElephNum = GameLayer.MIN_ELEPH;
        this.addDiffculty = 1;
    }
})

GameLayer.ELEPH_SHOW_INTERVAL = 0.15;
GameLayer.TOTAL_TIME = 60;
GameLayer.CORRECT_SCORE = 10;
GameLayer.WRONG_SCORE = -3;
GameLayer.LOSE_SCORE = -10;
GameLayer.STATE = {
    DRAW_ELEPH: 1,
        SHARE: 2,
        GAME: 3,
        END: 4
};
GameLayer.TITLE = "盲人摸象";
GameLayer.MIN_ELEPH = 4;
GameLayer.MAX_ELEPH = 9;
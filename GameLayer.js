/**
 * Created by Rock on 8/16/14.
 */
var GameLayer = cc.Layer.extend({
    elephants: new Array(),
    elephSeq: new Array(),
    timerLabel: null,
    scoreLabel: null,
    titleLabel: null,
    restTime: 0,
    score: 0,
    restartBtn: null,
    shareBtn: null,
    curElephIdx: 0,
    showElephTimerIdx: 0,
    isFumbleReady: false,

    ctor: function(){
        this._super();
        // restart label
        var label = new cc.LabelTTF("重新开始", "Arial", 60);
        var self = this;
        var restart = new cc.MenuItemLabel(label, function(){ self.gameStart() } );
        var menu = new cc.Menu(restart);
        menu.x = g_size.width * 100;
        menu.y = g_size.height * 100;
        this.restartBtn = menu;
        this.addChild(menu, 0);
        // title label
        this.titleLabel = new cc.LabelTTF( "盲人摸象", "Arial", 36, cc.size(g_size.width * 0.85, 100), cc.TEXT_ALIGNMENT_CENTER );
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
        if( this.showElephTimerIdx >= this.elephants.length-1 ) {
            this.isFumbleReady = true;
        }
        if( this.showElephTimerIdx >= this.elephants.length ) {
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
        if( !this.isFumbleReady ) return false;
        return idx == this.elephSeq[this.curElephIdx];
    },

    nextGuess: function() {
        if( this.curElephIdx < this.elephants.length-1 ) {
            this.curElephIdx++;
        } else {
            this.createElephant();
        }
    },

    createElephant: function() {
        this.clearElephant();
        this.makeElephSeq();
        this.isFumbleReady = false;
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
            this.restartBtn.x = g_size.width * 0.5;
            this.restartBtn.y = g_size.height * 0.5;
        } else {
            this.restartBtn.x = g_size.width * 100;
            this.restartBtn.y = g_size.height * 100;
        }
    },

    gameEnd: function() {
        this.unschedule( this.checkTimeUp );
        this.clearElephant();
        this.showEndUI( true );
    },

    gameStart: function() {
        this.showEndUI( false );
        this.setRestTime( GameLayer.TOTAL_TIME );
        this.setScore( 0 );
        this.schedule( this.checkTimeUp, 1 );
        this.createElephant();
    }
})

GameLayer.ELEPH_SHOW_INTERVAL = 0.3;
GameLayer.TOTAL_TIME = 60;
GameLayer.CORRECT_SCORE = 10;
GameLayer.WRONG_SCORE = -2;
GameLayer.LOSE_SCORE = -10;
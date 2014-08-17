/**
 * Created by Rock on 8/16/14.
 */
var GameLayer = cc.Layer.extend({
    elephants: new Array(),
    elephSeq: new Array(),
    curElephIdx: 0,
    showElephTimerIdx: 0,

    ctor: function(){
        this._super();
        // elephant
        for( var i=0; i<9; i++ ) {
            var elephant = new Elephant( i );
            this.addElephant( elephant );
        }
        return true;
    },

    addElephant: function( elephant ){
        this.elephants.push( elephant );
        elephant.mgr = this;
        elephant.setVisible( false );
        elephant.setTestHit( false );
        this.addChild( elephant );
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
        if( this.showElephTimerIdx >= this.elephants.length ) return;
        var idx = this.elephSeq[this.showElephTimerIdx];
        this.elephants[idx].setVisible( true );
        this.elephants[idx].setTestHit( true );
        this.elephants[idx].setOpacity( 180 );
        cc.log("~~~~"+idx);
        this.showElephTimerIdx++;
    },

    gameStart: function() {
        this.makeElephSeq();
        this.schedule( this.showElephFrag, 0.5 );
    }
})
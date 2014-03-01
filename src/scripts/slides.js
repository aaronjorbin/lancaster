jQuery.extend(verge);

var slides = {
    0 : { // tools
        url: 'http://aaronjorbin.github.io/lancaster/tooling.html'
    },
    1 : { // grunt
        url : 'http://aaronjorbin.github.io/lancaster/grunt.html'
    },
    2 : { // photoshop
        url : 'http://aaronjorbin.github.io/lancaster/photoshop.html'
    },
    3 : { // drc
        url : 'http://aaronjorbin.github.io/lancaster/drc.html'
    },
    4 : { // wpnocode
        url : 'http://aaronjorbin.github.io/lancaster/wpnocode.html'
    },
    5 : { // users
        url : 'http://aaronjorbin.github.io/lancaster/users.html'
    }
},
    doneSlides = [],
    newSlides = [],
    interval = setInterval( function(){
        $.get( 'http://dukakis.herokuapp.com/votes', function(data){
            var sorted = _.sortBy( data.questions , function(q){
                return q.value
            }).reverse();
            newSlides  = _.pluck( sorted  , 'id' );
        });
    }, 6000 ),
    setDeck = function (url){
        $('#main').html( '<iframe src="'+ url + '" height="'+ $.viewportH()  +'" width="100%" />');
    },
    newSlideDeck = function(){
        var newDeck;
        // if doneSlides.length is 5, show final slide and exit
        if (doneSlides.length >= 5)
            return;

        $.each(newSlides, function(index, value){
            // if newDeck is empty, continue
            if (typeof newDeck !== 'undefined') {
                return;
            }
            // if value is in doneSlides, continue
            if ( _.contains(doneSlides, value) ) {
                return;
            }
            newDeck = value;
        });

        setDeck( slides[newDeck].url );
        doneSlides.push( newDeck );


    }

$('#start').click( function(){

    setDeck( 'http://aaronjorbin.github.io/lancaster/challange.html' );
    $('#start').hide();
    setTimeout( function(){
        newSlideDeck();
    }, 300000 );
});

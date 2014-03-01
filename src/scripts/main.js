/* global Handlebars */
(function(){
    'use strict';
    var url = 'http://dukakis.herokuapp.com/votes',
        tmplVote = Handlebars.compile( $('#tmpl-vote').html() );

    $.get(url, function( data ){
        $('#presentations').html( tmplVote( data ) );
    });
    $('#presentations').change(function(){
        $('#presentations').find('input').prop('disabled', true)
        $.post(url, {'vote': $('#presentations').find(':checked').data('voteid')  }, function(){})
    })
}());

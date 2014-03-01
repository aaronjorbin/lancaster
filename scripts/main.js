/* global Handlebars */
(function(){
    'use strict';
    var url = 'http://dukakis.herokuapp.com/votes'
        , tmplVote = Handlebars.compile( $('#tmpl-vote').html() )
		, fingerprint = false

	// populate votes
    $.get(url, function( data ){
        $('#presentations').html( tmplVote( data ) )
    })

	// get our fingerprint
	fingerprint = new Fingerprint().get(); 

    $('#presentations').change(function(){
        $('#presentations').find('input').prop('disabled', true)
        $.post(url, {
			'vote'		  : $('#presentations').find(':checked').data('voteid'),
			'fingerprint' : fingerprint 
		}, function(){})
    })
}())

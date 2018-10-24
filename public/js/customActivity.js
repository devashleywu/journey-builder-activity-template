define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};

    var steps = [{
		"label": "Create Message",
		"key": "step1"
	},
	{
		"label": "Define Expiry Date",
		"key": "step2"
	}];
	var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    // connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }

    function initialize(data) {
        // DEBUG
        console.log('data ' + data);

        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );
  
        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        // $.each(inArguments, function(index, inArgument) {
        //     $.each(inArgument, function(key, val) {
        //         if (key === 'username') {
        //             username = val;
        //         }
        //     });
        // });


        // If there is no message selected, disable the next button

        // if (!username) {
        //     showStep(null, 1);
        //     connection.trigger('updateButton', { button: 'next', enabled: false });
        //     // If there is a message, skip to the summary step
        // } else {
        //     $('#select1').find('option[value='+ message +']').attr('selected', 'selected');
        //     $('#message').html(message);
        //     showStep(null, 3);
        // }

        // DEBUG
        console.log('hasInArguments ' + hasInArguments);
        console.log('inArguments' + inArguments);
        // console.log('inArguments details ' + payload['arguments'].execute.inArguments[0].emailAddress);

        // connection.trigger('updateButton', {
        //     button: 'next',
        //     text: 'done',
        //     visible: true
        // });
    }

    function onGetTokens(tokens) {
        // DEBUG
        console.log('token ' + tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        // DEBUG
        console.log('endpoints ' + endpoints);
    }

    function onClickedNext () {
		if (currentStep.key === 'step2') {
			save();
		} else {
			connection.trigger('nextStep');
		}
	}

	function onClickedBack () {
		connection.trigger('prevStep');
	}

	function onGotoStep (step) {
		showStep(step);
		connection.trigger('ready');
	}

	function showStep (step, stepIndex) {
		if (stepIndex && !step) {
			step = steps[stepIndex - 1];
		}

		currentStep = step;

		$('.step').hide();

		switch (currentStep.key) {
		case 'step1':
			$('#step1').show();
			$('#step1 input').focus();
			break;
		case 'step2':
			$('#step2').show();
			// $('#step2 input').focus();
			break;
		}
	}

    function save() {
        var message = $('#message').val();
        var expiry = $('#datepicker').val();
        // $.each(payload['arguments'].execute.inArguments, function(index, inArgument) {
        //     $.each(inArgument, function(key, val) {
        //         if (key === 'tokens') {
        //             tokens = authTokens;
        //         }
        //         if (key === 'username') {
        //             username = username;
        //         } 
        //     });
        // });

        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "message": message
            // "emailAddress" : emailAddress,
            // "username": username
        }];
        
        payload['metaData'].isConfigured = true;

        // DEBUG
        console.log('payload ' + payload);
        console.log('payload metadata ' + payload['metaData'].isConfigured);
        // console.log('username ' + username);
        connection.trigger('updateActivity', payload);
    }

    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

});







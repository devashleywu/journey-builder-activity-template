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
            "label": "Define User Tag",
            "key": "step1"
        },
        {
            "label": "Summary",
            "key": "step2"
        }
    ];
    var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    // connection.on('requestedTokens', onGetTokens);
    // connection.on('requestedEndpoints', onGetEndpoints);

    // connection.on('clickedNext', save);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('updateSteps', steps);
        // connection.trigger('requestTokens');
        // connection.trigger('requestEndpoints');
        $('#userTag').change(function() {
			var userTag = $('#userTag').val();
			connection.trigger('updateButton', {
				button: 'next',
				enabled: Boolean(userTag)
			});

			$('#userTag_display').html(userTag);
		});

		$('#description').change(function() {
			var description = $('#description').val();

			$('#description_display').html(description);
        });
        
        console.log('user tag render' + userTag);
        console.log('desc tag render' + description);

    }

    function initialize(data) {
        var userTag, description;
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

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                if (key === 'userTag') {
                    userTag = val;
                }
                if (key === 'description') {
                    description = val;
                }
            });
        });

        console.log('user tag init' + userTag);
        console.log('desc tag init' + description);

        // If there is no tag input, disable the next button
        if (!userTag) {
            showStep(null, 1);
            connection.trigger('updateButton', {
                button: 'next',
                enabled: false
            });
            // If there is a message, skip to the summary step
        } else {
            showStep(null, 2);
            console.log(userTag);
			$('#userTag').val(userTag);
            $('#description').val(description);
            $('#userTag_display').html(userTag);
			$('#description_display').html(description);
        }

        // DEBUG
        // console.log('hasInArguments ' + hasInArguments);
        // console.log('inArguments' + inArguments);

        // connection.trigger('updateButton', {
        //     button: 'next',
        //     text: 'done',
        //     visible: true
        // });
    }

    // function onGetTokens(tokens) {
    //     // DEBUG
    //     console.log('token ' + tokens);
    //     authTokens = tokens;
    // }

    // function onGetEndpoints(endpoints) {
    //     // DEBUG
    //     console.log('endpoints ' + endpoints);
    // }

    function onClickedNext() {
        if (currentStep.key === 'step2') {
            save();
        } else {
            connection.trigger('nextStep');
        }
    }

    function onClickedBack() {
        connection.trigger('prevStep');
    }

    function onGotoStep(step) {
        showStep(step);
        connection.trigger('ready');
    }

    function showStep(step, stepIndex) {
        if (stepIndex && !step) {
            step = steps[stepIndex - 1];
        }

        currentStep = step;

        $('.step').hide();

        switch (currentStep.key) {
            case 'step1':
                $('#step1').show();
                $('#step1 input#userTag').focus();
                break;
            case 'step2':
                $('#step2').show();
                break;
        }
    }

    function save() {
        var userTag = $('#userTag').val();
        var description = $('#description').val();

        payload['arguments'].execute.inArguments = [{
            // "tokens": authTokens,
            userTag: userTag,
            description: description,
            clientId: '{{Contact.Attribute.SFMC_Clients.ClientID}}',
            contactKey: '{{Contact.Key}}',
        }];

        payload['metaData'].isConfigured = true;

        // DEBUG
        // console.log('payload ' + payload);
        // console.log('payload metadata ' + payload['metaData'].isConfigured);
        connection.trigger('updateActivity', payload);
        console.log('user tag save ' + userTag);
        console.log('desc tag save' + description);
    }

    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

});
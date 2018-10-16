define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }

    function initialize(data) {
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

        $.each(inArguments, function(index, inArgument) {
            $.each(inArgument, function(key, val) {
                if (key === 'emailAddress') {
                    emailAddress = val;
                }
            });
        });

        console.log('hasInArguments ' + hasInArguments);
        console.log('inArguments' + inArguments);
        console.log('inArguments details ' + payload['arguments'].execute.inArguments[0].emailAddress);

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log('token ' + tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log('endpoints ' + endpoints);
    }

    function save() {
        // var postcardURLValue = $('#postcard-url').val();
        // var postcardTextValue = $('#postcard-text').val();
        var username = $('#username').val();

        $.each(payload['arguments'].execute.inArguments, function(index, inArgument) {
            $.each(inArgument, function(key, val) {
                if (key === 'emailAddress') {
                    emailAddress = val;
                }
                if (key === 'tokens') {
                    tokens = authTokens;
                }
                if (key === 'username') {
                    username = username;
                } 
            });
        });

        // payload['arguments'].execute.inArguments = [{
        //     "tokens": authTokens,
        //     "emailAddress" : emailAddress,
        //     "username": username
        // }];
        
        payload['metaData'].isConfigured = true;

        console.log('payload ' + payload);
        console.log('payload metadata ' + payload['metaData'].isConfigured);
        console.log('username ' + username);
        
        connection.trigger('updateActivity', payload);
    }
});







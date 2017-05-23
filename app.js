var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId:'f8cb1502-538e-4159-813e-5b5b9e84e1ce',
    appPassword:'QFMJKqZYOpFsAt2u2vYYSNc'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
	if(session.message.text=="Hi"){
    		session.send("You said: %s", session.message.text);
	}else{
		session.send("You said: %s", "I am not getting your question");
	}
});
var restify = require('restify');
var builder = require('botbuilder');

var google = require('google')

google.resultsPerPage = 1
var nextCounter = 0

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId:'020a1c9a-699e-4729-882b-1ba7c45de728',
    appPassword:'EzcgTCsBwsVY84p9JP9WHdm'
    appPassword:'EzcgTCsBwsVY84p9JP9WHdm'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
	if(session.message.text=="Hi"){
    		session.send("%s, How can I help you?", session.message.text);
	}else{
		
		 google(session.message.text, function (err, res){
			if (err) console.error(err)
 
			  for (var i = 0; i < res.links.length; ++i) {
				var link = res.links[i];
				session.send(link.title + ' - ' + link.href);
				session.send(link.description + "\n");
				}
 
			  if (nextCounter < 4) {
				nextCounter += 1
				if (res.next) res.next()
				}
		})
	}
	
});
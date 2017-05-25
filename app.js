var restify = require('restify');
var builder = require('botbuilder');

var google = require('google')

google.resultsPerPage = 5
var nextCounter = 0

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
    		session.send("%s, How can I help you?", session.message.text);
	}else{
		
		 google(session.message.text, function (err, res){
			if (err) console.error(err)
 
			  for (var i = 0; i < res.links.length; ++i) {
				var link = res.links[i];
				session.send(link.title + ' - ' + link.href);
				session.send(link.description + "\n");
				//console.log(link.title + ' - ' + link.href)
				//console.log(link.description + "\n")
				}
 
			  if (nextCounter < 4) {
				nextCounter += 1
				if (res.next) res.next()
				}
		})
	}
	
});
var util = require('util');
var _ = require('lodash');
var restify = require('restify');
var builder = require('botbuilder');

var SearchLibrary = require('./SearchDialogLibrary');
var AzureSearch = require('./SearchProviders/azure-search');



// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId:'020a1c9a-699e-4729-882b-1ba7c45de728',
    appPassword:'EzcgTCsBwsVY84p9JP9WHdm'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
 var bot = new builder.UniversalBot(connector, function (session) {
	if(session.message.text=="Hi"){
    		session.send("%s, How can I help you?", session.message.text);
	}else{			
					// Trigger Azure Search dialogs 
					SearchLibrary.begin(session);

					// Process selected search results
					session.send(
						'Search Completed!',
						args.selection.map(  )); // format your response 

	}
	
}); 
/*
var bot = new builder.UniversalBot(connector, [
    function (session) {
        // Trigger Search
        SearchLibrary.begin(session);
    },
    function (session, args) {
        // Process selected search results
        session.send(
            'Done!' );
    }
]); */

// Azure Search
// C28941E335F310FE3A1C5360394EFCC8
var azureSearchClient = AzureSearch.create('mysearchclick101', 'C28941E335F310FE3A1C5360394EFCC8', 'temp');
var ResultsMapper = SearchLibrary.defaultResultsMapper(ToSearchHit);

			bot.library(SearchLibrary.create({
				multipleSelection: true,
				search: function (query) { return azureSearchClient.search(query).then(ResultsMapper); },
				refiners: ['refiner1', 'refiner2', 'refiner3'], // customize your own refiners 
				refineFormatter: function (refiners) {
					return _.zipObject(
						refiners.map(function (r) { return 'By ' + _.capitalize(r); }),
						refiners);
				}
			}));
			function ToSearchHit(azureResponse) {
				return {
					// define your own parameters 
					key: azureResponse.Incident,
					title: azureResponse.Description,
					Description: azureResponse.Solution,
					
				};
			}	
var csv = require('csv');
var mongoose = require('mongoose');
var querystring = require('querystring');

var bubbleNames = [];
var bubbleTypes = [];
var members = [];
var admins = [];

csv()
.from('bubbler.csv', {columns: true, delimiter: '\t'})
.on('record', function(row,index){
	var tmp = []
	if(row.BubbleName != "")
	{
		if(bubbleNames.indexOf(row.BubbleName) < 0)
		{
			bubbleNames.push(row.BubbleName);
			bubbleTypes.push(row.BubbleType);
			members[bubbleNames.indexOf(row.BubbleName)] = [];
			admins[bubbleNames.indexOf(row.BubbleName)] = [];
		}
	}
	if(row.Members != null)
	{
		members[bubbleNames.indexOf(row.BubbleName)].push(row.Members);
	}
	if(row.Admins != null)
	{
		admins[bubbleNames.indexOf(row.BubbleName)].push(row.Admins);
	}
})
.on('end', function(count){
	console.log(bubbleNames);
	console.log(bubbleTypes);
	console.log(members);
	console.log(admins);

	for(i in bubbleNames)
	{

	};
})
.on('error', function(error){
	console.log("ERROR: " + error.message);
});
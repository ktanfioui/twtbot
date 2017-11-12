console.log("The bot is starting");


/////////Dependencies
//////twitter part
var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);

var stream = Twitter.stream('user');

///////watson part
var watson = require('watson-developer-cloud');
var conversation = watson.conversation({
  username: 'c354a427-d3eb-4d66-b150-e2874db326a7',
  password: 'fu1q1SVbdJhf',
  version: 'v1',
  version_date: '2017-05-26'
});


// FOLLOW-Reply BOT ===========================

// when someone follows
stream.on('tweet', tweetEvent);

// ...trigger the callback
function tweetEvent(eventMsg) {
  console.log('Tweet Event is running');
  //get their twitter handler (screen name)
  var replyto = eventMsg.in_reply_to_screen_name;
  var text = eventMsg.text;
  var from  = eventMsg.user.screen_name;
  var nameID = eventMsg.id_str;
  
  console.log(replyto, from,  text,  nameID);
    watsonResponse(text, function(answer){
		//console.log(answer);
		 if (replyto === 'tstbtkt') {
	var newtweet = '@' + from + ' ' + answer;  
	tweetIt(newtweet, nameID);
  }
	});
  
 
  
}

function watsonResponse(data, callback){
	
	conversation.message({
	  workspace_id: '77c03070-d659-4153-a2d5-22b8db2f8c89',
	  input: {'text': data}
		},  function(err, response) {
		  
			finalData = response.output.text[0];
			return callback(finalData);
		
		  
		});
		
}


function tweetIt(txt, nameide) {
	var tweet = {
		status: txt,
		in_reply_to_status_id: nameide
	}
	
	Twitter.post('statuses/update', tweet, tweeted);
	console.log("done");
	function tweeted(err, data, response) {
		if(err) {
			console.log("Something went wrong :/");
		} else {
			console.log("You did it girl :D");
		}
	}
}


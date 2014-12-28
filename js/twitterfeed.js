// JQuery Twitter Feed. Coded by Tom Elliott (Web Dev Door) www.webdevdoor.com (2013)
//UPDATED TO AUTHENTICATE TO API 1.1
(function($) {	
	$(document).ready(function () {
		var displaylimit = 15;
		var showretweets = false;
		var showtweetlinks = true;
		var autorefresh = true;
		var showtweetactions = false;
		var showretweetindicator = true;
		var refreshinterval = 30000; //Time to autorefresh tweets in milliseconds. 60000 milliseconds = 1 minute
		var refreshtimer;
		
		var headerHTML = '';
		var loadingHTML = '';
		headerHTML += '';
		loadingHTML += '<div id="loading-container" class="list-group-item text-center"><img id="imgloader" src="images/ajax-loader.gif" style="width:32px;opacity:0.5;vertical-align:middle;-webkit-border-radius:40px;border-radius: 40px;">&nbsp;Loading...</div>';
		
		$('#twitter-feed').html(headerHTML + loadingHTML);
		 
		 if (autorefresh == true) {
			refreshtimer = setInterval(gettwitterjson, refreshinterval); 
		 }	
		 
		 gettwitterjson();
		 $("#refreshfeed").on("click", function(event) {
			event.preventDefault();
			$('#twitter-feed').html(loadingHTML);
			gettwitterjson();
			});
		 
		function gettwitterjson() { 
			$.getJSON('http://gcccs.org/ccsweek/get-tweets1.1.php', 
				function(feeds) {   
				   feeds = feeds.statuses; //search returns an array of statuses
					//alert(feeds);   
					var feedHTML = '';
					var displayCounter = 1;  
					for (var i=0; i<feeds.length; i++) {
						var tweetscreenname = feeds[i].user.name;
						var tweetusername = feeds[i].user.screen_name;
						var profileimage = feeds[i].user.profile_image_url_https;
						var status = feeds[i].text; 
						var isaretweet = false;
						var isdirect = false;
						var tweetid = feeds[i].id_str;
						
						//If the tweet has been retweeted, get the profile pic of the tweeter
						if(typeof feeds[i].retweeted_status != 'undefined'){
						   profileimage = feeds[i].retweeted_status.user.profile_image_url_https;
						   tweetscreenname = feeds[i].retweeted_status.user.name;
						   tweetusername = feeds[i].retweeted_status.user.screen_name;
						   tweetid = feeds[i].retweeted_status.id_str
						   isaretweet = true;
						 };
						 
						 if (((showretweets == true) || ((isaretweet == false) && (showretweets == false)))) { 
							if ((feeds[i].text.length > 1) && (displayCounter <= displaylimit)) {             
								if (showtweetlinks == true) {
									status = addlinks(status);
								}
								 
								if (displayCounter == 1) {
									feedHTML += headerHTML;
								}
											 
								feedHTML += '<div class="list-group-item" id="tw'+displayCounter+'" style="padding:5px"><div class="media">';                  
								feedHTML += '<div class="media-left"><img src="'+profileimage+'"images/twitter-feed-icon.png" class="img-rounded" style="width:42px"></div>';
								feedHTML += '<div class="media-body" style="width:100%"><span class="pull-right">'+relative_time(feeds[i].created_at)+'</span><b>'+tweetscreenname+'</b>&nbsp;<i>@'+tweetusername+'</i><br>'+status+'<div class="clearfix"></div></div>';
								if ((isaretweet == true) && (showretweetindicator == true)) {
									feedHTML += '<div id="retweet-indicator"></div>';
								}
								feedHTML += '</div></div>';
								displayCounter++;
							}   
						 }
					}
					 if (displayCounter == 1)
						 {
						 feedHTML +='<span class="list-group-item text-center"><small>Twitter Feeds are unavailable at this moment.</small></span>';
						 }
					$('#twitter-feed').html(feedHTML);
			});
		}
			 
		//Function modified from Stack Overflow
		function addlinks(data) {
			//Add link to all http:// links within tweets
			data = data.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
				return '<a href="'+url+'"  target="_blank">'+url+'</a>';
			});
				 
			//Add link to @usernames used within tweets
			data = data.replace(/\B@([_a-z0-9]+)/ig, function(reply) {
				return '<a href="http://twitter.com/'+reply.substring(1)+'" style="font-weight:lighter;" >'+reply.charAt(0)+reply.substring(1)+'</a>';
			});
			return data;
		}
		 
		 
		function relative_time(time_value) {
		  var values = time_value.split(" ");
		  time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
		  var parsed_date = Date.parse(time_value);
		  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
		  var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
		  var shortdate = time_value.substr(4,2) + " " + time_value.substr(0,3);
		  delta = delta + (relative_to.getTimezoneOffset() * 60);
		 
		  if (delta < 60) {
			return '1m';
		  } else if(delta < 120) {
			return '1m';
		  } else if(delta < (60*60)) {
			return (parseInt(delta / 60)).toString() + 'm';
		  } else if(delta < (120*60)) {
			return '1h';
		  } else if(delta < (24*60*60)) {
			return (parseInt(delta / 3600)).toString() + 'h';
		  } else if(delta < (48*60*60)) {
			//return '1 day';
			return shortdate;
		  } else {
			return shortdate;
		  }
		}
	});
})(jQuery);
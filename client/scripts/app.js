$(document).ready(function(){
  var textSet = function(messageObj) {
    for (var i = 0; i < 11; i++) {
      for (var j = 0; j < messageObj[i].text.length; j++){
        if (messageObj[i].text[j] == '<') {
          alert("Everyone's equal here");
          i++;

        }
      }
      $('#chat').append("<div class='message'>" + messageObj[i].username + ": " + messageObj[i].text + "</div>");
    }
  };
  var getRequest = {
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
	  type: 'GET',
	  success: function (data) { 
      textSet(data.results);
      console.log(data);
	  },
	  error: function (data){
		  console.log("error occurred");
	  },
  };

  var postRequest = {
  	url: 'https://api.parse.com/1/classes/chatterbox',
  	type: 'POST',
  	contentType: 'application/json',
  	success: function (data) {
  		console.log('chatterbox: Message sent');
  		console.log(data);
  	},
  	error: function (data) {
  		console.log(data);
  		console.error('chatterbox: Failed to send message');
  	}
  };

$('#refreshButton').on('click', function (event) {
	$.ajax(getRequest);
  //Escaping

	//TODO
});

$('#sendButton').click(function (event) {
	var input = $('#inputBox').val()
	var messageObj = {
		roomname: "nothing",
		username: "nobody",
		text: input
	};

	if (input) {

	  postRequest.data = JSON.stringify(messageObj);
	  console.log(postRequest.data);
    $('#inputBox').val('');
	  $.ajax(postRequest);
	//TODO
  }

});

});
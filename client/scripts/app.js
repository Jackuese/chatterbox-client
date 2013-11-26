$(document).ready(function(){
  // Set username and room
  var userName;
  var roomName = "lobby";
  var roomOptions = {};

  var setUser = function(){
    userName = escapeHTML(prompt("What's your name, user?"));
  };

  // var setRoom = function(){
  //   roomName = prompt("Choose a room");
  //   if (roomName == "") {
  //     roomName = "Default";
  //   }
  // };
// Escaping function, apply during appending any text
  var escapeHTML = function (text) {
    var replacements = {"<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"};
    if (text){
      return text.replace(/[<>"']/g, function (character) {
        return replacements[character];
      });
    }
  };

  var textSet = function(messageObj) {
    for (var i = 0; i < 11; i++) {
      if (roomName && messageObj[i]){
        if (messageObj[i].text == undefined || messageObj[i].text == ""){
          messageObj[i].text = "I'm too dumb to write anything";
        }
        if (messageObj[i].text.length < 150){
          $('#chat').prepend("<div class='message'>" + escapeHTML(messageObj[i].username) + ": " + escapeHTML(messageObj[i].text) + "</div>");
        }
      }
    }
  };
  
  // GET and POST object formation
  var getRequest = {
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
	  type: 'GET',
	  success: function (data) {
      var messageList;
      if (roomName !== 'lobby'){
        messageList = $.grep(data.results, function (element, index){
          return element.roomname === roomName;
        })
      } else {
        messageList = data.results;
      }
    textSet(messageList);
    console.log(data);
	  },
	  error: function (data){
		  console.log("error occurred");
	  }
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

  var getRoomsRequest = {
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
    type: 'GET',
    success: function (data) {
      console.log(data);
      for (var a = 0; a < data.results.length; a++){
        var room = data.results[a].roomname;
        if (room) {
          roomOptions[room] = room;
        }
      }
      console.log(roomOptions);
    },
    error: function (data) {
      console.log("error occurred");
    }
  };

// Click Handlers
$('#refreshRoomsButton').on('click', function (event) {
  $.ajax(getRoomsRequest);
  var myRoom = $('#roomlist');
  $.each(Object.keys(roomOptions), function(val, text) {
    myRoom.append($('<option></option>').val(val).html(escapeHTML(text)));
  });
});

$('#roomlist').change(function (event){
  var selected = $(this).find('option:selected');
  roomName = selected.text();
  $('#room').text("Room: " + roomName);
});

$('#refreshButton').on('click', function (event) {
	$.ajax(getRequest);
	//TODO
});

// document.getElementsByClassName('message')
  
// });

$('#sendButton').click(function (event) {
	var input = $('#inputBox').val()
	var messageObj = {
		roomname: roomName,
		username: userName,
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
  setUser();
});
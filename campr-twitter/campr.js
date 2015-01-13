Array.prototype.removeAll = function () {
    this.splice(0);
}

Array.prototype.remove = function (i) {
    this.splice(i, 1);
}

// Object for the App
var cr = {};

//-----------------------------------------CHAT/TWEET ARRAY-----------------------------------//
cr.chatArray = [];
cr.friendChatArray = [];
cr.masterChatArray = [];
cr.profileArray = [];
cr.friendArray = [];
cr.friendProfile = [];

//-----------------------------------------URL CONSTRUCTOR--------------------------------------//
cr.firebaseLocation = function (url, folder, verb, id) {
    if(folder != null) {
        if (verb == 'GET' || verb == 'POST') {
            return url + folder + "/.json";
        } else {
            return url + folder + "/" + id + ".json";
        }
    } else {
        return url + ".json";
    }
}

//-----------------------------------------MASTER AJAX--------------------------------------//
cr.ajaxCmd = function (verb, url, data, success, error) {
    var request = new XMLHttpRequest();
    request.open(verb, url);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400 && typeof success == "function") {
            success(JSON.parse(this.response));
        }
        else {
            error("Error on " + verb + " : " + this.response);
        }
    }
    request.onerror = function () {
        error("Server error on " + verb);
    }
    request.send(JSON.stringify(data));
}

//-----------------------------------------GET FUNCTIONS---------------------------------------------//
//GET chat history(data) from firebase
cr.getTweet = function () {
    var firebaseLocation = cr.firebaseLocation("https://campr-docodo19.firebaseio.com/", "tweets", "GET", null);
    cr.ajaxCmd('GET', firebaseLocation, null, cr.displayTweet, alert);
}



//////////////////////////////////////////////////// MASTER CHAT FUNCTIONS ///////////////////////////////////////////////

cr.masterTweetRun = function () {
    cr.masterChatArray.removeAll();
    document.getElementById('masterTweet').innerHTML = "";
    cr.getMasterTweet();
}
cr.sortMasterChatArray = function () {
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < cr.masterChatArray.length - 1; i++) {
            if (cr.masterChatArray[i].timestamp > cr.masterChatArray[i + 1].timestamp) {
                var temp = cr.masterChatArray[i];
                cr.masterChatArray[i] = cr.masterChatArray[i + 1];
                cr.masterChatArray[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}
cr.getMasterTweet = function() {
    for(var i = 0; i < cr.friendArray.length; i++){
        var firebaseLocation = cr.firebaseLocation(cr.friendArray[i].url, "tweets", "GET", null);
        cr.ajaxCmd('GET', firebaseLocation, null, cr.displayMasterTweet, alert);
    }
}
cr.displayMasterTweet = function (data) {
    var masterChatDisplay = document.getElementById('masterTweet');
    var h = "";
    var textData = data;
    for (var i in textData) {
        textData[i].id = i;
        cr.masterChatArray.push(textData[i]);
    }
    cr.sortMasterChatArray();
    for (var i = cr.masterChatArray.length; i > 0; i--) {
        h += cr.masterChatArray[i - 1].timestamp + "- " + cr.masterChatArray[i - 1].username + ": " + cr.masterChatArray[i - 1].message + "</br>";
    }
    document.getElementById("masterTweet").innerHTML = h;
}








//GET friend chat history(data) from friend's firebase///////////////////////////////WIP
cr.getFriendTweet = function (url) {
    var firebaseLocation = cr.firebaseLocation(url, "tweets", "GET", null);
    cr.ajaxCmd('GET', firebaseLocation, null, cr.displayFriendTweet, alert);
    //alert(firebaseLocation);
}

//GET Campr member's profile(data) from central firebase
cr.getProfile = function () {
    var firebaseLocation = cr.firebaseLocation("https://campr.firebaseio.com/", null, "GET", null);
    cr.ajaxCmd('GET', firebaseLocation, null, cr.displayProfile, alert);
}

cr.getFriendList = function () {
    //$('#myModal').modal(show);
    var firebaseLocation = cr.firebaseLocation("https://campr-docodo19.firebaseio.com/", "friends", "GET", null);
    cr.ajaxCmd('GET', firebaseLocation, null, cr.displayFriendList, alert);
}

cr.getFriendProfile = function (i) {
    document.getElementById("friendProfile").innerHTML = "";
    var friendUrl = cr.friendArray[i].url;
    var firebaseLocation = cr.firebaseLocation(friendUrl, "profile", "GET", null);
    cr.ajaxCmd("GET", firebaseLocation, null, cr.displayFriendProfile, alert);
}

cr.removeFriend = function (r) {
    var friendUrl = "https://campr-docodo19.firebaseio.com/";
    var friendId = cr.friendArray[r].id ;
    var firebaseLocation = cr.firebaseLocation(friendUrl, "friends", "DELETE", friendId);
    //cr.ajaxCmd("DELETE", cr.firebaseLocation, null, null, null);
    var request = new XMLHttpRequest();
    request.open('DELETE', firebaseLocation, true);
    request.send();
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // re-display list
            cr.getFriendList();
        } else {
            alert("something went wrong");
        }
    }

}


//-----------------------------------------DISPLAY FUNCTIONS----------------------------------//
//Display Tweets
cr.displayTweet = function (data) {
    var chatDisplay = document.getElementById("chatDisplay");
    var h = "";
    var textData = data;
    cr.chatArray.removeAll();
    for (var i in textData) {
        textData[i].id = i;
        cr.chatArray.push(textData[i]);
    }
    //for (i = 0; i < cr.chatArray.length; i++) {
    //    h += cr.chatArray[i].userName + ": " + cr.chatArray[i].textArea + "</br>";
    //}
    for (var i = cr.chatArray.length; i > 0; i--) {
        h += cr.chatArray[i - 1].timestamp + "- " + cr.chatArray[i - 1].username + ": " + cr.chatArray[i - 1].message + "</br>";
    }
    document.getElementById("chatDisplay").innerHTML = h;
}



cr.displayFriendTweet = function (data) {
    var chatDisplay = document.getElementById("friendChatDisplay");
    var h = "";
    var textData = data;
    cr.friendChatArray.removeAll();
    for (var i in textData) {
        textData[i].id = i;
        cr.friendChatArray.push(textData[i]);
    }
    for (var i = cr.friendChatArray.length; i > 0; i--) {
        h += cr.friendChatArray[i - 1].timestamp + "- " + cr.friendChatArray[i - 1].username + ": " + cr.friendChatArray[i - 1].message + "</br>";
    }
    chatDisplay.innerHTML = h;
}

//Display Profiles
cr.displayProfile = function (data) {  
    var profileDisplay = document.getElementById("profileDisplay");
    var h = "";
    var profileData = data;
    cr.profileArray.removeAll();
    for (var i in profileData) {
        profileData[i].id = i;
        cr.profileArray.push(profileData[i]);
    }
    for (var i = 0; i < cr.profileArray.length; i++) {
        h += "<button onclick='cr.addFriend(" + i + ")'><span class='glyphicon glyphicon-plus'></span></button> ";
        h += cr.profileArray[i].name + "</br>";
   
    }
    profileDisplay.innerHTML = h;
}

// Display friends list
cr.displayFriendList = function (data) {
    var friendsDisplay = document.getElementById("friendsDisplay");
    var h = "";
    var temp = data;
    cr.friendArray.removeAll();
    for (var i in temp) {
        temp[i].id = i;
        cr.friendArray.push(temp[i]);
    }
    for (var i = 0; i < cr.friendArray.length; i++) {
        
        h += "<button onclick='cr.getFriendTweet(\"" + cr.friendArray[i].url + "\")'><span class='glyphicon glyphicon-th-list'></span></button>";
        h += "<button onclick='cr.getFriendProfile(" + i + ")'><span class='glyphicon glyphicon-user'></span></button>";
        h += "<button onclick='cr.removeFriend(" + i + ")'><span class='glyphicon glyphicon-minus'></span></button>";
        h += "&nbsp;" + cr.friendArray[i].name + "</br>";
    }
    friendsDisplay.innerHTML = h;
}

cr.displayFriendProfile = function (data) {
    var h = "";
    cr.friendProfile.removeAll();
    for (var i in data) {
        cr.friendProfile.push(data[i]);
    }
    h += "<img src=\"" + cr.friendProfile[0].picture + "\" style=\"width:100px; height:100px\"></br>";
    h += cr.friendProfile[0].name + "</br>";
    h += cr.friendProfile[0].username + "</br>";
    h += cr.friendProfile[0].url + "</br>";
    h += cr.friendProfile[0].email + "</br>";
    h += cr.friendProfile[0].bio;
    document.getElementById("friendProfile").innerHTML = h;
}

//-----------------------------------------SEND functions-------------------------------------------//
// Send Tweet to firebase/tweet
cr.sendTweet = function () {
    var firebaseLocation = cr.firebaseLocation("https://campr-docodo19.firebaseio.com/", "tweets", "POST", null);
    var userNameId = document.getElementById("userName");
    var textAreaId = document.getElementById("textArea");
    var timeStamp = new Date().toLocaleString();
    var myMsg = {
        //userName: userNameId.value, //use userName for SCHEMA
        username: "docodo19",
        message: textAreaId.value, //use textArea for SCHEMA
        timestamp: timeStamp,       //use timeStamp for SCHEMA
    }
    cr.ajaxCmd("POST", firebaseLocation, myMsg, null, null);
    cr.getTweet();
    textAreaId.value = "";
}

//--------------------------------------ADD (PROFILE, FRIENDS) FUNCTION  --------------------------------//
// Send profile to firebase/profile and codercamps firebase
cr.sendProfile = function () {
    var firebaseLocation = cr.firebaseLocation("https://campr.firebaseio.com/", null, "POST", null);
    var profileUsername = document.getElementById("profileUsername");
    var profileNameId = document.getElementById("profileName");
    var profilePictureId = document.getElementById("profilePicture");
    var profileURLId = document.getElementById("profileURL");
    var profileEmailId = document.getElementById("profileEmail");
    var profileBioId = document.getElementById("profileBio");
    var myProfile = {
        name: profileNameId.value,
        url: profileURLId.value
    }
    cr.ajaxCmd("POST", firebaseLocation, myProfile, null, null);
    firebaseLocation = cr.firebaseLocation("https://campr-docodo19.firebaseio.com/", "profile","POST",null);
    myProfile = {
        username: profileUsername.value,
        name: profileNameId.value,
        picture: profilePictureId.value,
        url: profileURLId.value,
        email: profileEmail.value,
        bio: profileBioId.value
    }
    cr.ajaxCmd("POST", firebaseLocation, myProfile, null, null);
}

cr.addFriend = function (i) {
    var friend = cr.profileArray[i];
    var firebaseLocation = cr.firebaseLocation("https://campr-docodo19.firebaseio.com/", "friends", "POST", null);
    cr.ajaxCmd('POST', firebaseLocation, friend, null, null);
    cr.getFriendList();
}

//------------------------------------------------------------------Execute for First Time--------------------------
cr.getFriendList();
cr.getProfile();
cr.getTweet();

cr.masterTweetRun();

setInterval(function () { cr.getFriendList() }, 2000);
setInterval(function () { cr.masterTweetRun() }, 10000);
setInterval(function () { cr.getTweet() }, 2000);



//cr.timeConverter = function (data) {
//    var d = new Date(time);
//    var month = d.getMonth(data) + 1;
//    var day = d.getDate(data);
//    var year = d.getFullYear(data);
//    var hour = d.getHours(data);
//    var minute = d.getMinutes();

//}








//d = new Date(app.chirps[i].timestamp);
//var month = d.getMonth(app.chirps[i].timestamp) + 1; // returns index, so add 1
//var day = d.getDate(app.chirps[i].timestamp);
//var year = d.getFullYear(app.chirps[i].timestamp);
//var hour = d.getHours(app.chirps[i].timestamp);
//var minute = d.getMinutes(app.chirps[i].timestamp);
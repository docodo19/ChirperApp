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
cr.profileArray = [];
cr.friendArray = [];
cr.friendProfile = [];
cr.friendChatArray = [];
//-----------------------------------------URL CONSTRUCTOR--------------------------------------//
cr.firebaseLocation = function (url, folder, verb, id) {
    if (folder != null) {
        if (verb == 'GET' || verb == 'POST') {
            return url + folder + "/.json";
        } else {
            return url + folder + "/" + id + ".json"
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
        if (this.status >= 200 && this.status < 400) {
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

//GET friend chat history(data) from friend's firebase
cr.getFriendTweet = function (url) {
    var firebaseLocation = cr.firebaseLocation(url, "tweets", "GET", null);
    cr.ajaxCmd('GET', firebaseLocation, null, cr.displayFriendTweet, alert);
}

//GET Campr member's profile(data) from central firebase
cr.getProfile = function () {
    var firebaseLocation = cr.firebaseLocation("https://campr.firebaseio.com/", null, "GET", null);
    cr.ajaxCmd('GET', firebaseLocation, null, cr.displayProfile, alert);
}

cr.getFriendList = function () {
    var firebaseLocation = cr.firebaseLocation("https://campr-docodo19.firebaseio.com/", "friends", "GET", null);
    cr.ajaxCmd('GET', firebaseLocation, null, cr.displayFriendList, alert);
}

cr.getFriendProfile = function (i) {
    document.getElementById("friendProfile").innerHTML = "";
    var friendUrl = cr.friendArray[i].url;
    var firebaseLocation = cr.firebaseLocation(friendUrl, "profile", "GET", null);
    cr.ajaxCmd("GET", firebaseLocation, null, cr.displayFriendProfile, alert);
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
        h += cr.chatArray[i - 1].timeStamp + "- " + cr.chatArray[i - 1].userName + ": " + cr.chatArray[i - 1].textArea + "</br>";
    }
    document.getElementById("chatDisplay").innerHTML = h;
}

//Display Profiles
cr.displayProfile = function (data) {   ///////////////////////////////////////////working on this/////////////
    var profileDisplay = document.getElementById("profileDisplay");
    var h = "";
    var profileData = data;
    cr.profileArray.removeAll();
    for (var i in profileData) {
        profileData[i].id = i;
        cr.profileArray.push(profileData[i]);
    }
    for (var i = 0; i < cr.profileArray.length; i++) {
        h += cr.profileArray[i].name + "</br>";
        h += "<button onclick='cr.addFriend(" + i + ")'><span class='glyphicon glyphicon-user'></span></button>";
        h += "<button onclick='cr.addFriend(" + i + ")'><span class='glyphicon glyphicon-plus'></span></button></br>";

    }
    profileDisplay.innerHTML = h;
}

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
        h += cr.friendArray[i].name + "</br>";
        h += "<button onclick='cr.getFriendProfile(" + i + ")'><span class='glyphicon glyphicon-user'></span></button>";
        h += "<button onclick='cr.removeFriend(" + i + ")'><span class='glyphicon glyphicon-minus'></span></button></br>";
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
        userName: "Dan Do",
        textArea: textAreaId.value, //use textArea for SCHEMA
        timeStamp: timeStamp,       //use timeStamp for SCHEMA
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
    firebaseLocation = cr.firebaseLocation("https://campr-docodo19.firebaseio.com/", "profile", "POST", null);
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

setInterval(function () { cr.getTweet() }, 2000);







// Test to see if URL constructor is working
//var myUrl = "https://campr.firebaseio.com/";
//var test = cr.firebaseLocation(myUrl, "profile", 'DELETE', "-AKDJFLAJ");
//console.log(test);






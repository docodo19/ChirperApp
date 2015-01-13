Array.prototype.removeAll = function () {
    this.splice(0);
}

var chatApp = {};

//Chat text Array
chatApp.chatArray = [];
//firebase location
chatApp.firebaseLocation = "https://codercamps-chatapp.firebaseio.com/";

//Master AJAX
chatApp.ajaxCmd = function (verb, url, data, success, error) {
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

chatApp.display = function (data) {
    var chatDisplay = document.getElementById("chatDisplay");
    var h = "";
    var textData = data;

    chatApp.chatArray.removeAll();

    for (var i in textData) {
        textData[i].id = i;
        chatApp.chatArray.push(textData[i]);
    }
    //for (i = 0; i < chatApp.chatArray.length; i++) {
    //    h += chatApp.chatArray[i].userName + ": " + chatApp.chatArray[i].textArea + "</br>";
    //}
    for (var i = chatApp.chatArray.length; i > 0; i--) {
        h += chatApp.chatArray[i - 1].timeStamp + "- " + chatApp.chatArray[i - 1].userName + ": " + chatApp.chatArray[i - 1].textArea + "</br>";
    }
    document.getElementById("chatDisplay").innerHTML = h;
}

//get chat history(data) from firebase
chatApp.getChat = function () {
    chatApp.ajaxCmd('GET', chatApp.firebaseLocation + ".json", null, chatApp.display, alert);
}

// chat text POST
chatApp.send = function () {
    var userNameId = document.getElementById("userName");
    var textAreaId = document.getElementById("textArea");
    var timeStamp = new Date().toLocaleString();
    var myMsg = {
        userName: userNameId.value, //use userName for SCHEMA
        textArea: textAreaId.value, //use textArea for SCHEMA
        timeStamp: timeStamp,       //use timeStamp for SCHEMA
    }
    chatApp.ajaxCmd("POST", chatApp.firebaseLocation + ".json", myMsg, null, null);
    chatApp.getChat();
    textAreaId.value = "";
}

chatApp.getNameColor = function () {
    return $('.getNameColor option:selected').val();
}

chatApp.bubbleSort = function (a) {
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < a.length - 1; i++) {
            if (a[i].timeStamp > i[i - 1].timeStamp) {
                var temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}

setInterval(function () { chatApp.getChat() }, 1000);




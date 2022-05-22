"use strict";
var chats = {
    privateMessagingSwitch: false,
    groupMessagingSwitch: false,
    activeConversationID: null,
    groupMessagingUsers: [],
    conversations: {},
    isNewToken: false,
    users: {},
    socket: null,
    createNewConverToggle: function () {
        if (document.getElementById("new-conversation-start").classList.contains("display-none")) {
            document.getElementById("new-conversation-start").classList.remove("display-none");
            document.getElementById("new-conversation-start").classList.add("display-block");
        } else {
            document.getElementById("new-conversation-start").classList.remove("display-block");
            document.getElementById("new-conversation-start").classList.add("display-none");
        }
    },
    createConversationObj: function (convID, head, content, img, additionalClass = "") {
        let convObject = document.createElement("div");
        convObject.setAttribute("id", convID);
        convObject.setAttribute("class", "conversation" + additionalClass);
        let innerConvObj = document.createElement("div");
        let convImg = document.createElement("div");
        convImg.setAttribute("class", "conversation-img");
        convImg.style.background = "url(" + img + ")";
        let convMess = document.createElement("div");
        convMess.setAttribute("class", "conversation-message");
        let pHead = document.createElement("p");
        pHead.innerText = head;
        let pContent = document.createElement("p");
        pContent.innerText = content;
        convMess.appendChild(pHead);
        convMess.appendChild(pContent);
        innerConvObj.appendChild(convImg);
        innerConvObj.appendChild(convMess);
        convObject.appendChild(innerConvObj);
        document.getElementById("conversation-section").appendChild(convObject);
    },
    createBubbleObj : async function(userID,message){
        let bubbleObj = document.createElement("div");
        //bubbleObj.setAttribute("id", messID);
        bubbleObj.setAttribute("class", "message-area");
        let innerMessObj = document.createElement("div");
        
        const classInner = userID == localStorage.getItem("userID") ? "message-me" : "message-other";
        innerMessObj.setAttribute("class", classInner);

        //let convImg = document.createElement("div");
        //convImg.setAttribute("class", "conversation-img");
        //convImg.style.background = "url(" + img + ")";
        let messSender = document.createElement("div");
        messSender.setAttribute("class", "message-sender-info");
        
        let messTime = document.createElement("div");
        messTime.setAttribute("class", "message-time");
        let userData = await chats.getUser(userID);
        messSender.append(userData.Username);
        messTime.append(chats.formatTime(Date.now()));
         
        innerMessObj.appendChild(messSender);
        innerMessObj.append(message);
        innerMessObj.appendChild(messTime);
        bubbleObj.appendChild(innerMessObj);
        document.querySelector("div.conversation-area").appendChild(bubbleObj);
        //document.getElementById("conversation-area").appendChild(bubbleObj);   
    },
    formatTime : function(date){
        const dateTime = new Date(date);
        const hours = dateTime.getHours() > 9 ? dateTime.getHours().toString() : "0"+dateTime.getHours().toString();
        const minutes = dateTime.getMinutes() > 9 ? dateTime.getMinutes().toString() : "0"+dateTime.getMinutes().toString();
        return hours+":"+minutes;
    },
    searchUsers: async function (searchWord) {
        if (chats.privateMessagingSwitch || chats.groupMessagingSwitch) {
            let res = await core.xreq("POST", core.APIs().searchUsers, {
                "searchData": searchWord,
            });
            if (res.status) {
                document.getElementById("conversation-section").innerHTML = "";
                res.result.map(k => chats.createConversationObj(k._id, k.Username, k.Biography, k.Image, " search-object"));
            } else {
                core.showToUser(res);
            }
        } else {
            // conversation search
        }
    },
    searchUsersIntervalTrigger: function (searchWord) {
        console.log("trigger tetiklendi");
        chats.searchUsers(searchWord);
        clearInterval(chats.searchUsersInterval);
    },
    searchNewPrivate: function () {
        document.getElementById("conversation-section").innerHTML = "<div class=\"conversation-date\">Bir kullanıcı adı veya mail adresi arayabilirsiniz.</div>";
        chats.privateMessagingSwitch = true;
        document.querySelector("div.top-bar i.fa-arrow-left").classList.remove("display-none");
        document.querySelector("div.top-bar i.fa-search").classList.add("active");
    },
    searchNewGroup: function () {
        document.getElementById("conversation-section").innerHTML = "";
        chats.groupMessagingSwitch = true;
    },
    newPrivate: async function (userID) {
        let res = await core.xreq("POST", core.APIs().convCreate, {
            "Participants": [userID],
        });
        if (res.status) {
            if (Object.keys(chats.conversations).includes(res.result.data._id) == false) chats.conversations[res.result.data._id] = res.result.data;
            chats.showConversations(res.result.data._id);
            console.log(res.result.data._id);
            chats.socket.emit("join", res.result.data._id, (response) => {
                console.log(response.status); // ok
            });
            //chats.createConversationObj(res.result.data._id,res.);
        } else {
            core.showToUser({ status: true, message: res.result.message });
        }
        //check any conversation already in indexeddb with conversation._id from response
    },
    getUser : async function(userID){
        if (chats.users[userID]) {
            console.log(chats.users[userID]);
            return chats.users[userID];
        } else {
            let res = await core.xreq("POST", core.APIs().userGet, {
                "UserID": userID,
            });
            if (res.status) {
                console.log(res.result);
                chats.users[userID] = res.result;
                return res.result;
            } else {
                core.showToUser({ status: false, message: "Kullanıcı alınamadı!" });
            }
        }
    },
    showConversations: async function (activeConvID = null) {
        document.getElementById("conversation-section").innerHTML = "";
        for (let i in chats.conversations) {
            //let cookies = core.parseCookies();
            if (chats.conversations[i].Type == "private") {
                const otherUser = chats.conversations[i].Participants.filter(value => localStorage.getItem("userID") != value);
                var userData = await chats.getUser(otherUser[0]);
                var conversionData = [chats.conversations[i]._id, userData.Username, userData.Biography, userData.Image];
                if (i == activeConvID){
                    conversionData.push(" active");
                    chats.setActiveConversation(activeConvID,conversionData[1],conversionData[3]);
                }
                chats.createConversationObj(...conversionData);
            } else if (chats.conversations[i].Type == "group") {

            }
            /*if(chats.conversations[i].Title == null){
                
            }
            if(chats.conversations[i].Biography == null){

            }
            if(chats.conversations[i].Image == null){

            }*/
        }
    },
    setActiveConversation : function(convID,title,img){
        chats.activeConversationID = convID;
        document.querySelector("div.conversation-title > p").innerText=title;
        document.querySelector("div.conversation-info-img").style.background="url("+img+")";
        document.querySelector("div.conversation-area").innerHTML = "";

    },
    sendMessage : function(){
        if(chats.activeConversationID == null) return;
        const message = document.getElementById("mess-box").value;
        console.log(chats.activeConversationID);
        document.getElementById("mess-box").value="";
        chats.socket.emit("message", message,chats.activeConversationID);
    },
    searchReset: function () {
        document.getElementById("new-conversation-start").setAttribute("class", "display-none");
        chats.privateMessagingSwitch = false;
        chats.groupMessagingSwitch = false;
        document.querySelector("div.top-bar i.fa-arrow-left").classList.add("display-none");
        document.querySelector("div.top-bar i.fa-search").classList.remove("active");
        document.querySelector("div.top-bar input.search-top").value = "";
    }
    /*newGroup(): function(){
        //check any conversation already in indexeddb with conversation._id from response
        
    }*/

}
window.addEventListener('load', eventLoad => {
    chats.socket = io({
        auth: {
            token: JSON.parse(localStorage.getItem("accessToken"))["token"]
        }
    });
    chats.socket.on("connect_error", (err) => {
        if (err.data && err.data.code) {
            if (err.message == "ERR.AUTH.FAILED") { // ERR.AUTH.FAILED
                core.showToUser(err.message);
                chats.socket.disconnect();
            } else if (err.message == "USER.ACCESS.RESTRICTED") { // ERR.AUTH.FAILED
                core.showToUser(err.message);
                chats.socket.disconnect();
            } else if (err.message == "SOCKET.NEW.TOKEN") { // ERR.AUTH.FAILED

            }
        }
    });
    chats.socket.on("message", (convID,fromID,message) => {
        let userData = chats.getUser(fromID);
        chats.createBubbleObj(fromID,message);
        console.log(convID,fromID,message);
    });
    window.addEventListener('keyup', eventKeyup => {
        if (eventKeyup.target.closest("input.search-top") && chats.privateMessagingSwitch) {
            var searchWord = eventKeyup.target.value;
            //var elementID = event.target.getAttribute("data-element");
            if (chats.searchUsersInterval) {
                clearInterval(chats.searchUsersInterval);
                console.log("interval var silindi");
            } else {
                console.log("interval yok");
            }
            chats.searchUsersInterval = setInterval(function () { console.log("interval tanımlandı"); chats.searchUsersIntervalTrigger(searchWord) }, 1000);
        }
    });
    window.addEventListener('click', eventClick => {
        if (eventClick.target.closest("div.new-conversation-button")) {
            chats.createNewConverToggle();
        } else if (eventClick.target.closest("div#start-new-private")) {
            chats.searchReset();
            chats.searchNewPrivate();
        } else if (eventClick.target.closest("div#start-new-group")) {
            chats.searchReset();
            chats.searchNewGroup();
        } else if (eventClick.target.closest("div.search-object")) {
            if (chats.privateMessagingSwitch) {
                chats.newPrivate(eventClick.target.closest("div.search-object").id);
            }
            //else if(chats.groupMessagingSwitch) chats.newGroup(eventClick.target.id);
            //else chats.setConversation();
            chats.searchReset();

        } else if (eventClick.target.closest("div.top-bar i.fa-arrow-left")) {
            chats.searchReset();
            chats.showConversations();
        } else if (eventClick.target.closest("div#message-send-button")) {
            chats.sendMessage();
        }
    });
});
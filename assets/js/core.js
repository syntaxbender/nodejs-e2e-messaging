"use strict";
var core = {
    domain: "http://localhost:3000",
    responseTypes: {
        accessToken : "access-token",
        valErr : "validation-error",
        singleData : "single-data",
        multipleDataArray : "multiple-data-array",
        multipleDataObject : "multiple-data-object"
    },
    APIs : function(){
        return {
            userCreate:core.domain+"/users/create",
            userLogin:core.domain+"/users/login",
            userGet:core.domain+"/users/get",
            searchUsers:core.domain+"/users/search",
            convCreate:core.domain+"/conversation/create"

        }
    },
    URIs : function(){
        return{
            chats : core.domain+"/chats",
            login : core.domain+"/login"
        }
    },
    parseCookies: function () {
        if(document.cookie != '' && document.cookie != null)
        return document.cookie.split(';').map(v => v.split('=')).reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {});
        else return {};
    },
    setCookie: function (name,content) {
        let date = new Date();
        date.setTime(date.getTime()+1000*60*60*24*365); // 1 year
        document.cookie = name+"="+content+"; expires="+encodeURIComponent(date.toUTCString())+"; path=/";
    },
    delCookie: function(name){
        document.cookie = name+"=;";
    },
    xreq: async function(method, url, parameters = {}){
        //if(core.parseCookies().token != null) parameters.token = core.parseCookies().token; 
        if(localStorage.getItem("accessToken") != null) parameters.token = JSON.parse(localStorage.getItem("accessToken"))["token"]; 
        let data = await core._xreq(method, url, parameters);
        if(data.type == core.responseTypes.accessToken){
            localStorage.setItem("accessToken",JSON.stringify({token : data.token, expDate : data.expDate}))
            //core.setCookie("accessToken",data.token);
        }else return data;
        return await core._xreq(method, url, parameters);
    },
    _xreq: function (method, url, parameters = {}) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        //hata durumu
                    }
                }
            };
            xhr.send(JSON.stringify(parameters));
        });
    },
    showToUser: function (res) {
        if (res.status) {
            if(res.type==core.responseTypes.singleData){
                notification.pushSuccess(res.result);
            }
        } else {
            if(res.type==core.responseTypes.valErr){
                res.result.map(k=>notification.pushSuccess(k.message));
            }else if(res.type==core.responseTypes.singleData){
                notification.pushError(res.result);
            }
        }
    }
};
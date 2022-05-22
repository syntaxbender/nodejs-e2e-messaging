var login = {
    isPassedFirstStep: false,
    loginFirstStepAction: async function () {
        let res = await core._xreq("POST", core.APIs().userCreate, {
            "Email": document.getElementById("Email").value,
        });
        if(res.status){
            document.getElementById("password-field").classList.remove("class", "display-none");
            document.getElementById("password-field").classList.add("class", "display-block");
            document.getElementById("Email").setAttribute("disabled", true);
            login.isPassedFirstStep = true;
        }else{
            core.showToUser(res);
        }
    },
    loginSecondStepAction: async function () {
        let res = await core._xreq("POST", core.APIs().userLogin, {
            "Email": document.getElementById("Email").value,
            "Password": document.getElementById("Password").value
        });
        core.showToUser(res);
        if (res.status && res.type==core.responseTypes.accessToken) {
            //console.log(res);
            localStorage.setItem("accessToken", JSON.stringify({token : res.token, expDate : res.expDate}));
            localStorage.setItem("userID", res.userID);
            //localStorage.setItem("userid", );
            //core.setCookie("accessToken",res.token);
            notification.pushSuccess("Başarılı giriş");
            setTimeout(function(){
                window.location.replace(core.URIs().chats);
            }, 1500);
        }else{
            login.reset();
        }
    },
    reset: function () {
        login.isPassedFirstStep = false;
        document.getElementById("Email").removeAttribute("disabled");
        document.getElementById("password-field").classList.remove("class", "display-block");
        document.getElementById("password-field").classList.add("class", "display-none");
    }
};
window.addEventListener('load', eventLoad => {
    window.addEventListener('click', eventClick => {
        if (eventClick.target.closest("div#login-section div.login-button")) {
            if (!login.isPassedFirstStep) login.loginFirstStepAction();
            else login.loginSecondStepAction();
        }else if (eventClick.target.closest("div#notification div.close")){
            let index = eventClick.target.closest("div#notification div.notification-section").id;
            notification.close(index);
        }
    });
});
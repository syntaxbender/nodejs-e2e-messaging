var notification = {
    counter: 0,
    timer: 10000,
    DOMObjectGenerator: function (type, id, mess) {
        let notificationObject = document.createElement("div");
        notificationObject.setAttribute("id", id);
        notificationObject.setAttribute("class", "notification-section "+type);
        let content = document.createElement("div");
        content.setAttribute("class", "content");
        content.innerHTML = mess;
        let close = document.createElement("div");
        close.setAttribute("class", "close");
        close.innerHTML = "<i class=\"fas fa-times\"></i>";
        notificationObject.appendChild(content);
        notificationObject.appendChild(close);
        let timer = function (id) {
            setTimeout(function () {
                document.getElementById(id).remove();
            }, notification.timer);
        }
        return { object: notificationObject, timer: timer };
    },
    pushSuccess: function (mess) {
        let divID = "notifID-" + (++notification.counter).toString();
        let object = notification.DOMObjectGenerator("success", divID, mess);
        document.getElementById("notification").appendChild(object.object);
        object.timer(divID);
    },
    pushError: function (mess) {
        let divID = "notifID-" + (++notification.counter).toString();
        let object = notification.DOMObjectGenerator("error", divID, mess);
        document.getElementById("notification").appendChild(object.object);
        object.timer(divID);
    },
    pushWarn: function (mess) {
        let divID = "notifID-" + (++notification.counter).toString();
        let object = notification.DOMObjectGenerator("warn", divID, mess);
        document.getElementById("notification").appendChild(object.object);
        object.timer(divID);
    },
    close: function (divID) {
        document.getElementById(divID).remove();
    }
};
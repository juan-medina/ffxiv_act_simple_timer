var containerDiv;

function handleLock(locked) {
    var titleDiv = document.getElementById('title');
    titleDiv.locked = locked;
    if (locked) {
        hideResizeHandle();
    } else {
        displayResizeHandle();
    }
}

function displayResizeHandle() {
    document.documentElement.classList.add("resizeHandle");
    update();
}

function hideResizeHandle() {
    document.documentElement.classList.remove("resizeHandle");
    update();
}

function createTimestamp() {
    var jsDate = new Date();
    var offsetMinutes = new Date().getTimezoneOffset();
    var jsTime = jsDate.getTime() - offsetMinutes * 60 * 1000;
    return jsTime;
}

function checkForTriggers(key, name, secs, type, target) {
    if (entries[key] != null) {
        if (entries[key].type == type) {
            var element = entries[key];
            var newTimer = {
                color: element.color,
                expireCount: 0,
                key: element.key,
                target: target,
                name: name,
                img: element.img,
                startCount: secs,
                warningCount: secs * 0.25,
                startTime: createTimestamp()
            }
            if (element.img == null) {
                fetch(`https://xivapi.com/Status/${key}`, {
                    mode: "cors"
                }).then(response => response.json()).then(data => {
                    element.img = `https://xivapi.com${data.Icon}`;
                    newTimer.img = element.img;
                    processTimerEvent(containerDiv, newTimer);
                    update();
                });
            } else {
                processTimerEvent(containerDiv, newTimer);
                update();
            }
        }
    }
}

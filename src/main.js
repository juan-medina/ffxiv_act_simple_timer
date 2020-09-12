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

// https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md
const CHANGE_PRIMARY_PLAYER = 02;
const EFFECT_GAINED = 26;

const MOB_SUBID = "40";
const PLAYER_SUBID = "10";

var playerName = "";

function handleLock(locked) {
    var titleDiv = document.getElementById('title');
    titleDiv.locked = locked;
    if (locked) {
        hideResizeHandle();
    } else {
        displayResizeHandle();
    }
}

function listenToOverlayPlugin(callback) {
    document.addEventListener('onLogLine', function(event){
        if (event.detail == undefined) return;
        var detail = eval(event.detail);
        callback(detail);
    });
    document.addEventListener("onOverlayStateUpdate", function (e) {
        handleLock(e.detail.isLocked);
    });
}

function listenActWebSocket(callback) {
    handleLock(true);
	const url = new URLSearchParams(window.location.search);
    const wsUri = `${url.get("HOST_PORT")}BeforeLogLineRead` || undefined;
	const ws = new WebSocket(wsUri);
	ws.onerror = () => ws.close();
	ws.onclose = () =>
		setTimeout(() => {
			listenActWebSocket(callback);
		}, 1000);
	ws.onmessage = function(e, m) {
		if (e.data === ".") return ws.send(".");
        const obj = JSON.parse(e.data);
        if (obj.msgtype === "Chat") {
			return callback(obj.msg.split("|"));
        }
	}

	return () => {
		ws.close()
	}
}

function onLogLine(detail) {
    const type = detail[0];

    if (type == CHANGE_PRIMARY_PLAYER) {
        if (detail.length < 3) return;
        playerName = detail[3];
    } else if (type==EFFECT_GAINED) {
        if (detail.length < 7) return;

        const action = parseInt(detail[2], 16);
        const name = detail[3];
        const secs = parseFloat(detail[4])
        const target = detail[7];
        const unitIdSub = target.substring(0, 2);

        if ( unitIdSub == MOB_SUBID) {
            const source = detail[6];
            checkForTriggers(action, name, secs, ENTRY_ENEMY_EFFECT_ANY_PLAYER, target);
            if (source != null && source == playerName) {
                checkForTriggers(action, name, secs, ENTRY_ENEMY_EFFECT_OUR_PLAYER, target);
            }
        }else if (unitIdSub == PLAYER_SUBID){
            const player = detail[8];
            if(player == playerName) {
                checkForTriggers(action, name, secs, ENTRY_PLAYER_EFFECT, target);
            }
        }
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


var containerDiv;

const getHost = () => /HOST_PORT=(wss?:\/\/.+)/.exec(window.location.search);

function initialize() {

    if (!getHost()) {
        listenToOverlayPlugin(onLogLine);
    }else {
        listenActWebSocket(onLogLine);
    }

    containerDiv = document.getElementById('spelltimer');
    update();
    setInterval("update()", 500);
}

var bars = [];

function update() {
    var newBars = [];
    for (var i = 0; i < bars.length; i++) {
        if (!bars[i].spellTimer.getIsExpired()) {
            bars[i].updateBar();
            newBars.push(bars[i]);
        } else {
            bars[i].removeBarElement();
        }
    }
    bars = newBars;

    var titleDiv = document.getElementById('title');
    if (titleDiv.locked) {
        $(titleDiv).hide();
        if (bars.length > 0) {
            $(titleDiv).show();
        } else {
            $(titleDiv).hide();
        }
    } else {
        $(titleDiv).show();
    }
}

function processTimerEvent(container, event) {
    var spellTimer = new SpellTimer(event);

    if (duplicated(spellTimer)){
        return;
    }

    if (spellTimer.getIsExpired()) {
        return;
    };

    var bar = getTimerBarFromList(spellTimer);


    if (typeof (bar) == 'undefined' && event.onlyMasterTicks && !event.absoluteTiming) {
        for (var i = bars.length - 1; i >= 0; i--) {
            if (bars[i].spellTimer.key == event.key) {
                bars[i].removeBarElement();
                bars.splice(i, 1);
            }
        }
    }

    if (typeof (bar) == 'undefined') {
        bar = new TimerBar(spellTimer);

        bar.setBarLabel(function (event) {
            var nameText = event.name;
            var remaining = event.getRemaining();
            var timerText;
            if (remaining <= 0) {
                timerText = "READY";
            } else {
                timerText = event.getRemaining().toFixed(0) + "s";
            }

            return "<span class='label-left'><span class='timer-name'><img class='buff' src='" + event.img + "'>&nbsp;" + nameText + "</span>:</span>" +
                "<span class='label-right timer-remaining'>" + timerText + "</span>";
        });
        bar.useHTMLLabel = true;
        bar.setBarColor(bar.spellTimer.color);
        var i;
        var inserted = false;
        for (i = 0; i < bars.length; i++) {
            if (spellTimer.getRemaining() < bars[i].spellTimer.getRemaining()) {
                bars.splice(i, 0, bar);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            bars.push(bar);
        }

        var nextElement;
        if (bars[i + 1]) {
            nextElement = bars[i + 1].barElement;
        }
        container.insertBefore(bar.barElement, nextElement)
    }
}

function duplicated(spellTimer) {
    for (var i = 0; i < bars.length; i++) {
        if ( (bars[i].spellTimer.name == spellTimer.name) && (bars[i].spellTimer.target == spellTimer.target ) ) {
            return true;
        }
    }
    return false;
}

function getTimerBarFromList(spellTimer) {
    var uniqueName = TimerBar.createUniqueName(spellTimer);
    for (var i = 0; i < bars.length; i++) {
        if (bars[i].uniqueName == uniqueName) {
            return bars[i];
        }
    }
    return;
}

var SpellTimer = (function (event) {
    this.color = event.color;
    this.expireCount = event.expireCount;
    this.key = event.key;
    this.target = event.target;
    this.name = event.name;
    this.startCount = event.startCount;
    this.tooltip = event.tooltip;
    this.warningCount = event.warningCount;
    this.startTime = event.startTime;
    this.img = event.img;
});
SpellTimer.prototype = {
    getIsExpired: function () {
        if (this.getRemaining() < this.expireCount) {
            return true;
        } else {
            return false;
        }
    },
    getElapsed: function () {
        return getElapsedSeconds(this.startTime);
    },
    getRemaining: function () {
        return this.startCount - this.getElapsed();
    }
};

var TimerBar = (function (_spellTimer) {

    this.spellTimer = _spellTimer;

    this.uniqueName = TimerBar.createUniqueName(this.spellTimer);
    this.barElement = this._createProgressBarElement();
    this.labelFunc = (function (_bar) { return ""; });
    this.useHTMLLabel = true;

});
TimerBar.createUniqueName = function (spellTimer) {
    return "TBAR_" + spellTimer.name + "_" + spellTimer.startTime.toString();
}

TimerBar.prototype = {
    setBarLabel: function (strOrFunc) {
        if (typeof (strOrFunc) == "function") {
            this.labelFunc = strOrFunc;
        } else {
            this.labelFunc = function () { return strOrFunc; };
        }
    },
    setBarColor: function (color) {
        var match = /rgba\((\d+),\s(\d+),\s(\d+),\s([0-9\.]+)\)/g.exec(color);

        var r = Math.round(parseFloat(match[1]) * 0.50);
        var g = Math.round(parseFloat(match[2]) * 0.50);
        var b = Math.round(parseFloat(match[3]) * 0.50);
        var a = parseFloat(match[4]);
        var darkColor = "rgba(" + [r, g, b, a].join(',') +")";

        this.barElement.children[0].style.backgroundColor = color;
        this.barElement.children[0].style.darkColor = darkColor;
    },
    setBarHeight: function (height) {
        this.barElement.style.height = height;
    },
    updateBar: function () {
        var text = this.labelFunc(this.spellTimer);
        if (this.useHTMLLabel) {
            this.barElement.children[1].innerHTML = text;
        } else {
            this.barElement.children[1].innerText = text;
        }
    },
    _createProgressBarElement: function () {
        var outerDiv = document.createElement("div");
        outerDiv.className = "progress-outer";
        var barDiv = document.createElement("div");
        barDiv.className = "progress-bar";
        var textDiv = document.createElement("div");
        textDiv.className = "progress-text";

        outerDiv.appendChild(barDiv);
        outerDiv.appendChild(textDiv);

        var percentage = Math.max(0, Math.min(1, this.spellTimer.getRemaining() / this.spellTimer.startCount)) * 100;
        barDiv.style.width = percentage.toFixed(2) + "%";

        setTimeout(function (barDiv) {
            barDiv.style.backgroundColor = barDiv.style.darkColor;
        }, Math.max(0, (this.spellTimer.getRemaining() - this.spellTimer.warningCount) * 1000), barDiv);

        $(barDiv).animate(
            { width: "0%" },
            Math.max(0, this.spellTimer.getRemaining() * 1000),
            "linear");

        return outerDiv;
    },
    removeBarElement: function () {
        this.barElement.parentElement.removeChild(this.barElement);
    }
};


function getElapsedSeconds(startTime) {
    var jsDate = new Date();
    var offsetMinutes = new Date().getTimezoneOffset();
    var jsTime = jsDate.getTime() - offsetMinutes * 60 * 1000;

    return (jsTime - startTime) / 1000;
}

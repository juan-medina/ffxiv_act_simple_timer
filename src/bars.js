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
                timerText = "";
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
        if ( (bars[i].spellTimer.key == spellTimer.key) && (bars[i].spellTimer.target == spellTimer.target )
                && (bars[i].spellTimer.source == spellTimer.source )) {
            return true;
        }
    }
    return false;
}

function checkForRemoval(key, name, target, source) {
    if (entries[key] == null) {
        return;
    }
    for (var i = 0; i < bars.length; i++) {
        if ( (bars[i] == null) || (bars[i].uniqueName==null) || bars[i].spellTimer.getIsExpired() ) {
            continue;
        }
        if ( (bars[i].spellTimer.key == key) && (bars[i].spellTimer.target == target )
                && (bars[i].spellTimer.source == source )) {
            bars[i].spellTimer.startCount = -1;
            update();
            return;
        }
    }
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
    this.source = event.source;
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

        var r = Math.round((parseFloat(match[1]) + 255)/2);
        var g = Math.round((parseFloat(match[2]) + 0)/2);
        var b = Math.round((parseFloat(match[3]) + 0)/2);

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

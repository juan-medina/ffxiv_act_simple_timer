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

var playerName = "";

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

// https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md
const CHANGE_PRIMARY_PLAYER = 02;
const EFFECT_GAINED = 26;
const EFFECT_LOOSE = 30;

const MOB_SUBID = "40";
const PLAYER_SUBID = "10";

function onLogLine(detail) {
    const type = detail[0];

    if (type == CHANGE_PRIMARY_PLAYER) {
        if (detail.length < 3) return;
        playerName = detail[3];
    } else if (type==EFFECT_GAINED) {
        if (detail.length < 7) return;

        const action = parseInt(detail[2], 16);
        const name = detail[3];
        const secs = parseFloat(detail[4]);
        const source = detail[5];
        const sourceName = detail[6];
        const target = detail[7];
        const targetName = detail[8];
        const unitIdSub = target.substring(0, 2);

        if ( (secs == NaN) || (secs <= 0) || (secs >= 600) ) {
            return;
        }

        //console.dir("gain effect: " + name + " source: "+ source + " target: "+ target + " action: " +  action + " secs: " + secs);

        if ( unitIdSub == MOB_SUBID) {
            checkForTriggers(action, name, secs, ENTRY_ENEMY_EFFECT_ANY_PLAYER, target, source);
            if (sourceName == playerName) {
                checkForTriggers(action, name, secs, ENTRY_ENEMY_EFFECT_OUR_PLAYER, target, source);
            }
        }else if (unitIdSub == PLAYER_SUBID){
            if(targetName == playerName) {
                checkForTriggers(action, name, secs, ENTRY_PLAYER_EFFECT, target, source);
            }
        }
    }else if (type == EFFECT_LOOSE) {
        if (detail.length < 7) return;
        const name = detail[3];
        const action = parseInt(detail[2], 16);
        const source = detail[5];
        const target = detail[7];

        //console.dir("loose effect: " + name + " source: "+ source + " target: "+ target + " action: " +  action);

        checkForRemoval(action, name, target, source);
    }
}

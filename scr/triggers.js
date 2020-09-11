const ENTRY_PLAYER_EFFECT = "player_effect";
const ENTRY_ENEMY_EFFECT = "enemy_effect";

const COLOR_DPS = "rgba(255, 0, 0, 0.4)";
const COLOR_MITIGATION = "rgba(0, 0, 255, 0.4)";
const COLOR_HEAL = "rgba(0, 255, 0, 0.4)";

var TimerEntry = (function (key, color, type, icon) {
    this.key = key;
    this.color = color;
    this.img = "https://xivapi.com" + icon;
    this.type = type;
});

var entries = [];

function PlayerEffect(color, icon, ...keys) {
    for (var key of keys) {
        entries[key] = new TimerEntry(key, color, ENTRY_PLAYER_EFFECT, icon);
    }
};

function EnemyEffect(color, icon, ...keys) {
    for (var key of keys) {
        entries[key] = new TimerEntry(key, color, ENTRY_ENEMY_EFFECT, icon);
    }
};


//https://xivapi.com/search?indexes=status&string=Technical%20Finish

//Party Buffs
// Trick Attack
EnemyEffect(COLOR_DPS, "/i/014000/014857.png", 2041);

// Technical Finish
PlayerEffect(COLOR_DPS, "/i/013000/013709.png", 1822, 2050);

// Battle Voice
PlayerEffect(COLOR_DPS, "/i/012000/012601.png", 141);

// Brotherhood
PlayerEffect(COLOR_DPS, "/i/012000/012529.png", 1182, 1185, 2173, 2174);

// Embolden
PlayerEffect(COLOR_DPS, "/i/018000/018921.png", 1239, 1297, 2282);

//DCN
// Devilment
PlayerEffect(COLOR_DPS, "/i/013000/013714.png", 1825);

//PLD
// Requiescat
PlayerEffect(COLOR_DPS, "/i/012000/012514.png", 1368, 1369);

// Sentinel
PlayerEffect(COLOR_MITIGATION, "/i/010000/010151.png", 74);

// Sheltron
PlayerEffect(COLOR_MITIGATION, "/i/012000/012510.png", 728, 1856);

// Hallowed Ground
PlayerEffect(COLOR_MITIGATION, "/i/012000/012504.png", 82, 1302, 2287);

// Reprisal
EnemyEffect(COLOR_MITIGATION, "/i/013000/013103.png", 753, 1193, 2101);

// Fight or Flight
PlayerEffect(COLOR_DPS, "/i/010000/010155.png", 76);

// Goring Blade
EnemyEffect(COLOR_DPS, "/i/012000/012507.png", 725);

//WHM
// Thin Air
PlayerEffect(COLOR_HEAL, "/i/012000/012631.png", 1217);

// Presence of Mind
PlayerEffect(COLOR_HEAL, "/i/012000/012627.png", 157);

// Temperance
PlayerEffect(COLOR_HEAL, "/i/012000/012634.png", 1872, 1873, 2037, 2038);

//Healers
// Lucid Dreaming
PlayerEffect(COLOR_HEAL, "/i/013000/013909.png", 1204);

//Tanks
// Rampart
PlayerEffect(COLOR_MITIGATION, "/i/010000/010152.png", 71, 1191, 1978);

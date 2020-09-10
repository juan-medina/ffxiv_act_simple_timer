const ENTRY_PLAYER_EFFECT = "player_effect";
const ENTRY_ENEMY_EFFECT = "enemy_effect";

const COLOR_DPS = "rgba(255, 0, 0, 0.4)";
const COLOR_MITIGATION = "rgba(0, 0, 255, 0.4)";
const COLOR_HEAL = "rgba(0, 255, 0, 0.4)";

var TimerEntry = (function (key, secs, color, type, icon) {
    this.key = key;
    this.secs = secs;
    this.color = color;
    this.img = "https://xivapi.com" + icon;
    this.type = type;
});

var entries = [];

function PlayerEffect(key, secs, color, icon) {
    entries[key] = new TimerEntry(key, secs, color, ENTRY_PLAYER_EFFECT, icon);
};

function EnemyEffect(key, secs, color, icon) {
    entries[key] = new TimerEntry(key, secs, color, ENTRY_ENEMY_EFFECT, icon);
};


//https://xivapi.com/search?indexes=status&string=Technical%20Finish

//Party Buffs
// Trick Attack
EnemyEffect(2041, 10, COLOR_DPS, "/i/014000/014857.png");

// Technical Finish
PlayerEffect(1822, 20, COLOR_DPS, "/i/013000/013709.png");
PlayerEffect(2050, 20, COLOR_DPS, "/i/013000/013709.png");

// Battle Voice
PlayerEffect(141, 20, COLOR_DPS, "/i/012000/012601.png");

// Brotherhood
PlayerEffect(1182, 15, COLOR_DPS, "/i/012000/012529.png");
PlayerEffect(1185, 15, COLOR_DPS, "/i/012000/012532.png");
PlayerEffect(2173, 15, COLOR_DPS, "/i/012000/012529.png");
PlayerEffect(2174, 15, COLOR_DPS, "/i/012000/012532.png");

// Embolden
PlayerEffect(1239, 20, COLOR_DPS, "/i/018000/018921.png");
PlayerEffect(1297, 20, COLOR_DPS, "/i/018000/018941.png");
PlayerEffect(2282, 20, COLOR_DPS, "/i/018000/018921.png");

//DCN
// Devilment
PlayerEffect(1825, 20, COLOR_DPS, "/i/013000/013714.png");

//PLD
// Requiescat
PlayerEffect(1368, 12, COLOR_DPS, "/i/012000/012514.png");
PlayerEffect(1369, 12, COLOR_DPS, "/i/012000/012514.png");

// Sentinel
PlayerEffect(74, 10, COLOR_MITIGATION, "/i/010000/010151.png");

// Sheltron
PlayerEffect(728, 4, COLOR_MITIGATION, "/i/012000/012510.png");
PlayerEffect(1856, 4, COLOR_MITIGATION, "/i/012000/012510.png");

// Fight or Flight
PlayerEffect(76, 25, COLOR_DPS, "/i/010000/010155.png");

// Hallowed Ground
PlayerEffect(82, 10, COLOR_MITIGATION, "/i/012000/012504.png");
PlayerEffect(1302, 10, COLOR_MITIGATION, "/i/012000/012504.png");
PlayerEffect(2287, 10, COLOR_MITIGATION, "/i/012000/012504.png");

// Reprisal
EnemyEffect(753, 10, COLOR_MITIGATION, "/i/013000/013103.png");
EnemyEffect(1193, 10, COLOR_MITIGATION, "/i/013000/013901.png");
EnemyEffect(2101, 10, COLOR_MITIGATION, "/i/013000/013901.png");

//WHM
// Thin Air
PlayerEffect(1217, 12, COLOR_HEAL, "/i/012000/012631.png");

// Presence of Mind
PlayerEffect(157, 15, COLOR_HEAL, "/i/012000/012627.png");

// Temperance
PlayerEffect(1872, 20, COLOR_HEAL, "/i/012000/012634.png");
PlayerEffect(1873, 20, COLOR_HEAL, "/i/012000/012633.png");
PlayerEffect(2037, 20, COLOR_HEAL, "/i/012000/012634.png");
PlayerEffect(2038, 20, COLOR_HEAL, "/i/012000/012633.png");

//Healers
// Lucid Dreaming
PlayerEffect(1204, 21, COLOR_HEAL, "/i/013000/013909.png");

//Tanks
// Rampart
PlayerEffect(71, 20, COLOR_MITIGATION, "/i/010000/010152.png");
PlayerEffect(1191, 20, COLOR_MITIGATION, "/i/013000/013911.png");
PlayerEffect(1978, 20, COLOR_MITIGATION, "/i/010000/010152.png");

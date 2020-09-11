const ENTRY_PLAYER_EFFECT = "player_effect";
const ENTRY_ENEMY_EFFECT = "enemy_effect";

const COLOR_DPS = "rgba(255, 0, 0, 0.4)";
const COLOR_MITIGATION = "rgba(0, 0, 255, 0.4)";
const COLOR_HEAL = "rgba(0, 255, 0, 0.4)";

var TimerEntry = (function (key, color, type) {
    this.key = key;
    this.color = color;
    this.type = type;
    this.img = null;
});

var entries = [];

function PlayerEffect(color, ...keys) {
    for (var key of keys) {
        entries[key] = new TimerEntry(key, color, ENTRY_PLAYER_EFFECT);
    }
};

function EnemyEffect(color, ...keys) {
    for (var key of keys) {
        entries[key] = new TimerEntry(key, color, ENTRY_ENEMY_EFFECT);
    }
};


//https://xivapi.com/search?indexes=status&string=Technical%20Finish

//Party Buffs
// Trick Attack
EnemyEffect(COLOR_DPS, 2041);

// Technical Finish
PlayerEffect(COLOR_DPS, 1822, 2050);

// Battle Voice
PlayerEffect(COLOR_DPS, 141);

// Brotherhood
PlayerEffect(COLOR_DPS, 1182, 1185, 2173, 2174);

// Embolden
PlayerEffect(COLOR_DPS, 1239, 1297, 2282);

//DCN
// Devilment
PlayerEffect(COLOR_DPS, 1825);

//PLD
// Requiescat
PlayerEffect(COLOR_DPS, 1368, 1369);

// Sentinel
PlayerEffect(COLOR_MITIGATION, 74);

// Sheltron
PlayerEffect(COLOR_MITIGATION, 728, 1856);

// Hallowed Ground
PlayerEffect(COLOR_MITIGATION, 82, 1302, 2287);

// Reprisal
EnemyEffect(COLOR_MITIGATION, 753, 1193, 2101);

// Fight or Flight
PlayerEffect(COLOR_DPS, 76);

// Goring Blade
EnemyEffect(COLOR_DPS, 725);

//WHM
// Thin Air
PlayerEffect(COLOR_HEAL, 1217);

// Presence of Mind
PlayerEffect(COLOR_HEAL, 157);

// Temperance
PlayerEffect(COLOR_HEAL, 1872, 1873, 2037, 2038);

//Healers
// Lucid Dreaming
PlayerEffect(COLOR_HEAL, 1204);

//Tanks
// Rampart
PlayerEffect(COLOR_MITIGATION, 71, 1191, 1978);

const ENTRY_PLAYER_EFFECT = "player_effect";
const ENTRY_ENEMY_EFFECT_ANY_PLAYER = "enemy_effect_any";
const ENTRY_ENEMY_EFFECT_OUR_PLAYER = "enemy_effect_our";

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

function BuffOurPlayer(color, ...keys) {
    for (var key of keys) {
        entries[key] = new TimerEntry(key, color, ENTRY_PLAYER_EFFECT);
    }
};

function DebuffMobByAnyPlayer(color, ...keys) {
    for (var key of keys) {
        entries[key] = new TimerEntry(key, color, ENTRY_ENEMY_EFFECT_ANY_PLAYER);
    }
};

function DebuffMobByOurPlayer(color, ...keys) {
    for (var key of keys) {
        entries[key] = new TimerEntry(key, color, ENTRY_ENEMY_EFFECT_OUR_PLAYER);
    }
};

//https://xivapi.com/search?indexes=status&string=Technical%20Finish

//Party Buffs
// Trick Attack
DebuffMobByAnyPlayer(COLOR_DPS, 2041);

// Technical Finish
BuffOurPlayer(COLOR_DPS, 1822, 2050);

// Battle Voice
BuffOurPlayer(COLOR_DPS, 141);

// Brotherhood
BuffOurPlayer(COLOR_DPS, 1182, 1185, 2173, 2174);

// Embolden
BuffOurPlayer(COLOR_DPS, 1239, 1297, 2282);

//DCN
// Devilment
BuffOurPlayer(COLOR_DPS, 1825);

//PLD
// Requiescat
BuffOurPlayer(COLOR_DPS, 1368, 1369);

// Sentinel
BuffOurPlayer(COLOR_MITIGATION, 74);

// Sheltron
BuffOurPlayer(COLOR_MITIGATION, 728, 1856);

// Hallowed Ground
BuffOurPlayer(COLOR_MITIGATION, 82, 1302, 2287);

// Reprisal
DebuffMobByOurPlayer(COLOR_MITIGATION, 753, 1193, 2101);

// Fight or Flight
BuffOurPlayer(COLOR_DPS, 76);

// Goring Blade
DebuffMobByOurPlayer(COLOR_DPS, 725);

// Sword Oath
BuffOurPlayer(COLOR_DPS, 78, 381, 1902, 1991);

//WHM
// Thin Air
BuffOurPlayer(COLOR_HEAL, 1217);

// Presence of Mind
BuffOurPlayer(COLOR_HEAL, 157);

// Temperance
BuffOurPlayer(COLOR_HEAL, 1872, 1873, 2037, 2038);

// Dia
DebuffMobByOurPlayer(COLOR_DPS, 313, 424, 617, 1605, 1634, 1692, 1722, 1748, 1871, 2035);

//Healers
// Lucid Dreaming
BuffOurPlayer(COLOR_HEAL, 1204);

//Tanks
// Rampart
BuffOurPlayer(COLOR_MITIGATION, 71, 1191, 1978);

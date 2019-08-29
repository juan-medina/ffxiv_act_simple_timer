const ENTRY_EFFECT = "effect";
const ENTRY_CAST = "cast";
const ENTRY_USE = "use";
const COLOR_DPS_BUFF = "rgba(127, 0, 0, 0.4)";
const COLOR_MITIGATION_BUFF = "rgba(0, 0, 127, 0.4)";
const COLOR_HEAL_BUFF = "rgba(0, 127, 0, 0.4)";

var TimerEntry = (function (key, name, secs, color, type) {
    this.key = key;
    this.name = name;
    this.secs = secs;
    this.color = color;
    this.img = "https://www.garlandtools.org/files/icons/status/" + key + ".png";
    this.type = type;
});

var EffectEntry = (function (key, name, secs, color) {
    TimerEntry.call(this, key, name, secs, color, ENTRY_EFFECT);
    this.reg = new RegExp("You gain the effect of .*" + name);
});

var CastEntry = (function (key, name, secs, color) {
    TimerEntry.call(this, key, name, secs, color, ENTRY_CAST);
    this.reg = new RegExp("\\w+ cast " + name);
});

var UseEntry = (function (key, name, secs, color) {
    TimerEntry.call(this, key, name, secs, color, ENTRY_USE);
    this.reg = new RegExp("\\w+ uses? " + name);
});

var entries = [];

// Party Buffs
entries.push(new UseEntry(13709, "Trick Attack", 10, COLOR_DPS_BUFF));
entries.push(new EffectEntry(13709, "Technical Finish", 20, COLOR_DPS_BUFF));
entries.push(new EffectEntry(12601, "Battle Voice", 20, COLOR_DPS_BUFF));
entries.push(new EffectEntry(12532, "Brotherhood", 15, COLOR_DPS_BUFF));
entries.push(new EffectEntry(18921, "Embolden", 20, COLOR_DPS_BUFF));

// DCN
entries.push(new EffectEntry(13714, "Devilment", 20, COLOR_DPS_BUFF));

// PLD
entries.push(new EffectEntry(12514, "Requiescat", 12, COLOR_DPS_BUFF));
entries.push(new EffectEntry(10151, "Sentinel", 10, COLOR_MITIGATION_BUFF));
entries.push(new EffectEntry(12510, "Sheltron", 4, COLOR_MITIGATION_BUFF));

// WHM
entries.push(new EffectEntry(12631, "Thin Air", 12, COLOR_HEAL_BUFF));
entries.push(new EffectEntry(12627, "Presence of Mind", 15, COLOR_HEAL_BUFF));
entries.push(new EffectEntry(12634, "Temperance", 20, COLOR_HEAL_BUFF));

// Healers
entries.push(new EffectEntry(13909, "Lucid Dreaming", 21, COLOR_HEAL_BUFF));

// Tanks
entries.push(new EffectEntry(13911, "Rampart", 20, COLOR_MITIGATION_BUFF));

const soundSystem = require("./sound-system");

function getAvailableSounds() {
    return soundSystem.getUsableSounds();
}

function canFanUseSound(sound, uid) {
    return soundSystem.canUseSound(
        sound,
        uid
    );
}

function useSound(sound, uid) {
    return soundSystem.useSound(
        sound,
        uid
    );
}

module.exports = {
    getAvailableSounds,
    canFanUseSound,
    useSound
};

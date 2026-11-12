const soundSystem = require("./sound-system");

// Sounds fans are allowed to use — only allowFanUse === true
function getAvailableSounds() {
  return soundSystem.getUsableSounds();
}

function canFanUseSound(sound, uid) {
  return soundSystem.canUseSound(sound, uid);
}

function useSound(sound, uid) {
  return soundSystem.useSound(sound, uid);
}

function getSoundById(soundId) {
  return soundSystem.getAllSounds().find((s) => s.data.soundId === soundId) || null;
}

module.exports = {
  getAvailableSounds,
  canFanUseSound,
  useSound,
  getSoundById,
};
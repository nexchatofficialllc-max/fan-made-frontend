const fs = require("fs");
const path = require("path");

const soundsFolder = "sounds";

if (!fs.existsSync(soundsFolder)) {
  fs.mkdirSync(soundsFolder, { recursive: true });
}

function getAllSounds() {
  return fs.readdirSync(soundsFolder)
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({
      file,
      data: JSON.parse(fs.readFileSync(`${soundsFolder}/${file}`, "utf8")),
    }));
}

function saveSound(sound) {
  fs.writeFileSync(`${soundsFolder}/${sound.file}`, JSON.stringify(sound.data, null, 2));
}

function getCurrentUser() {
  if (!fs.existsSync("user.json")) throw new Error("No Loopa account found. Create user.json first.");
  return JSON.parse(fs.readFileSync("user.json", "utf8"));
}

function createSound(ownerUid, ownerName, title, fileName) {
  const soundId = "SND-" + Date.now();
  const sound = {
    soundId,
    ownerUid,
    ownerName,
    title,
    fileName,
    allowFanUse: true,
    usedBy: [],
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(`${soundsFolder}/${soundId}.json`, JSON.stringify(sound, null, 2));
  return sound;
}

// Used by sounds menu — uploadSound(filePath, title)
function uploadSound(filePath, title) {
  const user = getCurrentUser();
  if (user.accountType !== "creator") {
    throw new Error("Creator access required. Only Creators can upload sounds.");
  }
  if (!filePath || !fs.existsSync(filePath)) throw new Error("Sound file not found.");
  if (!title?.trim()) throw new Error("Sound title cannot be empty.");

  const extension = path.extname(filePath).toLowerCase();
  const allowed = [".mp3", ".wav", ".m4a", ".ogg"];
  if (!allowed.includes(extension)) throw new Error("Unsupported sound format. Use .mp3, .wav, .m4a, or .ogg");

  const soundId = "SND-" + Date.now();
  const newFileName = soundId + extension;
  const destination = path.join(soundsFolder, newFileName);
  fs.copyFileSync(filePath, destination);

  const settings = fs.existsSync("settings.json")
    ? JSON.parse(fs.readFileSync("settings.json", "utf8"))
    : null;
  const allowFanUse = settings?.creatorSettings?.allowFanSoundUse === true;

  const sound = {
    soundId,
    ownerUid: user.uid,
    ownerName: user.name,
    title: title.trim(),
    fileName: newFileName,
    filePath: destination,
    allowFanUse,
    usedBy: [],
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(`${soundsFolder}/${soundId}.json`, JSON.stringify(sound, null, 2));
  return { file: `${soundId}.json`, data: sound };
}

// Used by sounds menu — getMySounds()
function getMySounds() {
  const user = getCurrentUser();
  return getAllSounds().filter((s) => s.data.ownerUid === user.uid);
}

// Used by sounds menu — setFanUsePermission(soundId, allowed)
function setFanUsePermission(soundId, allowed) {
  const user = getCurrentUser();
  const all = getAllSounds();
  const sound = all.find((s) => s.data.soundId === soundId);
  if (!sound) throw new Error("Sound not found.");
  if (sound.data.ownerUid !== user.uid) throw new Error("You can only change your own sounds.");
  sound.data.allowFanUse = allowed === true;
  saveSound(sound);
  return sound;
}

function getSoundById(soundId) {
  return getAllSounds().find((s) => s.data.soundId === soundId) || null;
}

function getUsableSounds() {
  return getAllSounds().filter((sound) => sound.data.allowFanUse === true);
}

function canUseSound(sound, uid) {
  if (sound.data.ownerUid === uid) return true;
  return sound.data.allowFanUse === true;
}

function recordSoundUse(sound, uid) {
  if (!Array.isArray(sound.data.usedBy)) sound.data.usedBy = [];
  if (!sound.data.usedBy.includes(uid)) {
    sound.data.usedBy.push(uid);
    saveSound(sound);
  }
}

function useSound(sound, uid) {
  if (!canUseSound(sound, uid)) {
    return { success: false, message: "This sound is not available for fan use." };
  }
  recordSoundUse(sound, uid);
  return {
    success: true,
    soundId: sound.data.soundId,
    ownerUid: sound.data.ownerUid,
    ownerName: sound.data.ownerName,
    title: sound.data.title,
  };
}

module.exports = {
  getAllSounds,
  saveSound,
  createSound,
  uploadSound,
  getMySounds,
  setFanUsePermission,
  getSoundById,
  getUsableSounds,
  canUseSound,
  recordSoundUse,
  useSound,
};
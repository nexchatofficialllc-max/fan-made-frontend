const fs = require("fs");

const soundsFolder = "sounds";

if (!fs.existsSync(soundsFolder)) {
    fs.mkdirSync(soundsFolder);
}

function getAllSounds() {
    return fs.readdirSync(soundsFolder)
        .filter(file => file.endsWith(".json"))
        .map(file => ({
            file,
            data: JSON.parse(
                fs.readFileSync(
                    `${soundsFolder}/${file}`,
                    "utf8"
                )
            )
        }));
}

function saveSound(sound) {
    fs.writeFileSync(
        `${soundsFolder}/${sound.file}`,
        JSON.stringify(
            sound.data,
            null,
            2
        )
    );
}

function createSound(ownerUid, ownerName, title, fileName) {

    const soundId =
        "SND-" + Date.now();

    const sound = {
        soundId: soundId,

        ownerUid: ownerUid,

        ownerName: ownerName,

        title: title,

        fileName: fileName,

        allowFanUse: true,

        usedBy: [],

        createdAt:
            new Date().toISOString()
    };

    fs.writeFileSync(
        `${soundsFolder}/${soundId}.json`,
        JSON.stringify(
            sound,
            null,
            2
        )
    );

    return sound;
}

function getUsableSounds() {
    return getAllSounds().filter(
        sound =>
            sound.data.allowFanUse === true
    );
}

function canUseSound(sound, uid) {

    if (
        sound.data.ownerUid === uid
    ) {
        return true;
    }

    return sound.data.allowFanUse === true;
}

function recordSoundUse(sound, uid) {

    if (
        !Array.isArray(
            sound.data.usedBy
        )
    ) {
        sound.data.usedBy = [];
    }

    if (
        !sound.data.usedBy.includes(uid)
    ) {
        sound.data.usedBy.push(uid);
        saveSound(sound);
    }
}

function useSound(sound, uid) {

    if (!canUseSound(sound, uid)) {
        return {
            success: false,
            message: "This sound is not available for fan use."
        };
    }

    recordSoundUse(sound, uid);

    return {
        success: true,
        soundId: sound.data.soundId,
        ownerUid: sound.data.ownerUid,
        ownerName: sound.data.ownerName,
        title: sound.data.title
    };
}

module.exports = {
    getAllSounds,
    saveSound,
    createSound,
    getUsableSounds,
    canUseSound,
    recordSoundUse,
    useSound
};

const fs = require("fs");
const path = require("path");
const soundSystem = require("./sound-system");

function loadUser() {
    if (!fs.existsSync("user.json")) {
        throw new Error(
            "No Fan Made account found."
        );
    }

    return JSON.parse(
        fs.readFileSync(
            "user.json",
            "utf8"
        )
    );
}

function loadSettings() {
    if (!fs.existsSync("settings.json")) {
        throw new Error(
            "Fan Made settings not found."
        );
    }

    return JSON.parse(
        fs.readFileSync(
            "settings.json",
            "utf8"
        )
    );
}

function uploadSound(
    filePath,
    title
) {
    const user = loadUser();
    const settings = loadSettings();

    if (
        user.accountType !== "creator"
    ) {
        throw new Error(
            "Creator access required."
        );
    }

    if (
        !filePath ||
        !fs.existsSync(filePath)
    ) {
        throw new Error(
            "Sound file not found."
        );
    }

    if (!title || !title.trim()) {
        throw new Error(
            "Sound title cannot be empty."
        );
    }

    const extension =
        path.extname(filePath)
            .toLowerCase();

    const allowedFormats = [
        ".mp3",
        ".wav",
        ".m4a",
        ".ogg"
    ];

    if (
        !allowedFormats.includes(
            extension
        )
    ) {
        throw new Error(
            "Unsupported sound format."
        );
    }

    const soundId =
        "SND-" + Date.now();

    const newFileName =
        soundId + extension;

    const destination =
        path.join(
            "sounds",
            newFileName
        );

    fs.copyFileSync(
        filePath,
        destination
    );

    const allowFanUse =
        settings.creatorSettings &&
        settings.creatorSettings
            .allowFanSoundUse === true;

    const sound = {
        soundId: soundId,

        ownerUid:
            user.uid,

        ownerName:
            user.name,

        title:
            title.trim(),

        fileName:
            newFileName,

        filePath:
            destination,

        allowFanUse:
            allowFanUse,

        usedBy: [],

        createdAt:
            new Date()
                .toISOString()
    };

    fs.writeFileSync(
        `sounds/${soundId}.json`,
        JSON.stringify(
            sound,
            null,
            2
        )
    );

    return {
        file: `${soundId}.json`,
        data: sound
    };
}

function setFanUsePermission(
    soundId,
    allowed
) {
    const user = loadUser();

    const sounds =
        soundSystem.getAllSounds();

    const sound =
        sounds.find(
            item =>
                item.data.soundId ===
                soundId
        );

    if (!sound) {
        throw new Error(
            "Sound not found."
        );
    }

    if (
        sound.data.ownerUid !==
        user.uid
    ) {
        throw new Error(
            "Only the sound owner can change this permission."
        );
    }

    sound.data.allowFanUse =
        allowed === true;

    soundSystem.saveSound(
        sound
    );

    return sound;
}

function getMySounds() {
    const user = loadUser();

    return soundSystem
        .getAllSounds()
        .filter(
            sound =>
                sound.data.ownerUid ===
                user.uid
        );
}

module.exports = {
    uploadSound,
    setFanUsePermission,
    getMySounds
};

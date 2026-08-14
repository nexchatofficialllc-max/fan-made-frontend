const soundBridge = require("./sound-bridge");

function attachSound(
    content,
    soundId,
    fanUid
) {
    const sounds =
        soundBridge.getAvailableSounds();

    const sound =
        sounds.find(
            item =>
                item.data.soundId ===
                soundId
        );

    if (!sound) {
        return {
            success: false,
            message:
                "Sound not found or not available for fan use."
        };
    }

    const allowed =
        soundBridge.canFanUseSound(
            sound,
            fanUid
        );

    if (!allowed) {
        return {
            success: false,
            message:
                "This sound is not available for fan use."
        };
    }

    const used =
        soundBridge.useSound(
            sound,
            fanUid
        );

    if (!used.success) {
        return used;
    }

    content.sound = {
        soundId:
            sound.data.soundId,

        ownerUid:
            sound.data.ownerUid,

        ownerName:
            sound.data.ownerName,

        title:
            sound.data.title
    };

    return {
        success: true,
        content: content
    };
}

module.exports = {
    attachSound
};

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const soundSystem = require("./sound-system");

const app = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if (!fs.existsSync("user.json")) {
    console.log("No Fan Made account found.");
    app.close();
    process.exit();
}

const user = JSON.parse(
    fs.readFileSync("user.json", "utf8")
);

function uploadSound() {

    if (user.accountType !== "creator") {
        console.log(
            "\nCreator access required. 👑"
        );
        app.close();
        return;
    }

    app.question(
        "Sound file path: ",
        (filePath) => {

            filePath = filePath.trim();

            if (!filePath) {
                console.log(
                    "\nSound path cannot be empty."
                );
                app.close();
                return;
            }

            if (!fs.existsSync(filePath)) {
                console.log(
                    "\nSound file not found."
                );
                app.close();
                return;
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
                console.log(
                    "\nUnsupported sound format."
                );
                app.close();
                return;
            }

            app.question(
                "Sound title: ",
                (title) => {

                    title = title.trim();

                    if (!title) {
                        console.log(
                            "\nSound title cannot be empty."
                        );
                        app.close();
                        return;
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

                    try {

                        fs.copyFileSync(
                            filePath,
                            destination
                        );

                    } catch (error) {

                        console.log(
                            "\nSound upload failed."
                        );

                        console.log(
                            error.message
                        );

                        app.close();
                        return;
                    }

                    const settings =
                        fs.existsSync("settings.json")
                            ? JSON.parse(
                                fs.readFileSync(
                                    "settings.json",
                                    "utf8"
                                )
                            )
                            : null;

                    const allowFanUse =
                        settings &&
                        settings.creatorSettings
                            ? settings.creatorSettings
                                .allowFanSoundUse === true
                            : false;

                    const sound = {
                        soundId: soundId,

                        ownerUid:
                            user.uid,

                        ownerName:
                            user.name,

                        title:
                            title,

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

                    console.log(
                        "\nSound uploaded! 🎵👑"
                    );

                    console.log(
                        "Sound ID:",
                        soundId
                    );

                    console.log(
                        "Fan use:",
                        allowFanUse
                            ? "ON"
                            : "OFF"
                    );

                    app.close();
                }
            );
        }
    );
}

uploadSound();

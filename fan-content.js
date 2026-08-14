const fs = require("fs");
const path = require("path");
const readline = require("readline");

const soundBridge = require("./sound-bridge");
const contentSound = require("./content-sound");

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

if (!fs.existsSync("content")) {
    fs.mkdirSync("content");
}

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

function getAvailableSounds() {
    return soundBridge.getAvailableSounds();
}

function createFanContent() {

    const sounds = getAvailableSounds();

    console.log("\n===== CREATE FAN CONTENT 🎬 =====");

    if (sounds.length === 0) {
        console.log(
            "No creator sounds are currently available for fan use."
        );
        app.close();
        return;
    }

    app.question(
        "Content title: ",
        (title) => {

            title = title.trim();

            if (!title) {
                console.log("Title cannot be empty.");
                app.close();
                return;
            }

            app.question(
                "Description: ",
                (description) => {

                    description = description.trim();

                    console.log(
                        "\n===== CHOOSE SOUND 🎵 ====="
                    );

                    sounds.forEach(
                        (sound, index) => {

                            console.log(
                                `${index + 1}. ${sound.data.title}`
                            );

                            console.log(
                                `   Creator: ${sound.data.ownerName}`
                            );

                            console.log(
                                `   Sound ID: ${sound.data.soundId}`
                            );
                        }
                    );

                    app.question(
                        "\nChoose a sound: ",
                        (answer) => {

                            const index =
                                Number(answer) - 1;

                            if (
                                index < 0 ||
                                index >= sounds.length
                            ) {
                                console.log(
                                    "Invalid sound."
                                );
                                app.close();
                                return;
                            }

                            const selected =
                                sounds[index];

                            app.question(
                                "\nVideo file path: ",
                                (filePath) => {

                                    filePath =
                                        filePath.trim();

                                    if (!filePath) {
                                        console.log(
                                            "Video path cannot be empty."
                                        );
                                        app.close();
                                        return;
                                    }

                                    if (
                                        !fs.existsSync(
                                            filePath
                                        )
                                    ) {
                                        console.log(
                                            "\nVideo file not found."
                                        );
                                        app.close();
                                        return;
                                    }

                                    const extension =
                                        path.extname(
                                            filePath
                                        ).toLowerCase();

                                    const allowedFormats = [
                                        ".mp4",
                                        ".mkv",
                                        ".webm",
                                        ".mov"
                                    ];

                                    if (
                                        !allowedFormats.includes(
                                            extension
                                        )
                                    ) {
                                        console.log(
                                            "\nUnsupported video format."
                                        );
                                        app.close();
                                        return;
                                    }

                                    const MAX_SIZE =
                                        120 * 1024 * 1024;

                                    const fileStats =
                                        fs.statSync(
                                            filePath
                                        );

                                    if (
                                        fileStats.size >
                                        MAX_SIZE
                                    ) {
                                        console.log(
                                            "\nVideo is too large."
                                        );

                                        console.log(
                                            "Maximum size is 120 MB."
                                        );

                                        app.close();
                                        return;
                                    }

                                    const contentId =
                                        "FAN-CONTENT-" +
                                        Date.now();

                                    const newFileName =
                                        contentId +
                                        extension;

                                    const destination =
                                        path.join(
                                            "uploads",
                                            newFileName
                                        );

                                    try {

                                        fs.copyFileSync(
                                            filePath,
                                            destination
                                        );

                                    } catch (error) {

                                        console.log(
                                            "\nVideo upload failed."
                                        );

                                        console.log(
                                            error.message
                                        );

                                        app.close();
                                        return;
                                    }

                                    const content = {

                                        contentId:
                                            contentId,
contentType:
    "fan",

                                        ownerUid:
                                            user.uid,

                                        creatorName:
                                            user.name,

                                        title:
                                            title,

                                        description:
                                            description,

                                        video: {

                                            fileName:
                                                newFileName,

                                            filePath:
                                                destination,

                                            duration: 0
                                        },

                                        thumbnail:
                                            null,

                                        sound:
                                            null,

                                        views:
                                            0,

                                        viewedBy:
                                            [],

                                        likes:
                                            [],

                                        comments:
                                            [],

                                        notifications:
                                            [],

                                        watchlist:
                                            [],
sharing: {
    copyCount: 0,
    copiedBy: []
},

                                        playback: {

                                            resumePosition:
                                                0,

                                            allowedSpeeds: [
                                                0.5,
                                                0.75,
                                                1,
                                                1.25,
                                                1.5,
                                                2,
                                                3,
                                                4,
                                                5
                                            ]
                                        },

                                        createdAt:
                                            new Date()
                                                .toISOString()
                                    };

                                    const result =
                                        contentSound.attachSound(
                                            content,
                                            selected.data.soundId,
                                            user.uid
                                        );

                                    if (!result.success) {

                                        console.log(
                                            "\n" +
                                            result.message
                                        );

                                        fs.unlinkSync(
                                            destination
                                        );

                                        app.close();
                                        return;
                                    }

                                    fs.writeFileSync(
                                        `content/${contentId}.json`,
                                        JSON.stringify(
                                            content,
                                            null,
                                            2
                                        )
                                    );

                                    console.log(
                                        "\nFan content created! 🎬🔥"
                                    );

                                    console.log(
                                        "Content ID:",
                                        content.contentId
                                    );

                                    console.log(
                                        "Video:",
                                        content.video.fileName
                                    );

                                    console.log(
                                        "Sound:",
                                        content.sound.title
                                    );

                                    console.log(
                                        "Sound creator:",
                                        content.sound.ownerName
                                    );

                                    app.close();
                                }
                            );
                        }
                    );
                }
            );
        }
    );
}

createFanContent();

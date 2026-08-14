const fs = require("fs");
const readline = require("readline");
const soundBridge = require("./sound-bridge");
const contentSound = require("./content-sound");

const app = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if (!fs.existsSync("user.json")) {
    console.log("No Fan Made account found.");
    process.exit();
}

const user = JSON.parse(
    fs.readFileSync("user.json", "utf8")
);

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
        return;
    }

    app.question(
        "Content title: ",
        (title) => {

            if (!title.trim()) {
                console.log("Title cannot be empty.");
                return;
            }

            app.question(
                "Description: ",
                (description) => {

                    console.log("\n===== CHOOSE SOUND 🎵 =====");

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
                                return;
                            }

                            const selected =
                                sounds[index];

                            const content = {
                                contentId:
                                    "FAN-CONTENT-" +
                                    Date.now(),

                                ownerUid:
                                    user.uid,

                                creatorName:
                                    user.name,

                                title:
                                    title.trim(),

                                description:
                                    description.trim(),

                                sound: null,

                                views: 0,

                                viewedBy: [],

                                likes: [],

                                comments: [],

                                notifications: [],

                                watchlist: [],

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
                                return;
                            }

                            const fileName =
                                content.contentId +
                                ".json";

                            fs.writeFileSync(
                                `content/${fileName}`,
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
                                "Sound:",
                                content.sound.title
                            );

                            console.log(
                                "Sound creator:",
                                content.sound.ownerName
                            );
                        }
                    );
                }
            );
        }
    );
}

createFanContent();

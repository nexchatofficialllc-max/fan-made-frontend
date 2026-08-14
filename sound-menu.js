const readline = require("readline");
const soundManager = require("./sound-manager");

const app = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showSoundMenu() {
    console.log("\n===== FAN MADE SOUNDS 🎵 =====");
    console.log("1. Upload sound");
    console.log("2. View my sounds");
    console.log("3. Allow fans to use a sound");
    console.log("4. Stop fans from using a sound");
    console.log("5. Exit");

    app.question(
        "\nChoose an option: ",
        handleChoice
    );
}

function uploadSound() {
    app.question(
        "\nSound file path: ",
        (filePath) => {

            filePath = filePath.trim();

            app.question(
                "Sound title: ",
                (title) => {

                    try {

                        const sound =
                            soundManager.uploadSound(
                                filePath,
                                title
                            );

                        console.log(
                            "\nSound uploaded! 🎵👑"
                        );

                        console.log(
                            "Sound ID:",
                            sound.data.soundId
                        );

                        console.log(
                            "Fan use:",
                            sound.data.allowFanUse
                                ? "ON"
                                : "OFF"
                        );

                    } catch (error) {

                        console.log(
                            "\n" + error.message
                        );
                    }

                    showSoundMenu();
                }
            );
        }
    );
}

function viewMySounds() {

    const sounds =
        soundManager.getMySounds();

    console.log(
        "\n===== MY SOUNDS ====="
    );

    if (sounds.length === 0) {
        console.log(
            "You haven't uploaded any sounds yet."
        );
        showSoundMenu();
        return;
    }

    sounds.forEach(
        (sound, index) => {

            console.log(
                `\n${index + 1}. ${sound.data.title}`
            );

            console.log(
                "Sound ID:",
                sound.data.soundId
            );

            console.log(
                "Fan use:",
                sound.data.allowFanUse
                    ? "ON"
                    : "OFF"
            );

            console.log(
                "Used by:",
                sound.data.usedBy.length,
                "fans"
            );
        }
    );

    showSoundMenu();
}

function changeFanPermission(allowed) {

    const sounds =
        soundManager.getMySounds();

    if (sounds.length === 0) {

        console.log(
            "\nNo sounds available."
        );

        showSoundMenu();
        return;
    }

    sounds.forEach(
        (sound, index) => {

            console.log(
                `${index + 1}. ${sound.data.title} — Fan use: ${
                    sound.data.allowFanUse
                        ? "ON"
                        : "OFF"
                }`
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
                    "\nInvalid sound."
                );

                showSoundMenu();
                return;
            }

            try {

                const updated =
                    soundManager
                        .setFanUsePermission(
                            sounds[index]
                                .data.soundId,
                            allowed
                        );

                console.log(
                    "\nFan use:",
                    updated.data.allowFanUse
                        ? "ON 🎵"
                        : "OFF 🔒"
                );

            } catch (error) {

                console.log(
                    "\n" + error.message
                );
            }

            showSoundMenu();
        }
    );
}

function handleChoice(choice) {

    if (choice === "1") {

        uploadSound();

    } else if (choice === "2") {

        viewMySounds();

    } else if (choice === "3") {

        changeFanPermission(true);

    } else if (choice === "4") {

        changeFanPermission(false);

    } else if (choice === "5") {

        console.log(
            "\nGoodbye! 👑"
        );

        app.close();

    } else {

        console.log(
            "\nInvalid option."
        );

        showSoundMenu();
    }
}

showSoundMenu();

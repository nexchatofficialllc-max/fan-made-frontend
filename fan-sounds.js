const readline = require("readline");
const soundBridge = require("./sound-bridge");

const app = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if (!require("fs").existsSync("user.json")) {
    console.log("No Fan Made account found.");
    app.close();
    process.exit();
}

const user = JSON.parse(
    require("fs").readFileSync(
        "user.json",
        "utf8"
    )
);

function showSounds() {

    const sounds =
        soundBridge.getAvailableSounds();

    console.log(
        "\n===== AVAILABLE FAN SOUNDS 🎵 ====="
    );

    if (sounds.length === 0) {
        console.log(
            "No sounds are currently available for fan use."
        );

        app.close();
        return;
    }

    sounds.forEach(
        (sound, index) => {

            console.log(
                `\n${index + 1}. ${sound.data.title}`
            );

            console.log(
                "Creator:",
                sound.data.ownerName
            );

            console.log(
                "Used by:",
                sound.data.usedBy.length,
                "fans"
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

                app.close();
                return;
            }

            const sound =
                sounds[index];

            const result =
                soundBridge.useSound(
                    sound,
                    user.uid
                );

            if (!result.success) {

                console.log(
                    "\n" + result.message
                );

                app.close();
                return;
            }

            console.log(
                "\nSound selected! 🎵🔥"
            );

            console.log(
                "Sound:",
                result.title
            );

            console.log(
                "Original creator:",
                result.ownerName
            );

            console.log(
                "Sound ID:",
                result.soundId
            );

            app.close();
        }
    );
}

showSounds();

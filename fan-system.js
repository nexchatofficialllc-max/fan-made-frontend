const fs = require("fs");

const user = JSON.parse(
    fs.readFileSync("user.json", "utf8")
);

function loadProfile(uid) {
    const file = `profiles/${uid}.json`;

    if (!fs.existsSync(file)) {
        return null;
    }

    return JSON.parse(
        fs.readFileSync(file, "utf8")
    );
}

function saveProfile(profile) {
    const file =
        `profiles/${profile.uid}.json`;

    fs.writeFileSync(
        file,
        JSON.stringify(profile, null, 2)
    );
}

function fanUser(targetUid) {
    if (targetUid === user.uid) {
        console.log(
            "\nYou cannot fan yourself."
        );
        return;
    }

    const profile =
        loadProfile(targetUid);

    if (!profile) {
        console.log(
            "\nProfile not found."
        );
        return;
    }

    if (!Array.isArray(profile.followers)) {
        profile.followers = [];
    }

    if (
        profile.followers.includes(user.uid)
    ) {
        profile.followers =
            profile.followers.filter(
                uid => uid !== user.uid
            );

        console.log(
            "\nUnfanned successfully. 👋"
        );
    } else {
        profile.followers.push(
            user.uid
        );

        console.log(
            "\nYou are now a Fan! 🔥"
        );
    }

    saveProfile(profile);

    console.log(
        "Total Fans:",
        profile.followers.length
    );
}

fanUser("FM-TEST01");

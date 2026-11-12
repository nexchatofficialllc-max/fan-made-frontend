const fs = require("fs");
const readline = require("readline");
const soundBridge = require("./sound-bridge");

const app = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (!fs.existsSync("user.json")) {
  console.log("No Loopa account found.");
  app.close();
  process.exit(1);
}

const user = JSON.parse(fs.readFileSync("user.json", "utf8"));

function ask(q) {
  return new Promise((res) => app.question(q, (a) => res(a)));
}

async function showSounds() {
  const sounds = soundBridge.getAvailableSounds();

  console.log("\n===== AVAILABLE SOUNDS 🎵 =====");

  if (sounds.length === 0) {
    console.log("No sounds are currently available for fan use.");
    app.close();
    return;
  }

  sounds.forEach((sound, index) => {
    console.log(`\n${index + 1}. ${sound.data.title}`);
    console.log("Creator:", sound.data.ownerName);
    console.log("Used by:", sound.data.usedBy.length, "fans");
  });

  const answer = await ask("\nChoose a sound (or 0 to exit): ");
  const index = Number(answer) - 1;

  if (answer.trim() === "0") {
    console.log("\nGoodbye!");
    app.close();
    return;
  }

  if (index < 0 || index >= sounds.length) {
    console.log("\nInvalid sound. Try again.");
    return showSounds();
  }

  const sound = sounds[index];
  const result = soundBridge.useSound(sound, user.uid);

  if (!result.success) {
    console.log("\n" + result.message);
    return showSounds();
  }

  console.log("\nSound selected! 🎵");
  console.log("Sound:", result.title);
  console.log("Original creator:", result.ownerName);
  console.log("Sound ID:", result.soundId);
  app.close();
}

showSounds();
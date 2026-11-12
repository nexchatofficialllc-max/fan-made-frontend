const readline = require("readline");
const soundManager = require("./sound-manager");

const app = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(q) {
  return new Promise((res) => app.question(q, (a) => res(a)));
}

function showSoundMenu() {
  console.log("\n===== LOOPA SOUNDS 🎵 =====");
  console.log("1. Upload sound");
  console.log("2. View my sounds");
  console.log("3. Allow fans to use a sound");
  console.log("4. Stop fans from using a sound");
  console.log("5. Exit");
  app.question("\nChoose an option: ", handleChoice);
}

async function uploadSound() {
  const filePath = (await ask("\nSound file path: ")).trim();
  const title = (await ask("Sound title: ")).trim();

  if (!filePath || !title) {
    console.log("\nFile path and title are required.");
    return showSoundMenu();
  }

  try {
    const sound = soundManager.uploadSound(filePath, title);
    console.log("\nSound uploaded! 🎵");
    console.log("Sound ID:", sound.data.soundId);
    console.log("Fan use:", sound.data.allowFanUse ? "ON" : "OFF");
  } catch (error) {
    console.log("\n" + error.message);
  }
  showSoundMenu();
}

function viewMySounds() {
  const sounds = soundManager.getMySounds();
  console.log("\n===== MY SOUNDS =====");

  if (sounds.length === 0) {
    console.log("You haven't uploaded any sounds yet.");
    return showSoundMenu();
  }

  sounds.forEach((sound, index) => {
    console.log(`\n${index + 1}. ${sound.data.title}`);
    console.log("Sound ID:", sound.data.soundId);
    console.log("Fan use:", sound.data.allowFanUse ? "ON" : "OFF");
    console.log("Used by:", sound.data.usedBy.length, "fans");
  });
  showSoundMenu();
}

async function changeFanPermission(allowed) {
  const sounds = soundManager.getMySounds();

  if (sounds.length === 0) {
    console.log("\nNo sounds available.");
    return showSoundMenu();
  }

  sounds.forEach((sound, index) => {
    console.log(`${index + 1}. ${sound.data.title} — Fan use: ${sound.data.allowFanUse ? "ON" : "OFF"}`);
  });

  const answer = await ask("\nChoose a sound: ");
  const index = Number(answer) - 1;

  if (index < 0 || index >= sounds.length) {
    console.log("\nInvalid sound.");
    return showSoundMenu();
  }

  try {
    const updated = soundManager.setFanUsePermission(sounds[index].data.soundId, allowed);
    console.log("\nFan use:", updated.data.allowFanUse ? "ON 🎵" : "OFF 🔒");
  } catch (error) {
    console.log("\n" + error.message);
  }
  showSoundMenu();
}

function handleChoice(choice) {
  if (choice === "1") return uploadSound();
  if (choice === "2") return viewMySounds();
  if (choice === "3") return changeFanPermission(true);
  if (choice === "4") return changeFanPermission(false);
  if (choice === "5") {
    console.log("\nGoodbye! 👋");
    return app.close();
  }
  console.log("\nInvalid option.");
  showSoundMenu();
}

showSoundMenu();
const fs = require("fs");
const path = require("path");
const readline = require("readline");

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

async function uploadSound() {
  if (user.accountType !== "creator") {
    console.log("\nCreator access required. Only Creators can upload sounds.");
    app.close();
    return;
  }

  if (!fs.existsSync("sounds")) fs.mkdirSync("sounds", { recursive: true });

  const filePath = (await ask("Sound file path: ")).trim();
  if (!filePath) {
    console.log("\nSound path cannot be empty.");
    return uploadSound();
  }
  if (!fs.existsSync(filePath)) {
    console.log("\nSound file not found. Try again.");
    return uploadSound();
  }

  const extension = path.extname(filePath).toLowerCase();
  const allowedFormats = [".mp3", ".wav", ".m4a", ".ogg"];
  if (!allowedFormats.includes(extension)) {
    console.log("\nUnsupported sound format. Use .mp3, .wav, .m4a, or .ogg");
    return uploadSound();
  }

  const title = (await ask("Sound title: ")).trim();
  if (!title) {
    console.log("\nSound title cannot be empty.");
    return uploadSound();
  }

  const soundId = "SND-" + Date.now();
  const newFileName = soundId + extension;
  const destination = path.join("sounds", newFileName);

  try {
    fs.copyFileSync(filePath, destination);
  } catch (error) {
    console.log("\nSound upload failed.");
    console.log(error.message);
    app.close();
    return;
  }

  const settings = fs.existsSync("settings.json")
    ? JSON.parse(fs.readFileSync("settings.json", "utf8"))
    : null;

  const allowFanUse = settings?.creatorSettings?.allowFanSoundUse === true;

  const sound = {
    soundId,
    ownerUid: user.uid,
    ownerName: user.name,
    title,
    fileName: newFileName,
    filePath: destination,
    allowFanUse,
    usedBy: [],
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(`sounds/${soundId}.json`, JSON.stringify(sound, null, 2));

  console.log("\nSound uploaded! 🎵");
  console.log("Sound ID:", soundId);
  console.log("Fan use:", allowFanUse ? "ON" : "OFF");
  app.close();
}

uploadSound();
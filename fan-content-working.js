const fs = require("fs");
const readline = require("readline");
const soundBridge = require("./sound-bridge");
const contentSound = require("./content-sound");

const app = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (!fs.existsSync("user.json")) {
  console.log("No Loopa account found.");
  process.exit(1);
}

const user = JSON.parse(fs.readFileSync("user.json", "utf8"));

function ask(q) {
  return new Promise((res) => app.question(q, (a) => res(a)));
}

async function createFanContent() {
  const sounds = soundBridge.getAvailableSounds();

  console.log("\n===== CREATE FAN CONTENT 🎬 =====");

  if (sounds.length === 0) {
    console.log("No creator sounds are currently available for fan use.");
    app.close();
    return;
  }

  const title = (await ask("Content title: ")).trim();
  if (!title) {
    console.log("Title cannot be empty.");
    app.close();
    return;
  }

  const description = (await ask("Description: ")).trim();

  console.log("\n===== CHOOSE SOUND 🎵 =====");
  sounds.forEach((sound, index) => {
    console.log(`${index + 1}. ${sound.data.title}`);
    console.log(`   Creator: ${sound.data.ownerName}`);
    console.log(`   Sound ID: ${sound.data.soundId}`);
  });

  const answer = await ask("\nChoose a sound: ");
  const index = Number(answer) - 1;
  if (index < 0 || index >= sounds.length) {
    console.log("Invalid sound.");
    app.close();
    return;
  }

  const selected = sounds[index];

  const content = {
    contentId: "LOOPA-CONTENT-" + Date.now(),
    ownerUid: user.uid,
    creatorName: user.name,
    title,
    description,
    sound: null,
    views: 0,
    viewedBy: [],
    likes: [],
    comments: [],
    notifications: [],
    watchlist: [],
    createdAt: new Date().toISOString(),
  };

  const result = contentSound.attachSound(content, selected.data.soundId, user.uid);
  if (!result.success) {
    console.log("\n" + result.message);
    app.close();
    return;
  }

  if (!fs.existsSync("content")) fs.mkdirSync("content", { recursive: true });
  const fileName = content.contentId + ".json";
  fs.writeFileSync(`content/${fileName}`, JSON.stringify(content, null, 2));

  console.log("\nFan content created! 🎬");
  console.log("Content ID:", content.contentId);
  console.log("Sound:", content.sound.title);
  console.log("Sound creator:", content.sound.ownerName);
  app.close();
}

createFanContent();
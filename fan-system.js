const fs = require("fs");

const user = JSON.parse(fs.readFileSync("user.json", "utf8"));

function loadProfile(uid) {
  const file = `profiles/${uid}.json`;
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveProfile(profile) {
  const file = `profiles/${profile.uid}.json`;
  if (!fs.existsSync("profiles")) fs.mkdirSync("profiles");
  fs.writeFileSync(file, JSON.stringify(profile, null, 2));
}

function fanUser(targetUid) {
  if (!targetUid) {
    console.log("\nUsage: node fan.js <TARGET_UID>");
    console.log("Example: node fan.js FM-TEST01");
    return;
  }

  if (targetUid === user.uid) {
    console.log("\nYou cannot fan yourself.");
    return;
  }

  const target = loadProfile(targetUid);
  if (!target) {
    console.log("\nProfile not found.");
    return;
  }

  const me = loadProfile(user.uid) || { uid: user.uid, name: user.name, fans: [], creators: [] };

  // Loopa naming: followers -> fans, following -> creators
  // Migrate old data if it still uses old names
  if (!Array.isArray(target.fans)) target.fans = Array.isArray(target.followers) ? target.followers : [];
  if (!Array.isArray(me.creators)) me.creators = Array.isArray(me.following) ? me.following : [];
  delete target.followers;
  delete me.following;

  if (target.fans.includes(user.uid)) {
    // Unfan — remove from both sides
    target.fans = target.fans.filter((uid) => uid !== user.uid);
    me.creators = me.creators.filter((uid) => uid !== targetUid);
    console.log("\nUnfanned successfully. 👋");
  } else {
    // Fan — add to both sides
    target.fans.push(user.uid);
    if (!me.creators.includes(targetUid)) me.creators.push(targetUid);
    console.log("\nYou are now a Fan! 🔥");
  }

  saveProfile(target);
  saveProfile(me);

  console.log("Total Fans:", target.fans.length);
  console.log("You fan:", me.creators.length, "Creators");
}

// Use CLI arg: node fan.js FM-TEST01 — falls back to FM-TEST01 if none
fanUser(process.argv[2] || "FM-TEST01");
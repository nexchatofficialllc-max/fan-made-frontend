const fs = require("fs");
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
const settingsFile = "settings.json";

function createSettings() {
  const settings = {
    uid: user.uid,
    notifications: true,
    privacy: "public",
    security: { loginAlerts: true },
    creatorSettings: {
      creatorMode: user.accountType === "creator",
      allowFanSoundUse: true,
      allowFanTemplateUse: true,
    },
    appPreferences: {
      theme: "black", // Loopa: "black" or "white" — not "system"
      autoplay: true,
    },
  };
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
  return settings;
}

function loadSettings() {
  if (!fs.existsSync(settingsFile)) return createSettings();
  const settings = JSON.parse(fs.readFileSync(settingsFile, "utf8"));
  if (settings.uid !== user.uid) {
    console.log("Settings belong to a different account.");
    app.close();
    process.exit(1);
  }
  // Migrate old settings — fill missing blocks so it never crashes
  if (!settings.security) settings.security = { loginAlerts: true };
  if (!settings.creatorSettings) settings.creatorSettings = { creatorMode: user.accountType === "creator", allowFanSoundUse: true, allowFanTemplateUse: true };
  if (!settings.appPreferences) settings.appPreferences = { theme: "black", autoplay: true };
  if (settings.appPreferences.theme === "system") settings.appPreferences.theme = "black";
  return settings;
}

let settings = loadSettings();

function saveSettings() {
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
}

function showSettings() {
  console.log("\n===== LOOPA SETTINGS =====");
  console.log("1. Account");
  console.log("2. Profile");
  console.log("3. Email");
  console.log("4. UID");
  console.log("5. Notifications");
  console.log("6. Privacy");
  console.log("7. Security");
  console.log("8. Creator Settings");
  console.log("9. App Preferences");
  console.log("10. Sign Out");
  console.log("11. Exit");
  app.question("\nChoose an option: ", handleChoice);
}

function handleChoice(choice) {
  if (choice === "1") {
    console.log("\n===== ACCOUNT =====");
    console.log("Name:", user.name);
    console.log("Account type:", user.accountType);
    console.log("UID:", user.uid);
    showSettings();
  } else if (choice === "2") {
    if (fs.existsSync("profile.json")) {
      const profile = JSON.parse(fs.readFileSync("profile.json", "utf8"));
      console.log("\n===== PROFILE =====");
      console.log("Name:", profile.name);
      console.log("Username:", profile.username);
      console.log("Bio:", profile.bio);
      console.log("UID:", profile.uid);
    } else {
      console.log("\nNo profile found.");
    }
    showSettings();
  } else if (choice === "3") {
    console.log("\n===== EMAIL =====");
    console.log("Email authentication is not connected yet.");
    showSettings();
  } else if (choice === "4") {
    console.log("\n===== UID =====");
    console.log("Your Loopa UID:", user.uid);
    console.log("This UID belongs to your existing account.");
    showSettings();
  } else if (choice === "5") {
    settings.notifications = !settings.notifications;
    saveSettings();
    console.log("\nNotifications:", settings.notifications ? "ON" : "OFF");
    showSettings();
  } else if (choice === "6") {
    app.question("Privacy (public/private): ", (privacy) => {
      privacy = privacy.toLowerCase().trim();
      if (privacy !== "public" && privacy !== "private") {
        console.log("Invalid privacy option.");
      } else {
        settings.privacy = privacy;
        saveSettings();
        console.log("\nPrivacy updated!");
      }
      showSettings();
    });
  } else if (choice === "7") {
    console.log("\n===== SECURITY =====");
    console.log("Login alerts:", settings.security.loginAlerts ? "ON" : "OFF");
    console.log("More security features will be added later.");
    showSettings();
  } else if (choice === "8") {
    console.log("\n===== CREATOR SETTINGS =====");
    if (user.accountType !== "creator") {
      console.log("\nCreator access required. Only Creators can change these.");
      showSettings();
      return;
    }
    console.log("Creator mode:", settings.creatorSettings.creatorMode ? "ON" : "OFF");
    console.log("1. Allow fans to use my sounds:", settings.creatorSettings.allowFanSoundUse ? "ON" : "OFF");
    console.log("2. Allow fans to use my templates:", settings.creatorSettings.allowFanTemplateUse ? "ON" : "OFF");
    console.log("3. Back");
    app.question("\nChoose an option: ", (creatorChoice) => {
      if (creatorChoice === "1") {
        settings.creatorSettings.allowFanSoundUse = !settings.creatorSettings.allowFanSoundUse;
        saveSettings();
        console.log("\nFan sound permission:", settings.creatorSettings.allowFanSoundUse ? "ON 🎵" : "OFF 🔒");
        showSettings();
      } else if (creatorChoice === "2") {
        settings.creatorSettings.allowFanTemplateUse = !settings.creatorSettings.allowFanTemplateUse;
        saveSettings();
        console.log("\nFan template permission:", settings.creatorSettings.allowFanTemplateUse ? "ON 📦" : "OFF 🔒");
        showSettings();
      } else if (creatorChoice === "3") {
        showSettings();
      } else {
        console.log("\nInvalid option.");
        showSettings();
      }
    });
  } else if (choice === "9") {
    console.log("\n===== APP PREFERENCES =====");
    console.log("Theme:", settings.appPreferences.theme, "(Loopa: black / white)");
    console.log("Autoplay:", settings.appPreferences.autoplay ? "ON" : "OFF");
    console.log("1. Toggle theme (black / white)");
    console.log("2. Toggle autoplay");
    console.log("3. Back");
    app.question("\nChoose an option: ", (prefChoice) => {
      if (prefChoice === "1") {
        settings.appPreferences.theme = settings.appPreferences.theme === "black" ? "white" : "black";
        saveSettings();
        console.log("\nTheme:", settings.appPreferences.theme);
        showSettings();
      } else if (prefChoice === "2") {
        settings.appPreferences.autoplay = !settings.appPreferences.autoplay;
        saveSettings();
        console.log("\nAutoplay:", settings.appPreferences.autoplay ? "ON" : "OFF");
        showSettings();
      } else if (prefChoice === "3") {
        showSettings();
      } else {
        console.log("\nInvalid option.");
        showSettings();
      }
    });
  } else if (choice === "10") {
    console.log("\nSign out will be connected to the real authentication system later.");
    showSettings();
  } else if (choice === "11") {
    console.log("Goodbye!");
    app.close();
  } else {
    console.log("Invalid option.");
    showSettings();
  }
}

showSettings();
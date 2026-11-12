const fs = require("fs");
const readline = require("readline");

const CONTENT_DIR = "content";

const user = JSON.parse(fs.readFileSync("user.json", "utf8"));

const app = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(q) {
  return new Promise((res) => app.question(q, (a) => res(a)));
}

function getContents() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({
      file,
      data: JSON.parse(fs.readFileSync(`${CONTENT_DIR}/${file}`, "utf8")),
    }));
}

function saveContent(item) {
  fs.writeFileSync(`${CONTENT_DIR}/${item.file}`, JSON.stringify(item.data, null, 2));
}

function prepareViews(content) {
  if (typeof content.views !== "number") content.views = 0;
  if (!Array.isArray(content.viewers)) content.viewers = [];
}

async function viewContent() {
  const list = getContents();
  if (!list.length) {
    console.log("\nNo content available.");
    return menu();
  }

  console.log("\n===== CONTENT =====");
  list.forEach((item, i) => {
    prepareViews(item.data);
    console.log(`${i + 1}. ${item.data.title} — ${item.data.views} views • ${item.data.viewers.length} viewers`);
  });

  const n = Number(await ask("\nChoose content to watch: ")) - 1;
  if (n < 0 || n >= list.length) {
    console.log("Invalid content.");
    return menu();
  }

  const item = list[n];
  prepareViews(item.data);

  const alreadyViewed = item.data.viewers.includes(user.uid);
  if (!alreadyViewed) {
    item.data.viewers.push(user.uid);
    item.data.views = item.data.viewers.length;
    saveContent(item);
    console.log(`\n▶ Watching: ${item.data.title}`);
    console.log(`+1 view! Total views: ${item.data.views}`);
  } else {
    console.log(`\n▶ Re-watching: ${item.data.title}`);
    console.log(`You already counted. Total views: ${item.data.views} (unique viewers)`);
  }
  return menu();
}

async function showViews() {
  const list = getContents();
  if (!list.length) {
    console.log("\nNo content available.");
    return menu();
  }
  console.log("\n===== VIEWS =====");
  list.forEach((item) => {
    prepareViews(item.data);
    console.log(`${item.data.title} — ${item.data.views} views • ${item.data.viewers.length} unique viewers`);
  });
  return menu();
}

async function menu() {
  console.log(`
===== LOOPA VIEWS =====
UID: ${user.uid}
1. ▶ Watch content (+1 view)
2. 📊 View all views
3. Exit
`);
  const answer = await ask("Choose: ");
  if (answer === "1") return viewContent();
  if (answer === "2") return showViews();
  if (answer === "3") {
    app.close();
    return;
  }
  console.log("Invalid option.");
  return menu();
}

console.log("Loopa View System");
console.log("UID:", user.uid);
menu();
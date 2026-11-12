const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let user;
try {
  user = JSON.parse(fs.readFileSync("user.json", "utf8"));
} catch {
  console.log("❌ user.json not found. Create it first: { \"uid\": \"U1\", \"name\": \"You\" }");
  process.exit(1);
}

if (!fs.existsSync("content")) fs.mkdirSync("content");

function contents() {
  return fs.readdirSync("content")
    .filter((f) => f.endsWith(".json"))
    .map((file) => ({
      file,
      data: JSON.parse(fs.readFileSync(`content/${file}`, "utf8")),
    }));
}

function save(item) {
  fs.writeFileSync(`content/${item.file}`, JSON.stringify(item.data, null, 2));
}

function setup(data) {
  if (!Array.isArray(data.comments)) data.comments = [];
  for (const c of data.comments) {
    if (!Array.isArray(c.likes)) c.likes = [];
    if (!Array.isArray(c.replies)) c.replies = [];
    for (const r of c.replies) {
      if (!Array.isArray(r.likes)) r.likes = [];
    }
  }
}

function ask(q) {
  return new Promise((res) => rl.question(q, (a) => res(a)));
}

async function chooseContent() {
  const list = contents();
  if (!list.length) {
    console.log("\nNo content available.");
    return null;
  }
  console.log("\n===== CONTENT =====");
  list.forEach((item, i) => console.log(`${i + 1}. ${item.data.title}`));
  const answer = await ask("\nChoose content: ");
  const n = Number(answer) - 1;
  if (n < 0 || n >= list.length) {
    console.log("Invalid content.");
    return null;
  }
  setup(list[n].data);
  return list[n];
}

async function addComment() {
  const item = await chooseContent();
  if (!item) return menu();
  const text = (await ask("Write comment: ")).trim();
  if (!text) {
    console.log("Comment cannot be empty.");
    return menu();
  }
  item.data.comments.push({
    commentId: "COMMENT-" + Date.now(),
    uid: user.uid,
    username: user.name,
    text,
    likes: [],
    replies: [],
    createdAt: new Date().toISOString(),
  });
  save(item);
  console.log("\n💬 Comment added!");
  return menu();
}

async function likeComment() {
  const item = await chooseContent();
  if (!item) return menu();
  const comments = item.data.comments;
  if (!comments.length) {
    console.log("\nNo comments.");
    return menu();
  }
  comments.forEach((c, i) => {
    console.log(`${i + 1}. ${c.username}: ${c.text}`);
    console.log(`   ❤ ${c.likes.length}`);
  });
  const n = Number(await ask("\nChoose comment: ")) - 1;
  if (n < 0 || n >= comments.length) {
    console.log("Invalid comment.");
    return menu();
  }
  const c = comments[n];
  const pos = c.likes.indexOf(user.uid);
  if (pos === -1) {
    c.likes.push(user.uid);
    console.log("\n❤ Comment liked!");
  } else {
    c.likes.splice(pos, 1);
    console.log("\n💔 Comment unliked!");
  }
  save(item);
  console.log(`Likes: ${c.likes.length}`);
  return menu();
}

async function reply() {
  const item = await chooseContent();
  if (!item) return menu();
  const comments = item.data.comments;
  if (!comments.length) {
    console.log("\nNo comments.");
    return menu();
  }
  comments.forEach((c, i) => console.log(`${i + 1}. ${c.username}: ${c.text}`));
  const n = Number(await ask("\nChoose comment: ")) - 1;
  if (n < 0 || n >= comments.length) {
    console.log("Invalid comment.");
    return menu();
  }
  const text = (await ask("Write reply: ")).trim();
  if (!text) {
    console.log("Reply cannot be empty.");
    return menu();
  }
  comments[n].replies.push({
    replyId: "REPLY-" + Date.now(),
    uid: user.uid,
    username: user.name,
    text,
    likes: [],
    createdAt: new Date().toISOString(),
  });
  save(item);
  console.log("\n↩ Reply added!");
  return menu();
}

async function likeReply() {
  const item = await chooseContent();
  if (!item) return menu();
  const replies = [];
  item.data.comments.forEach((c) => {
    c.replies.forEach((r) => replies.push({ r }));
  });
  if (!replies.length) {
    console.log("\nNo replies.");
    return menu();
  }
  replies.forEach((x, i) => {
    console.log(`${i + 1}. ${x.r.username}: ${x.r.text}`);
    console.log(`   ❤ ${x.r.likes.length}`);
  });
  const n = Number(await ask("\nChoose reply: ")) - 1;
  if (n < 0 || n >= replies.length) {
    console.log("Invalid reply.");
    return menu();
  }
  const r = replies[n].r;
  const pos = r.likes.indexOf(user.uid);
  if (pos === -1) {
    r.likes.push(user.uid);
    console.log("\n❤ Reply liked!");
  } else {
    r.likes.splice(pos, 1);
    console.log("\n💔 Reply unliked!");
  }
  save(item);
  console.log(`Likes: ${r.likes.length}`);
  return menu();
}

async function askFami() {
  const item = await chooseContent();
  if (!item) return menu();
  const q = (await ask("Ask @fami about this video: ")).trim();
  if (!q) {
    console.log("Question cannot be empty.");
    return menu();
  }
  item.data.comments.push({
    commentId: "COMMENT-" + Date.now(),
    uid: "fami",
    username: "@fami",
    text: `Fami here — you asked: "${q}". This video is "${item.data.title}". Want me to find similar loops?`,
    likes: [],
    replies: [],
    createdAt: new Date().toISOString(),
    isFami: true,
  });
  save(item);
  console.log("\n🤖 @fami replied!");
  return menu();
}

async function showComments() {
  const item = await chooseContent();
  if (!item) return menu();
  console.log(`\n===== ${item.data.title} =====`);
  if (!item.data.comments.length) {
    console.log("No comments.");
    return menu();
  }
  item.data.comments.forEach((c) => {
    console.log(`\n💬 ${c.username}: ${c.text}`);
    console.log(`❤ ${c.likes.length}`);
    c.replies.forEach((r) => {
      console.log(`   ↳ ${r.username}: ${r.text}`);
      console.log(`      ❤ ${r.likes.length}`);
    });
  });
  return menu();
}

async function menu() {
  console.log(`
===== LOOPA COMMENTS =====
1. 💬 Add comment
2. ❤ Like / Unlike comment
3. ↩ Reply to comment
4. ❤ Like / Unlike reply
5. 🤖 Ask @fami
6. 💬 View comments and replies
7. Exit
`);
  const answer = await ask("Choose: ");
  if (answer === "1") return addComment();
  if (answer === "2") return likeComment();
  if (answer === "3") return reply();
  if (answer === "4") return likeReply();
  if (answer === "5") return askFami();
  if (answer === "6") return showComments();
  if (answer === "7") {
    rl.close();
    return;
  }
  console.log("Invalid option.");
  return menu();
}

console.log("Loopa UID:", user.uid);
menu();
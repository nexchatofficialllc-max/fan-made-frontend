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

if (!fs.existsSync("community")) fs.mkdirSync("community");

function ask(q) {
  return new Promise((res) => app.question(q, (a) => res(a)));
}

function getPosts() {
  return fs.readdirSync("community").filter((file) => file.endsWith(".json"));
}

function loadPost(file) {
  const post = JSON.parse(fs.readFileSync(`community/${file}`, "utf8"));
  if (!Array.isArray(post.likes)) post.likes = [];
  if (!Array.isArray(post.comments)) post.comments = [];
  if (typeof post.views !== "number") post.views = 0;
  if (!Array.isArray(post.viewedBy)) post.viewedBy = [];
  return post;
}

function savePost(file, post) {
  fs.writeFileSync(`community/${file}`, JSON.stringify(post, null, 2));
}

async function createPost() {
  const content = (await ask("What do you want to post? ")).trim();
  if (!content) {
    console.log("Post cannot be empty.");
    return showMenu();
  }
  const postId = "POST-" + Date.now();
  const post = {
    postId,
    ownerUid: user.uid,
    authorName: user.name,
    content,
    likes: [],
    comments: [],
    views: 0,
    viewedBy: [],
    createdAt: new Date().toISOString(),
  };
  savePost(`${postId}.json`, post);
  console.log("\nPost created!");
  console.log("Post ID:", postId);
  showMenu();
}

async function viewPosts() {
  const files = getPosts();
  console.log("\n===== LOOPA COMMUNITY =====");
  if (files.length === 0) {
    console.log("No community posts yet.");
    return showMenu();
  }
  files.forEach((file, index) => {
    const post = loadPost(file);
    // Count a view when you view the list — once per user
    if (!post.viewedBy.includes(user.uid)) {
      post.viewedBy.push(user.uid);
      post.views = post.viewedBy.length;
      savePost(file, post);
    }
    console.log("\n--------------------");
    console.log("Number:", index + 1);
    console.log("Post ID:", post.postId);
    console.log("Author:", post.authorName);
    console.log("Content:", post.content);
    console.log("Likes:", post.likes.length);
    console.log("Comments:", post.comments.length);
    console.log("Views:", post.views);
  });
  showMenu();
}

async function likePost() {
  const files = getPosts();
  if (files.length === 0) {
    console.log("\nNo posts available.");
    return showMenu();
  }
  console.log("\n===== LIKE POST =====");
  files.forEach((file, index) => {
    const post = loadPost(file);
    console.log(`${index + 1}. ${post.content} ❤ ${post.likes.length}`);
  });
  const index = Number(await ask("\nChoose a post: ")) - 1;
  if (index < 0 || index >= files.length) {
    console.log("Invalid post.");
    return showMenu();
  }
  const file = files[index];
  const post = loadPost(file);
  if (post.likes.includes(user.uid)) {
    post.likes = post.likes.filter((uid) => uid !== user.uid);
    console.log("\nPost unliked.");
  } else {
    post.likes.push(user.uid);
    console.log("\nPost liked! ❤");
  }
  savePost(file, post);
  console.log("Likes:", post.likes.length);
  showMenu();
}

async function commentOnPost() {
  const files = getPosts();
  if (files.length === 0) {
    console.log("\nNo posts available.");
    return showMenu();
  }
  console.log("\n===== COMMENT ON POST =====");
  files.forEach((file, index) => {
    const post = loadPost(file);
    console.log(`${index + 1}. ${post.content}`);
  });
  const index = Number(await ask("\nChoose a post: ")) - 1;
  if (index < 0 || index >= files.length) {
    console.log("Invalid post.");
    return showMenu();
  }
  const file = files[index];
  const post = loadPost(file);
  const text = (await ask("Write your comment: ")).trim();
  if (!text) {
    console.log("Comment cannot be empty.");
    return showMenu();
  }
  post.comments.push({
    commentId: "COMMENT-" + Date.now(),
    uid: user.uid,
    name: user.name,
    text,
    createdAt: new Date().toISOString(),
  });
  savePost(file, post);
  console.log("\nComment added! 💬");
  showMenu();
}

async function viewComments() {
  const files = getPosts();
  if (files.length === 0) {
    console.log("\nNo posts available.");
    return showMenu();
  }
  console.log("\n===== VIEW COMMENTS =====");
  files.forEach((file, index) => {
    const post = loadPost(file);
    console.log(`${index + 1}. ${post.content} (${post.comments.length} comments)`);
  });
  const index = Number(await ask("\nChoose a post: ")) - 1;
  if (index < 0 || index >= files.length) {
    console.log("Invalid post.");
    return showMenu();
  }
  const post = loadPost(files[index]);
  console.log("\n===== COMMENTS =====");
  if (post.comments.length === 0) {
    console.log("No comments yet.");
  } else {
    post.comments.forEach((comment, number) => {
      console.log("\n" + (number + 1) + ".");
      console.log("Name:", comment.name);
      console.log("UID:", comment.uid);
      console.log("Comment:", comment.text);
    });
  }
  showMenu();
}

function showMenu() {
  console.log("\n===== LOOPA COMMUNITY =====");
  console.log("1. Create post");
  console.log("2. View posts");
  console.log("3. Like / Unlike post");
  console.log("4. Comment on post");
  console.log("5. View comments");
  console.log("6. Exit");
  app.question("\nChoose an option: ", handleChoice);
}

function handleChoice(choice) {
  if (choice === "1") return createPost();
  if (choice === "2") return viewPosts();
  if (choice === "3") return likePost();
  if (choice === "4") return commentOnPost();
  if (choice === "5") return viewComments();
  if (choice === "6") {
    console.log("Goodbye!");
    return app.close();
  }
  console.log("Invalid option.");
  showMenu();
}

showMenu();
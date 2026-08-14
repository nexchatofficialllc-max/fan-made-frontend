const fs = require("fs");
const readline = require("readline");

const app = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if (!fs.existsSync("user.json")) {
    console.log("No Fan Made account found.");
    app.close();
    process.exit();
}

const user = JSON.parse(
    fs.readFileSync("user.json", "utf8")
);

if (!fs.existsSync("community")) {
    fs.mkdirSync("community");
}

function getPosts() {
    return fs.readdirSync("community")
        .filter(file => file.endsWith(".json"));
}

function createPost() {
    app.question("What do you want to post? ", (content) => {

        if (!content.trim()) {
            console.log("Post cannot be empty.");
            showMenu();
            return;
        }

        const postId = "POST-" + Date.now();

        const post = {
            postId: postId,
            ownerUid: user.uid,
            authorName: user.name,
            content: content.trim(),
            likes: [],
            comments: [],
            views: 0,
            viewedBy: [],
            createdAt: new Date().toISOString()
        };

        fs.writeFileSync(
            `community/${postId}.json`,
            JSON.stringify(post, null, 2)
        );

        console.log("\nPost created!");
        console.log("Post ID:", postId);

        showMenu();
    });
}

function viewPosts() {
    const files = getPosts();

    console.log("\n===== FAN MADE COMMUNITY =====");

    if (files.length === 0) {
        console.log("No community posts yet.");
        showMenu();
        return;
    }

    files.forEach((file, index) => {
        const post = JSON.parse(
            fs.readFileSync(`community/${file}`, "utf8")
        );

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

function likePost() {
    const files = getPosts();

    if (files.length === 0) {
        console.log("\nNo posts available.");
        showMenu();
        return;
    }

    console.log("\n===== LIKE POST =====");

    files.forEach((file, index) => {
        const post = JSON.parse(
            fs.readFileSync(`community/${file}`, "utf8")
        );

        console.log(
            `${index + 1}. ${post.content} ❤️ ${post.likes.length}`
        );
    });

    app.question("\nChoose a post: ", (answer) => {

        const index = Number(answer) - 1;

        if (index < 0 || index >= files.length) {
            console.log("Invalid post.");
            showMenu();
            return;
        }

        const file = files[index];

        const post = JSON.parse(
            fs.readFileSync(`community/${file}`, "utf8")
        );

        const alreadyLiked = post.likes.includes(user.uid);

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                uid => uid !== user.uid
            );

            console.log("\nPost unliked.");
        } else {
            post.likes.push(user.uid);

            console.log("\nPost liked! ❤️");
        }

        fs.writeFileSync(
            `community/${file}`,
            JSON.stringify(post, null, 2)
        );

        console.log("Likes:", post.likes.length);

        showMenu();
    });
}

function commentOnPost() {
    const files = getPosts();

    if (files.length === 0) {
        console.log("\nNo posts available.");
        showMenu();
        return;
    }

    console.log("\n===== COMMENT ON POST =====");

    files.forEach((file, index) => {
        const post = JSON.parse(
            fs.readFileSync(`community/${file}`, "utf8")
        );

        console.log(
            `${index + 1}. ${post.content}`
        );
    });

    app.question("\nChoose a post: ", (answer) => {

        const index = Number(answer) - 1;

        if (index < 0 || index >= files.length) {
            console.log("Invalid post.");
            showMenu();
            return;
        }

        const file = files[index];

        const post = JSON.parse(
            fs.readFileSync(`community/${file}`, "utf8")
        );

        app.question("Write your comment: ", (text) => {

            if (!text.trim()) {
                console.log("Comment cannot be empty.");
                showMenu();
                return;
            }

            const comment = {
                commentId: "COMMENT-" + Date.now(),
                uid: user.uid,
                name: user.name,
                text: text.trim(),
                createdAt: new Date().toISOString()
            };

            post.comments.push(comment);

            fs.writeFileSync(
                `community/${file}`,
                JSON.stringify(post, null, 2)
            );

            console.log("\nComment added! 💬");

            showMenu();
        });
    });
}

function viewComments() {
    const files = getPosts();

    if (files.length === 0) {
        console.log("\nNo posts available.");
        showMenu();
        return;
    }

    console.log("\n===== VIEW COMMENTS =====");

    files.forEach((file, index) => {
        const post = JSON.parse(
            fs.readFileSync(`community/${file}`, "utf8")
        );

        console.log(
            `${index + 1}. ${post.content} (${post.comments.length} comments)`
        );
    });

    app.question("\nChoose a post: ", (answer) => {

        const index = Number(answer) - 1;

        if (index < 0 || index >= files.length) {
            console.log("Invalid post.");
            showMenu();
            return;
        }

        const file = files[index];

        const post = JSON.parse(
            fs.readFileSync(`community/${file}`, "utf8")
        );

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
    });
}

function showMenu() {
    console.log("\n===== FAN MADE COMMUNITY =====");
    console.log("1. Create post");
    console.log("2. View posts");
    console.log("3. Like / Unlike post");
    console.log("4. Comment on post");
    console.log("5. View comments");
    console.log("6. Exit");

    app.question("\nChoose an option: ", handleChoice);
}

function handleChoice(choice) {
    if (choice === "1") {
        createPost();
    } else if (choice === "2") {
        viewPosts();
    } else if (choice === "3") {
        likePost();
    } else if (choice === "4") {
        commentOnPost();
    } else if (choice === "5") {
        viewComments();
    } else if (choice === "6") {
        console.log("Goodbye!");
        app.close();
    } else {
        console.log("Invalid option.");
        showMenu();
    }
}

showMenu();

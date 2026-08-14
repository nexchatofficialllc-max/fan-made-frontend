const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const user = JSON.parse(
    fs.readFileSync("user.json", "utf8")
);

function contents() {
    return fs.readdirSync("content")
        .filter(f => f.endsWith(".json"))
        .map(file => ({
            file,
            data: JSON.parse(
                fs.readFileSync(`content/${file}`, "utf8")
            )
        }));
}

function save(item) {
    fs.writeFileSync(
        `content/${item.file}`,
        JSON.stringify(item.data, null, 2)
    );
}

function setup(data) {
    if (!Array.isArray(data.comments)) {
        data.comments = [];
    }

    for (const c of data.comments) {
        if (!Array.isArray(c.likes)) c.likes = [];
        if (!Array.isArray(c.replies)) c.replies = [];

        for (const r of c.replies) {
            if (!Array.isArray(r.likes)) r.likes = [];
        }
    }
}

function chooseContent(callback) {
    const list = contents();

    if (!list.length) {
        console.log("\nNo content available.");
        return;
    }

    console.log("\n===== CONTENT =====");

    list.forEach((item, i) => {
        console.log(`${i + 1}. ${item.data.title}`);
    });

    rl.question("\nChoose content: ", answer => {
        const n = Number(answer) - 1;

        if (n < 0 || n >= list.length) {
            console.log("Invalid content.");
            return;
        }

        setup(list[n].data);
        callback(list[n]);
    });
}

function likeComment() {
    chooseContent(item => {
        const comments = item.data.comments;

        if (!comments.length) {
            console.log("\nNo comments.");
            return;
        }

        comments.forEach((c, i) => {
            console.log(
                `${i + 1}. ${c.username}: ${c.text}`
            );
            console.log(`   ❤️ ${c.likes.length}`);
        });

        rl.question("\nChoose comment: ", answer => {
            const n = Number(answer) - 1;

            if (n < 0 || n >= comments.length) {
                console.log("Invalid comment.");
                return;
            }

            const c = comments[n];
            const pos = c.likes.indexOf(user.uid);

            if (pos === -1) {
                c.likes.push(user.uid);
                console.log("\n❤️ Comment liked!");
            } else {
                c.likes.splice(pos, 1);
                console.log("\n💔 Comment unliked!");
            }

            save(item);
            console.log(`Likes: ${c.likes.length}`);
        });
    });
}

function reply() {
    chooseContent(item => {
        const comments = item.data.comments;

        if (!comments.length) {
            console.log("\nNo comments.");
            return;
        }

        comments.forEach((c, i) => {
            console.log(`${i + 1}. ${c.username}: ${c.text}`);
        });

        rl.question("\nChoose comment: ", answer => {
            const n = Number(answer) - 1;

            if (n < 0 || n >= comments.length) {
                console.log("Invalid comment.");
                return;
            }

            rl.question("Write reply: ", text => {
                text = text.trim();

                if (!text) {
                    console.log("Reply cannot be empty.");
                    return;
                }

                comments[n].replies.push({
                    replyId: "REPLY-" + Date.now(),
                    uid: user.uid,
                    username: user.name,
                    text,
                    likes: [],
                    createdAt: new Date().toISOString()
                });

                save(item);
                console.log("\n↩️ Reply added!");
            });
        });
    });
}

function likeReply() {
    chooseContent(item => {
        const replies = [];

        item.data.comments.forEach((c, ci) => {
            c.replies.forEach((r, ri) => {
                replies.push({ c, r, ci, ri });
            });
        });

        if (!replies.length) {
            console.log("\nNo replies.");
            return;
        }

        replies.forEach((x, i) => {
            console.log(
                `${i + 1}. ${x.r.username}: ${x.r.text}`
            );
            console.log(`   ❤️ ${x.r.likes.length}`);
        });

        rl.question("\nChoose reply: ", answer => {
            const n = Number(answer) - 1;

            if (n < 0 || n >= replies.length) {
                console.log("Invalid reply.");
                return;
            }

            const r = replies[n].r;
            const pos = r.likes.indexOf(user.uid);

            if (pos === -1) {
                r.likes.push(user.uid);
                console.log("\n❤️ Reply liked!");
            } else {
                r.likes.splice(pos, 1);
                console.log("\n💔 Reply unliked!");
            }

            save(item);
            console.log(`Likes: ${r.likes.length}`);
        });
    });
}

function showComments() {
    chooseContent(item => {
        console.log(`\n===== ${item.data.title} =====`);

        if (!item.data.comments.length) {
            console.log("No comments.");
            return;
        }

        item.data.comments.forEach(c => {
            console.log(`\n💬 ${c.username}: ${c.text}`);
            console.log(`❤️ ${c.likes.length}`);

            c.replies.forEach(r => {
                console.log(`   ↳ ${r.username}: ${r.text}`);
                console.log(`      ❤️ ${r.likes.length}`);
            });
        });
    });
}

function menu() {
    console.log(`
===== FAN MADE COMMENTS 2.0 =====
1. ❤️ Like / Unlike comment
2. ↩️ Reply to comment
3. ❤️ Like / Unlike reply
4. 💬 View comments and replies
5. Exit
`);

    rl.question("Choose: ", answer => {
        if (answer === "1") {
                       likeComment();
        } else if (answer === "2") {
            reply();
        } else if (answer === "3") {
            likeReply();
        } else if (answer === "4") {
            showComments();
        } else if (answer === "5") {
            rl.close();
            return;
        } else {
            console.log("Invalid option.");
        }
;
    });
}

console.log("Fan Made UID:", user.uid);
menu();

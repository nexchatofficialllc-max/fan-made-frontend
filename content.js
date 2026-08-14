const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { spawn } = require("child_process");
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

if (!fs.existsSync("content")) {
    fs.mkdirSync("content");
}

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

if (!fs.existsSync("thumbnails")) {
    fs.mkdirSync("thumbnails");
}

function getAllContent() {
    const files = fs.readdirSync("content")
        .filter(file => file.endsWith(".json"));

    const results = [];

    for (const file of files) {
        const content = JSON.parse(
            fs.readFileSync(
                `content/${file}`,
                "utf8"
            )
        );

        if (!Array.isArray(content.watchlist)) {
            content.watchlist = [];
        }

        if (!Array.isArray(content.likes)) {
            content.likes = [];
        }

        if (!Array.isArray(content.comments)) {
            content.comment = [];
        }
if (!Array.isArray(content.comments)) {
    content.comments = [];
}

content.comments.forEach((comment) => {
    if (!Array.isArray(comment.replies)) {
        comment.replies = [];
    }
comment.replies.forEach((reply) => {
    if (!Array.isArray(reply.likes)) {
        reply.likes = [];
    }
});
});
        results.push({
            file: file,
            data: content
        });
    }

    return results;
}

function getMyContent() {
    return getAllContent().filter(
        item => item.data.ownerUid === user.uid
    );
}

function isCreator() {
    return user.accountType === "creator";
}
function saveContent(item) {
    fs.writeFileSync(
        `content/${item.file}`,
        JSON.stringify(
            item.data,
            null,
            2
        )
    );
}

function uploadVideo() {

    if (!isCreator()) {
        console.log(
            "\nCreator access required. 👑"
        );
        showMenu();
        return;
    }

    app.question(
        "Video file path: ",
        (filePath) => {

            filePath = filePath.trim();

            if (!filePath) {
                console.log(
                    "Video path cannot be empty."
                );
                showMenu();
                return;
            }

            if (!fs.existsSync(filePath)) {
                console.log(
                    "\nVideo file not found."
                );
                showMenu();
                return;
            }

            const extension =
                path.extname(filePath)
                    .toLowerCase();

            const allowedFormats = [
                ".mp4",
                ".mkv",
                ".webm",
                ".mov"
            ];

            if (
                !allowedFormats.includes(
                    extension
                )
            ) {
                console.log(
                    "\nUnsupported video format."
                );
                showMenu();
                return;
            }

            app.question(
                "Content title: ",
                (title) => {

                    if (!title.trim()) {
                        console.log(
                            "Title cannot be empty."
                        );
                        showMenu();
                        return;
                    }

                    app.question(
                        "Description: ",
                        (description) => {

                            const contentId =
                                "CONTENT-" +
                                Date.now();

                            const newFileName =
                                contentId +
                                extension;

                            const destination =
                                path.join(
                                    "uploads",
                                    newFileName
                                );

                            try {
                                fs.copyFileSync(
                                    filePath,
                                    destination
                                );
                            } catch (error) {
                                console.log(
                                    "\nUpload failed."
                                );
                                console.log(
                                    error.message
                                );
                                showMenu();
                                return;
                            }

                            const content = {
                                contentId:
                                    contentId,
contentType:
    "creator",

                                ownerUid:
                                    user.uid,

                                creatorName:
                                    user.name,

                                title:
                                    title.trim(),

                                description:
                                    description.trim(),

                                video: {
                                    fileName:
                                        newFileName,

                                    filePath:
                                        destination,

                                    duration: 0
                                },

thumbnail: null,

sound: null,

views: 0,

                                viewedBy: [],
likes: [],
comments: [],
notifications: [],
watchlist: [],
sharing: {
    copyCount: 0,
    copiedBy: []
},

                                playback: {
                                    resumePosition: 0,

                                    allowedSpeeds: [
                                        0.5,
                                        0.75,
                                        1,
                                        1.25,
                                        1.5,
                                        2,
                                        3,
                                        4,
                                        5
                                    ]
                                },

                                createdAt:
                                    new Date()
                                        .toISOString()
                            };

                            fs.writeFileSync(
                                `content/${contentId}.json`,
                                JSON.stringify(
                                    content,
                                    null,
                                    2
                                )
                            );

                            console.log(
                                "\nUpload complete! 🎬"
                            );

                            console.log(
                                "Content ID:",
                                contentId
                            );

                            showMenu();
                        }
                    );
                }
            );
        }
    );
}

function viewMyContent() {
    const contents =
        getMyContent();

    console.log(
        "\n===== MY CONTENT ====="
    );

    if (contents.length === 0) {
        console.log(
            "You have no content."
        );
        showMenu();
        return;
    }

    contents.forEach(
        (item, index) => {

            console.log(
                "\n--------------------"
            );

            console.log(
                "Number:",
                index + 1
            );
console.log(
    "Content Type:",
    item.data.contentType === "fan"
        ? "🎬 FAN CONTENT"
        : "👑 CREATOR CONTENT"
);

            console.log(
                "Content ID:",
                item.data.contentId
            );

            console.log(
                "Title:",
                item.data.title
            );

            console.log(
                "Description:",
                item.data.description
            );

            console.log(
                "Thumbnail:",
                item.data.thumbnail ||
                "None"
            );

            console.log(
                "Likes:",
                item.data.likes.length
            );

            console.log(
                "Comments:",
                item.data.comments.length
            );

            console.log(
                "Views:",
                item.data.views
            );
        }
    );

    showMenu();
}

function editContent() {
    const contents =
        getMyContent();

    if (contents.length === 0) {
        console.log(
            "\nYou have no content to edit."
        );
        showMenu();
        return;
    }

    console.log(
        "\n===== EDIT CONTENT ====="
    );

    contents.forEach(
        (item, index) => {

            console.log(
                `${index + 1}. ` +
                `${item.data.title}`
            );
        }
    );

    app.question(
        "\nChoose content: ",
        (answer) => {

            const index =
                Number(answer) - 1;

            if (
                index < 0 ||
                index >= contents.length
            ) {
                console.log(
                    "Invalid content."
                );
                showMenu();
                return;
            }

            const selected =
                contents[index];

            app.question(
                `New title ` +
                `(${selected.data.title}): `,
                (title) => {

                    app.question(
                        `New description ` +
                        `(${selected.data.description}): `,
                        (description) => {

                            if (
                                title.trim()
                            ) {
                                selected.data.title =
                                    title.trim();
                            }

                            if (
                                description.trim()
                            ) {
                                selected.data.description =
                                    description.trim();
                            }

                            saveContent(
                                selected
                            );

                            console.log(
                                "\nContent updated! ✏️"
                            );

                            showMenu();
                        }
                    );
                }
            );
        }
    );
}

function addThumbnail() {
    const contents =
        getMyContent();

    if (contents.length === 0) {
        console.log(
            "\nYou have no content."
        );
        showMenu();
        return;
    }

    console.log(
        "\n===== ADD THUMBNAIL ====="
    );

    contents.forEach(
        (item, index) => {

            console.log(
                `${index + 1}. ` +
                `${item.data.title}`
            );
        }
    );

    app.question(
        "\nChoose content: ",
        (answer) => {

            const index =
                Number(answer) - 1;

            if (
                index < 0 ||
                index >= contents.length
            ) {
                console.log(
                    "Invalid content."
                );
                showMenu();
                return;
            }

            const selected =
                contents[index];

            app.question(
                "Thumbnail file path: ",
                (thumbnailPath) => {

                    thumbnailPath =
                        thumbnailPath.trim();

                    if (
                        !thumbnailPath
                    ) {
                        console.log(
                            "Thumbnail path " +
                            "cannot be empty."
                        );
                        showMenu();
                        return;
                    }

                    if (
                        !fs.existsSync(
                            thumbnailPath
                        )
                    ) {
                        console.log(
                            "\nThumbnail file " +
                            "not found."
                        );
                        showMenu();
                        return;
                    }

                    const extension =
                        path.extname(
                            thumbnailPath
                        ).toLowerCase();

                    const allowedImages = [
                        ".jpg",
                        ".jpeg",
                        ".png",
                        ".webp"
                    ];

                    if (
                        !allowedImages.includes(
                            extension
                        )
                    ) {
                        console.log(
                            "\nUnsupported " +
                            "image format."
                        );
                        showMenu();
                        return;
                    }

                    const newFileName =
                        selected.data.contentId +
                        "-thumbnail" +
                        extension;

                    const destination =
                        path.join(
                            "thumbnails",
                            newFileName
                        );

                    try {
                        fs.copyFileSync(
                            thumbnailPath,
                            destination
                        );
                    } catch (error) {
                        console.log(
                            "\nThumbnail " +
                            "upload failed."
                        );
                        console.log(
                            error.message
                        );
                        showMenu();
                        return;
                    }

                    selected.data.thumbnail =
                        destination;

                    saveContent(
                        selected
                    );

                    console.log(
                        "\nThumbnail added! 🖼️"
                    );

                    showMenu();
                }
            );
        }
    );
}

function manageWatchlist() {
    const contents =
        getAllContent();

    if (contents.length === 0) {
        console.log(
            "\nNo content available."
        );
        showMenu();
        return;
    }

    console.log(
        "\n===== WATCHLIST ====="
    );

    contents.forEach(
        (item, index) => {

            const saved =
                item.data.watchlist
                    .includes(user.uid);

            console.log(
                `${index + 1}. ` +
                `${item.data.title} ` +
                `${saved ? "⭐" : ""}`
            );
        }
    );

    app.question(
        "\nChoose content: ",
        (answer) => {

            const index =
                Number(answer) - 1;

            if (
                index < 0 ||
                index >= contents.length
            ) {
                console.log(
                    "Invalid content."
                );
                showMenu();
                return;
            }

            const selected =
                contents[index];

            const alreadySaved =
                selected.data.watchlist
                    .includes(user.uid);

            if (alreadySaved) {

                selected.data.watchlist =
                    selected.data.watchlist
                        .filter(
                            uid =>
                                uid !== user.uid
                        );

                console.log(
                    "\nRemoved from " +
                    "watchlist. ⭐"
                );

            } else {

                selected.data.watchlist
                    .push(user.uid);

                console.log(
                    "\nAdded to watchlist! ⭐"
                );
            }

            saveContent(
                selected
            );

            showMenu();
        }
    );
}

function viewWatchlist() {
    const contents =
        getAllContent();

    const saved =
        contents.filter(
            item =>
                item.data.watchlist
                    .includes(user.uid)
        );

    console.log(
        "\n===== MY WATCHLIST ====="
    );

    if (saved.length === 0) {
        console.log(
            "Your watchlist is empty."
        );
        showMenu();
        return;
    }

    saved.forEach(
        (item, index) => {

            console.log(
                `${index + 1}. ⭐ ` +
                `${item.data.title}`
            );

            console.log(
                "   Creator:",
                item.data.creatorName
            );

            console.log(
                "   Content ID:",
                item.data.contentId
            );
        }
    );

    showMenu();
}

function manageLike() {
    const contents =
        getAllContent();

    if (contents.length === 0) {
        console.log(
            "\nNo content available."
        );
        showMenu();
        return;
    }

    console.log(
        "\n===== CONTENT LIKES ====="
    );

    contents.forEach(
        (item, index) => {

            const liked =
                item.data.likes
                    .includes(user.uid);

            console.log(
                `${index + 1}. ` +
                `${item.data.title} ` +
                `❤️ ${item.data.likes.length}` +
                `${liked ? "  Liked" : ""}`
            );
        }
    );

    app.question(
        "\nChoose content: ",
        (answer) => {

            const index =
                Number(answer) - 1;

            if (
                index < 0 ||
                index >= contents.length
            ) {
                console.log(
                    "Invalid content."
                );
                showMenu();
                return;
            }

            const selected =
                contents[index];

            const alreadyLiked =
                selected.data.likes
                    .includes(user.uid);

            if (alreadyLiked) {

                selected.data.likes =
                    selected.data.likes
                        .filter(
                            uid =>
                                uid !== user.uid
                        );

                console.log(
                    "\nLike removed. 💔"
                );
} else {

    selected.data.likes
        .push(user.uid);

    if (
        selected.data.ownerUid &&
        selected.data.ownerUid !== user.uid
    ) {
        addNotification(
            selected.data,
            selected.data.ownerUid,
            "like",
            `${user.uid} liked your content "${selected.data.title}".`
        );
    }

    console.log(
        "\nContent liked! ❤️"
    );
}

            saveContent(
                selected
            );

            console.log(
                "Total likes:",
                selected.data.likes.length
            );

            showMenu();
        }
    );
}

function viewLikedContent() {
    const contents =
        getAllContent();

    const liked =
        contents.filter(
            item =>
                item.data.likes
                    .includes(user.uid)
        );

    console.log(
        "\n===== CONTENT I LIKED ====="
    );

    if (liked.length === 0) {
        console.log(
            "You haven't liked any content."
        );
        showMenu();
        return;
    }

    liked.forEach(
        (item, index) => {

            console.log(
                `${index + 1}. ❤️ ` +
                `${item.data.title}`
            );

            console.log(
                "   Creator:",
                item.data.creatorName
            );

            console.log(
                "   Total likes:",
                item.data.likes.length
            );
        }
    );

    showMenu();
}

function addComment() {
    const contents =
        getAllContent();

    if (contents.length === 0) {
        console.log(
            "\nNo content available."
        );
        showMenu();
        return;
    }

    console.log(
        "\n===== ADD COMMENT ====="
    );

    contents.forEach(
        (item, index) => {

            console.log(
                `${index + 1}. ` +
                `${item.data.title}`
            );
        }
    );

    app.question(
        "\nChoose content: ",
        (answer) => {

            const index =
                Number(answer) - 1;

            if (
                index < 0 ||
                index >= contents.length
            ) {
                console.log(
                    "Invalid content."
                );
                showMenu();
                return;
            }

            const selected =
                contents[index];

            app.question(
                "Write your comment: ",
                (text) => {

                    text = text.trim();

                    if (!text) {
                        console.log(
                            "Comment cannot be empty."
                        );
                        showMenu();
                        return;
                    }

                    const comment = {
                        commentId:
                            "COMMENT-" +
                            Date.now(),

                        uid:
                            user.uid,

                        username:
                            user.name,

                        text:
                            text,

                        createdAt:
                            new Date()
                                .toISOString()
                    };
selected.data.comments
    .push(comment);

if (
    selected.data.ownerUid &&
    selected.data.ownerUid !== user.uid
) {
    addNotification(
        selected.data,
        selected.data.ownerUid,
        "comment",
        `${user.uid} commented on your content "${selected.data.title}".`
    );
}

saveContent(
    selected
);

                    console.log(
                        "\nComment added! 💬"
                    );

                    showMenu();
                }
            );
        }
    );
}

function viewComments() {
    const contents =
        getAllContent();

    if (contents.length === 0) {
        console.log(
            "\nNo content available."
        );
        showMenu();
        return;
    }

    console.log(
        "\n===== VIEW COMMENTS ====="
    );

    contents.forEach(
        (item, index) => {

            console.log(
                `${index + 1}. ` +
                `${item.data.title} ` +
                `💬 ${item.data.comments.length}`
            );
        }
    );

    app.question(
        "\nChoose content: ",
        (answer) => {

            const index =
                Number(answer) - 1;

            if (
                index < 0 ||
                index >= contents.length
            ) {
                console.log(
                    "Invalid content."
                );
                showMenu();
                return;
            }

            const selected =
                contents[index];

            console.log(
                `\n===== COMMENTS: ` +
                `${selected.data.title} =====`
            );

            if (
                selected.data.comments.length ===
                0
            ) {
                console.log(
                    "No comments yet."
                );
                showMenu();
                return;
            }

selected.data.comments.forEach(
    (comment, commentIndex) => {

        console.log(
            `\n${commentIndex + 1}. ${comment.username}`
        );

        console.log(
            `   ${comment.text}`
        );

        console.log(
            `   UID: ${comment.uid}`
        );

        console.log(
            `   ${comment.createdAt}`
        );

        if (
            !Array.isArray(comment.replies) ||
            comment.replies.length === 0
        ) {
            console.log(
                "   ↩️ No replies yet."
            );
            return;
        }

        console.log(
            `   ↩️ Replies (${comment.replies.length}):`
        );

        comment.replies.forEach(
            (reply, replyIndex) => {

                console.log(
                    `      ${replyIndex + 1}. ${reply.username}`
                );

                console.log(
                    `         ${reply.text}`
                );

                console.log(
                    `         UID: ${reply.uid}`
                );

                console.log(
                    `         ${reply.createdAt}`
                );
            }
        );
    }
);

            showMenu();
        }
    );
}

function addReply() {
    const contents = getAllContent();

    if (contents.length === 0) {
        console.log("\nNo content available.");
        showMenu();
        return;
    }

    console.log("\n===== REPLY TO COMMENT =====");

    contents.forEach((item, index) => {
        console.log(
            `${index + 1}. ${item.data.title}`
        );
    });

    app.question(
        "\nChoose content: ",
        (answer) => {
            const index = Number(answer) - 1;

            if (
                index < 0 ||
                index >= contents.length
            ) {
                console.log("\nInvalid content.");
                showMenu();
                return;
            }

            const selected = contents[index];

            if (
                !Array.isArray(selected.data.comments) ||
                selected.data.comments.length === 0
            ) {
                console.log("\nNo comments yet.");
                showMenu();
                return;
            }

            console.log(
                `\n===== COMMENTS: ${selected.data.title} =====`
            );

            selected.data.comments.forEach(
                (comment, commentIndex) => {
                    console.log(
                        `\n${commentIndex + 1}. ${comment.username}`
                    );

                    console.log(
                        `   ${comment.text}`
                    );
                }
            );

            app.question(
                "\nChoose comment to reply to: ",
                (commentAnswer) => {
                    const commentIndex =
                        Number(commentAnswer) - 1;

                    if (
                        commentIndex < 0 ||
                        commentIndex >=
                            selected.data.comments.length
                    ) {
                        console.log(
                            "\nInvalid comment."
                        );
                        showMenu();
                        return;
                    }

                    const selectedComment =
                        selected.data.comments[
                            commentIndex
                        ];

                    app.question(
                        "Write your reply: ",
                        (text) => {
                            text = text.trim();

                            if (!text) {
                                console.log(
                                    "\nReply cannot be empty."
                                );
                                showMenu();
                                return;
                            }

                            if (
                                !Array.isArray(
                                    selectedComment.replies
                                )
                            ) {
                                selectedComment.replies = [];
                            }

                            const reply = {
                                replyId:
                                    "REPLY-" +
                                    Date.now(),

                                uid:
                                    user.uid,

                                username:
                                    user.name,

                                text:
                                    text,

                                createdAt:
                                    new Date()
                                        .toISOString()
                            };

                            selectedComment.replies.push(
                                reply
                            );

                            if (
                                selectedComment.uid &&
                                selectedComment.uid !==
                                    user.uid
                            ) {
                                addNotification(
                                    selected.data,
                                    selectedComment.uid,
                                    "reply",
                                    `${user.uid} replied to your comment on "${selected.data.title}".`
                                );
                            }

                            saveContent(
                                selected
                            );

                            console.log(
                                "\nReply added! ↩️"
                            );

                            showMenu();
                        }
                    );
                }
            );
        }
    );
}
function manageReplyLike() {
    const contents = getAllContent();

    if (contents.length === 0) {
        console.log("\nNo content available.");
        showMenu();
        return;
    }

    console.log("\n===== REPLY LIKES =====");

    contents.forEach((item, index) => {
        console.log(
            `${index + 1}. ${item.data.title}`
        );
    });

    app.question(
        "\nChoose content: ",
        (answer) => {
            const index = Number(answer) - 1;

            if (
                index < 0 ||
                index >= contents.length
            ) {
                console.log("\nInvalid content.");
                showMenu();
                return;
            }

            const selected = contents[index];

            if (
                !Array.isArray(selected.data.comments) ||
                selected.data.comments.length === 0
            ) {
                console.log("\nNo comments yet.");
                showMenu();
                return;
            }

            console.log(
                `\n===== COMMENTS: ${selected.data.title} =====`
            );

            selected.data.comments.forEach(
                (comment, commentIndex) => {
                    console.log(
                        `\n${commentIndex + 1}. ${comment.username}`
                    );

                    console.log(
                        `   ${comment.text}`
                    );

                    if (
                        Array.isArray(comment.replies)
                    ) {
                        comment.replies.forEach(
                            (reply, replyIndex) => {
                                if (
                                    !Array.isArray(
                                        reply.likes
                                    )
                                ) {
                                    reply.likes = [];
                                }

                                const liked =
                                    reply.likes.includes(
                                        user.uid
                                    );

                                console.log(
                                    `      ${replyIndex + 1}. ↩️ ${reply.username}: ${reply.text} ❤️ ${reply.likes.length}${liked ? " Liked" : ""}`
                                );
                            }
                        );
                    }
                }
            );

            app.question(
                "\nChoose comment: ",
                (commentAnswer) => {
                    const commentIndex =
                        Number(commentAnswer) - 1;

                    if (
                        commentIndex < 0 ||
                        commentIndex >=
                            selected.data.comments.length
                    ) {
                        console.log(
                            "\nInvalid comment."
                        );
                        showMenu();
                        return;
                    }

                    const selectedComment =
                        selected.data.comments[
                            commentIndex
                        ];

                    if (
                        !Array.isArray(
                            selectedComment.replies
                        ) ||
                        selectedComment.replies.length === 0
                    ) {
                        console.log(
                            "\nThis comment has no replies."
                        );
                        showMenu();
                        return;
                    }

                    app.question(
                        "\nChoose reply: ",
                        (replyAnswer) => {
                            const replyIndex =
                                Number(replyAnswer) - 1;

                            if (
                                replyIndex < 0 ||
                                replyIndex >=
                                    selectedComment
                                        .replies.length
                            ) {
                                console.log(
                                    "\nInvalid reply."
                                );
                                showMenu();
                                return;
                            }

                            const reply =
                                selectedComment.replies[
                                    replyIndex
                                ];

                            if (
                                !Array.isArray(
                                    reply.likes
                                )
                            ) {
                                reply.likes = [];
                            }

                            const alreadyLiked =
                                reply.likes.includes(
                                    user.uid
                                );

                            if (alreadyLiked) {
                                reply.likes =
                                    reply.likes.filter(
                                        uid =>
                                            uid !==
                                            user.uid
                                    );

                                console.log(
                                    "\nReply like removed. 💔"
                                );

                            } else {
                                reply.likes.push(
                                    user.uid
                                );

                                if (
                                    reply.uid &&
                                    reply.uid !==
                                        user.uid
                                ) {
                                    addNotification(
                                        selected.data,
                                        reply.uid,
                                        "reply_like",
                                        `${user.uid} liked your reply on "${selected.data.title}".`
                                    );
                                }

                                console.log(
                                    "\nReply liked! ❤️"
                                );
                            }

                            saveContent(selected);

                            console.log(
                                "Total reply likes:",
                                reply.likes.length
                            );

                            showMenu();
                        }
                    );
                }
            );
        }
    );
}
function deleteReply() {
    const contents = getAllContent();

    if (contents.length === 0) {
        console.log("\nNo content available.");
        showMenu();
        return;
    }

    console.log("\n===== DELETE MY REPLY =====");

    contents.forEach((item, index) => {
        console.log(
            `${index + 1}. ${item.data.title}`
        );
    });

    app.question(
        "\nChoose content: ",
        (answer) => {
            const index = Number(answer) - 1;

            if (
                index < 0 ||
                index >= contents.length
            ) {
                console.log("\nInvalid content.");
                showMenu();
                return;
            }

            const selected = contents[index];

            if (
                !Array.isArray(selected.data.comments) ||
                selected.data.comments.length === 0
            ) {
                console.log("\nNo comments available.");
                showMenu();
                return;
            }

            const myReplies = [];

            selected.data.comments.forEach(
                (comment, commentIndex) => {

                    if (
                        !Array.isArray(comment.replies)
                    ) {
                        return;
                    }

                    comment.replies.forEach(
                        (reply, replyIndex) => {

                            if (
                                reply.uid === user.uid
                            ) {
                                myReplies.push({
                                    commentIndex:
                                        commentIndex,
                                    replyIndex:
                                        replyIndex,
                                    reply:
                                        reply
                                });
                            }
                        }
                    );
                }
            );

            if (myReplies.length === 0) {
                console.log(
                    "\nYou have no replies to delete."
                );
                showMenu();
                return;
            }

            console.log(
                "\n===== MY REPLIES ====="
            );

            myReplies.forEach(
                (item, index) => {

                    console.log(
                        `\n${index + 1}. ${item.reply.text}`
                    );

                    console.log(
                        `   ${item.reply.createdAt}`
                    );
                }
            );

            app.question(
                "\nChoose reply to delete: ",
                (replyAnswer) => {

                    const replyIndex =
                        Number(replyAnswer) - 1;

                    if (
                        replyIndex < 0 ||
                        replyIndex >= myReplies.length
                    ) {
                        console.log(
                            "\nInvalid reply."
                        );
                        showMenu();
                        return;
                    }

                    const selectedReply =
                        myReplies[replyIndex];

                    const comment =
                        selected.data.comments[
                            selectedReply.commentIndex
                        ];

                    comment.replies =
                        comment.replies.filter(
                            reply =>
                                reply.replyId !==
                                selectedReply.reply.replyId
                        );

                    saveContent(selected);

                    console.log(
                        "\nReply deleted! 🗑️"
                    );

                    showMenu();
                }
            );
        }
    );
}
function deleteComment() {
    const contents =
        getAllContent();

    if (contents.length === 0) {
        console.log(
            "\nNo content available."
        );
        showMenu();
        return;
    }

    console.log(
        "\n===== DELETE MY COMMENT ====="
    );

    contents.forEach(
        (item, index) => {

            const myComments =
                item.data.comments.filter(
                    comment =>
                        comment.uid === user.uid
                );

            if (myComments.length > 0) {
                console.log(
                    `${index + 1}. ` +
                    `${item.data.title} ` +
                    `(${myComments.length} comment` +
                    `${myComments.length > 1 ? "s" : ""})`
                );
            }
        }
    );

    const hasComments =
        contents.some(
            item =>
                item.data.comments.some(
                    comment =>
                        comment.uid === user.uid
                )
        );

    if (!hasComments) {
        console.log(
            "\nYou have no comments to delete."
        );
        showMenu();
        return;
    }

    app.question(
        "\nChoose content: ",
        (answer) => {

            const index =
                Number(answer) - 1;

            if (
                index < 0 ||
                index >= contents.length
            ) {
                console.log(
                    "Invalid content."
                );
                showMenu();
                return;
            }

            const selected =
                contents[index];

            const myComments =
                selected.data.comments.filter(
                    comment =>
                        comment.uid === user.uid
                );

            if (myComments.length === 0) {
                console.log(
                    "\nYou have no comments " +
                    "on this content."
                );
                showMenu();
                return;
            }

            console.log(
                "\n===== YOUR COMMENTS ====="
            );

            myComments.forEach(
                (comment, commentIndex) => {

                    console.log(
                        `${commentIndex + 1}. ` +
                        `${comment.text}`
                    );
                }
            );

            app.question(
                "\nChoose comment: ",
                (commentAnswer) => {

                    const commentIndex =
                        Number(commentAnswer) - 1;

                    if (
                        commentIndex < 0 ||
                        commentIndex >=
                            myComments.length
                    ) {
                        console.log(
                            "Invalid comment."
                        );
                        showMenu();
                        return;
                    }

                    const selectedComment =
                        myComments[
                            commentIndex
                        ];

                    selected.data.comments =
                        selected.data.comments
                            .filter(
                                comment =>
                                    comment.commentId !==
                                    selectedComment.commentId
                            );

                    saveContent(
                        selected
                    );

                    console.log(
                        "\nComment deleted! 🗑️"
                    );

                    showMenu();
                }
            );
        }
    );
}

function deleteContent() {
    const contents =
        getMyContent();

    if (contents.length === 0) {
        console.log(
            "\nYou have no content to delete."
        );
        showMenu();
        return;
    }

    console.log(
        "\n===== DELETE CONTENT ====="
    );

    contents.forEach(
        (item, index) => {

            console.log(
                `${index + 1}. ` +
                `${item.data.title}`
            );
        }
    );

    app.question(
        "\nChoose content to delete: ",
        (answer) => {

            const index =
                Number(answer) - 1;

            if (
                index < 0 ||
                index >= contents.length
            ) {
                console.log(
                    "Invalid content."
                );
                showMenu();
                return;
            }

            const selected =
                contents[index];

            app.question(
                `Delete "${selected.data.title}"? ` +
                `(yes/no): `,
                (confirmation) => {

                    if (
                        confirmation
                            .trim()
                            .toLowerCase() !==
                        "yes"
                    ) {
                        console.log(
                            "\nDeletion cancelled."
                        );
                        showMenu();
                        return;
                    }

                    try {

                        if (
                            selected.data.video &&
                            selected.data.video
                                .filePath &&
                            fs.existsSync(
                                selected.data.video
                                    .filePath
                            )
                        ) {
                            fs.unlinkSync(
                                selected.data.video
                                    .filePath
                            );
                        }

                        if (
                            selected.data.thumbnail &&
                            fs.existsSync(
                                selected.data.thumbnail
                            )
                        ) {
                            fs.unlinkSync(
                                selected.data.thumbnail
                            );
                        }

                        fs.unlinkSync(
                            `content/${selected.file}`
                        );

                        console.log(
                            "\nContent deleted! 🗑️"
                        );

                    } catch (error) {

                        console.log(
                            "\nDelete failed."
                        );

                        console.log(
                            error.message
                        );
                    }

                    showMenu();
                }
            );
        }
    );
}
function watchContent() {
    const contents = getAllContent();

    if (contents.length === 0) {
        console.log("\nNo content available.");
        showMenu();
        return;
    }

    console.log("\n===== WATCH CONTENT =====");

    contents.forEach((item, index) => {
        console.log(
            `${index + 1}. ${item.data.title}`
        );
    });

    app.question(
        "\nChoose content to watch: ",
        (answer) => {
            const index = Number(answer) - 1;

            if (
                index < 0 ||
                index >= contents.length
            ) {
                console.log("\nInvalid content.");
                showMenu();
                return;
            }

            const selected = contents[index];
            const video = selected.data.video;

            if (
                !video ||
                !video.filePath ||
                !fs.existsSync(video.filePath)
            ) {
                console.log(
                    "\nVideo file not found."
                );
                console.log(
                    "Saved path:",
                    video && video.filePath
                        ? video.filePath
                        : "none"
                );
                showMenu();
                return;
            }

            console.log(
                `\nOpening "${selected.data.title}"...`
            );

            const uid = user.uid;

            if (!Array.isArray(selected.data.viewedBy)) {
                selected.data.viewedBy = [];
            }

            if (typeof selected.data.views !== "number") {
                selected.data.views = 0;
            }

            const alreadyViewed =
                selected.data.viewedBy.includes(uid);

            const opened = spawn(
                "termux-open",
                [video.filePath],
                {
                    detached: true,
                    stdio: "ignore"
                }
            );

            opened.unref();

            console.log(
                "\nVideo opened. 🎬"
            );

            setTimeout(() => {
                if (alreadyViewed) {
                    console.log(
                        "\nView already counted for this UID."
                    );
                    showMenu();
                    return;
                }

                selected.data.views += 1;
                selected.data.viewedBy.push(uid);

                saveContent(selected);

                console.log(
                    "\nView counted! 👁️"
                );

                console.log(
                    "Total views:",
                    selected.data.views
                );

                showMenu();

            }, 2000);
        }
    );
}
function viewNotifications() {
    const contents = getAllContent();

    const notifications = [];

    contents.forEach((item) => {
        if (!Array.isArray(item.data.notifications)) {
            item.data.notifications = [];
        }

        item.data.notifications.forEach((notification) => {
            if (notification.uid === user.uid) {
                notifications.push({
                    ...notification,
                    contentTitle: item.data.title
                });
            }
        });
    });

    console.log("\n===== NOTIFICATIONS =====");

    if (notifications.length === 0) {
        console.log("No notifications yet. 🔔");
        showMenu();
        return;
    }

    notifications
        .sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        )
        .forEach((notification, index) => {
            console.log(
                `\n${index + 1}. ${notification.message}`
            );

            console.log(
                `   Content: ${notification.contentTitle}`
            );

            console.log(
                `   ${notification.read ? "Read" : "Unread"}`
            );

            console.log(
                `   ${notification.createdAt}`
            );
        });

    showMenu();
}
function addNotification(content, uid, type, message) {
    if (!Array.isArray(content.notifications)) {
        content.notifications = [];
    }

    content.notifications.push({
        notificationId:
            "NOTIF-" + Date.now(),

        uid: uid,

        type: type,

        message: message,

        createdAt:
            new Date().toISOString(),

        read: false
    });
}
function searchContent() {
    const contents = getAllContent();

    if (contents.length === 0) {
        console.log("\nNo content available.");
        showMenu();
        return;
    }

    app.question(
        "\nSearch content: ",
        (query) => {
            query = query.trim().toLowerCase();

            if (!query) {
                console.log("\nSearch cannot be empty.");
                showMenu();
                return;
            }

            const results = contents.filter(
                (item) =>
                    item.data.title &&
                    item.data.title
                        .toLowerCase()
                        .includes(query)
            );

            console.log("\n===== SEARCH RESULTS =====");

            if (results.length === 0) {
                console.log(
                    `No content found for "${query}".`
                );
                showMenu();
                return;
            }

            results.forEach(
                (item, index) => {
                    console.log(
                        `\n${index + 1}. ${item.data.title}`
                    );

                    console.log(
                        "   Content ID:",
                        item.data.contentId
                    );

                    console.log(
                        "   Creator:",
                        item.data.creatorName
                    );

                    console.log(
                        "   Views:",
                        item.data.views || 0
                    );
                }
            );

            showMenu();
        }
    );
}

function copyShareLink() {

    const contents = getAllContent();

    console.log(
        "\n===== COPY / SHARE CONTENT LINK 🔗 ====="
    );

    if (contents.length === 0) {
        console.log(
            "\nNo content available."
        );
        showMenu();
        return;
    }

    contents.forEach((item, index) => {

        const type =
            item.data.contentType === "fan"
                ? "🎬 FAN"
                : "👑 CREATOR";

        console.log(
            `${index + 1}. ${item.data.title} [${type}]`
        );
    });

    app.question(
        "\nChoose content: ",
        (answer) => {

            const index =
                Number(answer) - 1;

            if (
                index < 0 ||
                index >= contents.length
            ) {
                console.log(
                    "\nInvalid content."
                );
                showMenu();
                return;
            }

            const selected =
                contents[index];

            if (
                !selected.data.sharing ||
                typeof selected.data.sharing !== "object"
            ) {
                selected.data.sharing = {
                    copyCount: 0,
                    copiedBy: []
                };
            }

            if (
                typeof selected.data.sharing.copyCount !==
                "number"
            ) {
                selected.data.sharing.copyCount = 0;
            }

            if (
                !Array.isArray(
                    selected.data.sharing.copiedBy
                )
            ) {
                selected.data.sharing.copiedBy = [];
            }

            const uid = user.uid;

            if (
                !selected.data.sharing.copiedBy.includes(uid)
            ) {

                selected.data.sharing.copyCount += 1;

                selected.data.sharing.copiedBy.push(
                    uid
                );

                saveContent(selected);

                console.log(
                    "\nContent link copied/shared! 🔗🔥"
                );

            } else {

                console.log(
                    "\nYou already shared this content."
                );
            }

            const shareLink =
                "fanmade://content/" +
                selected.data.contentId;
const clipboard =
    spawn(
        "termux-clipboard-set",
        [shareLink],
        {
            stdio: "ignore"
        }
    );

clipboard.on("close", (code) => {

    if (code === 0) {
        console.log(
            "\nLink copied to Android clipboard! 📋🔗"
        );
    } else {
        console.log(
            "\nCould not copy link to clipboard."
        );
    }

});

            console.log(
                "\nFan Made Link:"
            );

            console.log(
                shareLink
            );

            console.log(
                "\nTotal shares:",
                selected.data.sharing.copyCount
            );

            showMenu();
        }
    );
}

function resolveContentLink(contentId) {

    if (!contentId) {
        console.log("\nNo content ID provided.");
        return;
    }

    const contents = getAllContent();

    const selected = contents.find(
        item =>
            item.data.contentId === contentId
    );

    if (!selected) {
        console.log(
            "\nContent not found. ❌"
        );
        return;
    }

    console.log(
        "\n===== FAN MADE CONTENT 🔗 ====="
    );

    console.log(
        "Content ID:",
        selected.data.contentId
    );

    console.log(
        "Title:",
        selected.data.title
    );

    console.log(
        "Creator:",
        selected.data.creatorName
    );

    console.log(
        "Description:",
        selected.data.description
    );

    console.log(
        "Views:",
        selected.data.views || 0
    );

    console.log(
        "Likes:",
        Array.isArray(selected.data.likes)
            ? selected.data.likes.length
            : 0
    );

    console.log(
        "Fan Made Link:",
        "fanmade://content/" +
        selected.data.contentId
    );
}

function showMenu() {

    console.log(
        "\n===== FAN MADE CONTENT ====="
    );

    console.log(
        "1. Upload video"
    );

    console.log(
        "2. View my content"
    );

    console.log(
        "3. Edit content"
    );

    console.log(
        "4. Add thumbnail"
    );

    console.log(
        "5. Add / Remove watchlist"
    );

    console.log(
        "6. View my watchlist"
    );

    console.log(
        "7. Like / Unlike content"
    );

    console.log(
        "8. View liked content"
    );

    console.log(
        "9. Add comment"
    );

    console.log(
        "10. View comments"
    );
console.log(
    "11. Reply to comment"
);

console.log(
    "12. Like / Unlike reply"
);

console.log(
    "13. Delete my reply"
);

console.log(
    "14. Delete my comment"
);

console.log(
    "15. Delete content"
);

console.log(
    "16. Watch content"
);

console.log(
    "17. search content"
);

console.log(
    "18. View notifications"
);

console.log(
    "19. Sound Manager 🎵"
);

console.log(
    "20. Fan Sounds 🎵"
);

console.log(
    "21. Fan Content 🎬"
);

console.log(
    "22. Copy / Share content link 🔗"
);

console.log(
    "23. Exit"
);
    app.question(
        "\nChoose an option: ",
        handleChoice
    );
}

function handleChoice(choice) {

    if (choice === "1") {
        uploadVideo();

    } else if (choice === "2") {
        viewMyContent();

    } else if (choice === "3") {
        editContent();

    } else if (choice === "4") {
        addThumbnail();

    } else if (choice === "5") {
        manageWatchlist();

    } else if (choice === "6") {
        viewWatchlist();

    } else if (choice === "7") {
        manageLike();

    } else if (choice === "8") {
        viewLikedContent();

    } else if (choice === "9") {
        addComment();

    } else if (choice === "10") {
        viewComments();

    } else if (choice === "11") {
        addReply();

    } else if (choice === "12") {
        manageReplyLike();

    } else if (choice === "13") {
        deleteReply();

    } else if (choice === "14") {
        deleteComment();

    } else if (choice === "15") {
        deleteContent();

    } else if (choice === "16") {
        watchContent();

    } else if (choice === "17") {
        searchContent();

    } else if (choice === "18") {
        viewNotifications();

} else if (choice === "19") {

    spawn(
        "node",
        ["sound-menu.js"],
        {
            stdio: "inherit"
        }
    ).on(
        "close",
        () => {
            showMenu();
        }
    );

} else if (choice === "20") {

    spawn(
        "node",
        ["fan-sounds.js"],
        {
            stdio: "inherit"
        }
    ).on(
        "close",
        () => {
            showMenu();
        }
    );

} else if (choice === "21") {

    spawn(
        "node",
        ["fan-content.js"],
        {
            stdio: "inherit"
        }
    ).on(
        "close",
        () => {
            showMenu();
        }
    );

} else if (choice === "22") {

    copyShareLink();

} else if (choice === "23") {

    console.log("Goodbye!");
    app.close();

} else {
        console.log(
            "Invalid option."
        );
        showMenu();
    }
}

showMenu();

const fs = require("fs");

const CONTENT_DIR = "content";

const user = JSON.parse(
    fs.readFileSync("user.json", "utf8")
);

function getContents() {
    if (!fs.existsSync(CONTENT_DIR)) {
        return [];
    }

    return fs.readdirSync(CONTENT_DIR)
        .filter(file => file.endsWith(".json"))
        .map(file => ({
            file,
            data: JSON.parse(
                fs.readFileSync(
                    `${CONTENT_DIR}/${file}`,
                    "utf8"
                )
            )
        }));
}

function saveContent(item) {
    fs.writeFileSync(
        `${CONTENT_DIR}/${item.file}`,
        JSON.stringify(item.data, null, 2)
    );
}

function prepareViews(content) {
    if (typeof content.views !== "number") {
        content.views = 0;
    }

    if (!Array.isArray(content.viewers)) {
        content.viewers = [];
    }
}

console.log("Fan Made View System");
console.log("UID:", user.uid);

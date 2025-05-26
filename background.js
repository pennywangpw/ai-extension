//check the tab is open and inject content.js into tab page
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status === "complete" &&
        tab.url.includes("linkedin.com/in/")
    ) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content.js"]
        });
    }
});

//listen to popup.js and content.js
//if receive from popup.js open tabs
//if receive from content.js call backend api to generate message
chrome.runtime.onMessage.addListener((msg, sender) => {
    console.log("收到 content.js or popup.js 傳來的訊息", msg);
    if (msg.type === "open_urls_in_batches") {
        openUrlsInBatches(msg.urls, msg.batchSize, msg.delay);

    }
    if (msg.type === "generate_message") {
        const experienceText = msg.payload;
        fetch("http://localhost:3000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ experienceText })
        })
            .then(res => res.json())
            .then(data => {
                chrome.tabs.sendMessage(sender.tab.id, {
                    type: "insert_message",
                    message: data.message
                });
            })
            .catch(err => console.error("Server Error:", err));
    }
});


function openUrlsInBatches(urls, batchSize, delay) {
    let index = 0;
    const total = urls.length;

    function openNextBatch() {
        const batch = urls.slice(index, index + batchSize);
        batch.forEach(url => {
            chrome.tabs.create({ url });
        });

        index += batchSize;

        if (index < total) {
            setTimeout(openNextBatch, delay);
        }
    }

    openNextBatch();
}

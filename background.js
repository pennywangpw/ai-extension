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


chrome.runtime.onMessage.addListener((msg, sender) => {
    console.log("收到 content.js 傳來的訊息", msg);
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

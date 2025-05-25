console.log("content.js 已載入！");


chrome.runtime.onMessage.addListener((msg) => {
    console.log("--- 收到 background 回傳的訊息", msg);
    if (msg.type === "insert_message") {
        const message = msg.message;

        const inputBox = document.querySelector('div[contenteditable="true"][aria-label="Write a message…"]');

        if (inputBox) {
            inputBox.focus();

            // 清空原有內容
            inputBox.innerHTML = "";

            // 插入訊息內容
            const p = document.createElement("p");
            p.textContent = message;
            inputBox.appendChild(p);

            // 觸發輸入事件，模擬使用者輸入
            inputBox.dispatchEvent(new InputEvent("input", {
                bubbles: true,
                cancelable: true,
                inputType: "insertText",
                data: message
            }));

            // 找送出按鈕
            // const sendButton = Array.from(document.querySelectorAll('button'))
            //     .find(btn => btn.className.includes("msg-form__send-button"));

            const sendButton = document.querySelector('button.msg-form__send-button');
            if (sendButton) {
                sendButton.click();
                console.log(" 已點擊送出按鈕");
            } else {
                console.log(" 沒找到送出按鈕");
            }
        } else {
            console.log(" 沒找到 Message 輸入框");
        }
    }
});


function extractExperienceText() {
    const cards = document.querySelectorAll('.artdeco-card.pv-profile-card.break-words.mt2');
    for (const card of cards) {
        const text = card.innerText.trim();
        if (text.includes("Experience")) {
            return text;
        }
    }
    return "";
}

async function clickMessageButton() {
    console.log("開始流程");

    const experienceText = extractExperienceText();
    console.log("experienceText 資料", experienceText);

    if (!experienceText) {
        console.log("沒找到 Experience 資料");
        return;
    }

    // 找到 Message 按鈕並點擊
    const buttons = document.querySelectorAll('button.artdeco-button');
    for (const btn of buttons) {
        const label = btn.getAttribute('aria-label');
        const text = btn.innerText.trim();
        if ((label && label.startsWith('Message')) || text === 'Message') {
            btn.click();
            console.log("點擊 Message 按鈕");

            // 等待對話框開啟
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 傳送資料給 background，請他處理 AI
            chrome.runtime.sendMessage({
                type: "generate_message",
                payload: experienceText
            });

            return;
        }
    }

    console.log("沒找到 Message 按鈕");
}

setTimeout(clickMessageButton, 3000);

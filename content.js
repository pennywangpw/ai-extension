console.log("content.js 已載入！");


// 收到背景傳回的訊息 → 貼到輸入框並自動送出
chrome.runtime.onMessage.addListener((msg) => {
    console.log("--- 收到 background 回傳的訊息", msg);
    if (msg.type === "insert_message") {
        const message = msg.message;
        const textarea = document.querySelector('textarea[name="message"]');
        if (textarea) {
            textarea.value = message;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));

            const sendButton = document.querySelector('button[aria-label="Send now"]');
            if (sendButton) sendButton.click();
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


// import { generatePersonalizedMessage } from './AiModel';

// function extractExperienceText() {
//     const cards = document.querySelectorAll('.artdeco-card.pv-profile-card.break-words.mt2');

//     for (const card of cards) {
//         const text = card.innerText.trim();

//         if (text.includes("Experience")) {
//             console.log("找到 Experience 卡片");

//             const items = card.querySelectorAll('li, span, div');
//             items.forEach((el, idx) => {
//                 const content = el.innerText?.trim();
//                 if (content) {
//                     console.log(`🔹 [${idx + 1}]`, content);
//                 }
//             });

//             return text;
//         }
//     }

//     console.log(" 沒找到包含 Experience 的卡片");
//     return "";
// }

// // get the experience
// // find the Message button
// // open the Message button
// // call ai api to generate the context
// // paste the context and send it to the person
// function clickMessageButton() {
//     console.log(" 開始流程");

//     const experienceText = extractExperienceText();

//     // 儲存在 global 變數或傳出去也可以
//     console.log(" 儲存 experienceText:", experienceText);

//     // 接下來找 Message 按鈕
//     const buttons = document.querySelectorAll('button.artdeco-button');
//     for (const btn of buttons) {
//         const label = btn.getAttribute('aria-label');
//         const text = btn.innerText.trim();

//         if ((label && label.startsWith('Message')) || text === 'Message') {
//             btn.click();
//             console.log(" 點擊 Message 按鈕");
//             generatePersonalizedMessage(experienceText);

//             return;
//         } else {

//             console.log(" 沒找到 Message 按鈕");
//         }
//     }

// }

// // 延遲 6 秒後執行（等頁面 DOM 載入）
// setTimeout(clickMessageButton, 3000);

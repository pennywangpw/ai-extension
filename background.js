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



// chrome.runtime.onMessage.addListener((msg, sender) => {
//     if (msg.type === "generate_message") {
//         const experienceText = msg.payload;

//         generatePersonalizedMessage(experienceText).then(response => {
//             chrome.tabs.sendMessage(sender.tab.id, {
//                 type: "insert_message",
//                 message: response
//             });
//         });

//     }
// });

chrome.runtime.onMessage.addListener((msg, sender) => {
    console.log("收到 content.js 傳來的訊息", msg);

    if (msg.type === "generate_message") {
        const experienceText = msg.payload;

        generatePersonalizedMessage(experienceText).then(response => {
            console.log("傳送回 content.js 的訊息", response);

            chrome.tabs.sendMessage(sender.tab.id, {
                type: "insert_message",
                message: response
            });
        });
    }
});


async function generatePersonalizedMessage(experienceText) {
    console.log("拿進來的: ", experienceText)
    const apiKey = "";
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Here's a person's LinkedIn experience:\n\n${experienceText}\n\nWrite a friendly 100-word message...`
                        }
                    ]
                }
            ]
        })
    });


    const data = await response.json();
    console.log("AI API 回傳資料：", data);

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ 無法解析回覆";
    console.log("AI 回覆內容：", text);
    return text;

}




// import { GoogleGenAI } from "@google/genai"; // ✅ 放在背景或 popup script 才能用

// const ai = new GoogleGenAI({ apiKey: "" });

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//     if (msg.type === "generate_message") {
//         const experienceText = msg.payload;

//         generatePersonalizedMessage(experienceText).then(response => {
//             chrome.tabs.sendMessage(sender.tab.id, {
//                 type: "insert_message",
//                 message: response
//             });
//         });

//         return true; // 表示你會 async 回傳
//     }
// });

// async function generatePersonalizedMessage(experienceText) {
//     const result = await ai.models.generateContent({
//         model: "gemini-2.0-flash",
//         contents: [
//             {
//                 role: "user",
//                 parts: [
//                     {
//                         text: `Here's a person's LinkedIn experience:\n\n${experienceText}\n\nWrite a friendly 100-word message...`
//                     }
//                 ]
//             }
//         ]
//     });

//     return result.response.candidates[0].content.parts[0].text;
// }

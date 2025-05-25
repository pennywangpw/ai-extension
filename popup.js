document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        const content = event.target.result;
        const ext = file.name.split('.').pop().toLowerCase();

        let urls = [];

        try {
            if (ext === 'json') {
                const json = JSON.parse(content);
                const text = JSON.stringify(json);
                urls = extractLinkedInUrls(text);
            } else if (ext === 'csv') {
                urls = extractLinkedInUrls(content);
            } else {
                alert("Only .csv and .json files are supported.");
                return;
            }

            if (urls.length === 0) {
                alert("No LinkedIn URLs found.");
                return;
            }

            document.getElementById('fileContent').textContent = `Found ${urls.length} LinkedIn URLs.\nOpening 3 at a time...\n`;

            openUrlsInBatches(urls, 1, 4000); // 每批 2 個，每 4 秒

        } catch (err) {
            console.error("這裡有錯誤--", err);
            document.getElementById('fileContent').textContent = "Failed to process file.";
        }
    };

    reader.readAsText(file);
});

function extractLinkedInUrls(text) {
    const regex = /https?:\/\/(www\.)?linkedin\.com\/[^\s,"'}]+/g;
    const matches = text.match(regex);
    return matches ? [...new Set(matches)] : [];
}

function openUrlsInBatches(urls, batchSize, delay) {
    let index = 0;
    const total = urls.length;

    function openNextBatch() {
        const batch = urls.slice(index, index + batchSize);
        batch.forEach(url => {
            chrome.tabs.create({ url });
        });

        index += batch.length;

        const opened = index;
        const remaining = total - opened;

        document.getElementById('fileContent').textContent =
            `Total URLs: ${total}\nOpened: ${opened}\nRemaining: ${remaining}`;

        if (index < total) {
            setTimeout(openNextBatch, delay);
        } else {
            document.getElementById('fileContent').textContent += `\n✅ All URLs opened.`;
        }
    }

    openNextBatch();
}

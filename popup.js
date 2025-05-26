document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        const content = event.target.result;
        const ext = file.name.split('.').pop().toLowerCase();

        //找出input file中的persona
        const persona = document.getElementById('personaSelect').value;

        //找出input file中的urls
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

            // 每批 2 個，每 4 秒
            chrome.runtime.sendMessage({
                type: "open_urls_in_batches",
                urls,
                persona,
                batchSize: 2,
                delay: 4000
            });

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

document.addEventListener("DOMContentLoaded", () => {
    const findBtn = document.getElementById("findLiked");

    findBtn.addEventListener("click", async () => {
        console.log("🟢 Button clicked (sending START_FIND_LIKED)");
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.sendMessage(tab.id, { type: "START_FIND_LIKED" });
    });
});

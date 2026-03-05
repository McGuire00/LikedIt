document.addEventListener("DOMContentLoaded", () => {
    const findBtn = document.getElementById("findLiked");
    if (!findBtn) {
        console.error("findLiked button not found");
        return;
    }

    findBtn.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.sendMessage(tab.id, { type: "START_FIND_LIKED" });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const findBtn = document.getElementById("findLiked");
    const unlikeBtn = document.getElementById("unlikeAll");

    findBtn.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.sendMessage(tab.id, { type: "START_FIND_LIKED" });
    });

    unlikeBtn.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.sendMessage(tab.id, { type: "UNLIKE_ALL" });
    });
});

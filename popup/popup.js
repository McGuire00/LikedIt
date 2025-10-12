document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("findLiked");
    btn.addEventListener("click", async () => {
        console.log("🟢 Button clicked");

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) {
            console.error("❌ No active tab found");
            return;
        }

        try {
            await chrome.tabs.sendMessage(tab.id, { type: "START_FIND_LIKED" });
            console.log("✅ Message sent to existing content script");
        } catch (err) {
            console.warn("⚠️ No content script found, injecting…", err);

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content/content.js"],
            });

            await new Promise((r) => setTimeout(r, 300));

            await chrome.tabs.sendMessage(tab.id, { type: "START_FIND_LIKED" });
            console.log("✅ Message sent after injection");
        }
    });
});

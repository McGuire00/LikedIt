let interceptorActive = false;
console.log("💡 HeartView content script loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "START_FIND_LIKED" && !interceptorActive) {
        interceptorActive = true;
        console.log("🔍 HeartView: Watching for liked posts...");
        setupListener();
    }
});

function setupListener() {
    window.addEventListener("message", (event) => {
        if (event.source !== window) return;
        if (event.data.type === "IG_GRAPHQL_RESPONSE") {
            const data = event.data.payload;
            handleGraphQLResponse(data);
        }
    });
}

function handleGraphQLResponse(data) {
    const edges = data?.data?.user?.edge_owner_to_timeline_media?.edges || [];
    const liked = edges.filter((edge) => edge.node.has_liked);

    liked.forEach((edge) => {
        const shortcode = edge.node.shortcode;
        const link = document.querySelector(`a[href="/p/${shortcode}/"]`);
        if (link) link.classList.add("hv-liked");
    });

    if (liked.length) {
        console.log(`❤️ Found ${liked.length} liked posts`);
    }
}

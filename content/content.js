console.log("💡 LikedIt content script loaded");

window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data.type === "IG_GRAPHQL_RESPONSE") {
        console.log("📬 Received IG data from interceptor");
        handleGraphQLResponse(event.data.payload);
    }
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "START_FIND_LIKED") {
        console.log("▶️ Find Liked Photos triggered");

        // If we already have cached data from the interceptor, use it
        if (window.__LIKEDIT_LATEST__) {
            console.log("📦 Using cached GraphQL data");
            handleGraphQLResponse(window.__LIKEDIT_LATEST__);
        } else {
            console.warn("⚠️ No cached data yet — try scrolling the page to trigger requests.");
        }
    }
});

function handleGraphQLResponse(data) {
    const edges = data?.data?.user?.edge_owner_to_timeline_media?.edges || [];
    const liked = edges.filter((edge) => edge.node.has_liked);

    liked.forEach((edge) => {
        const shortcode = edge.node.shortcode;
        const link = document.querySelector(`a[href="/p/${shortcode}/"]`);
        if (link) {
            link.classList.add("hv-liked");
        }
    });

    if (liked.length > 0) {
        console.log(`❤️ Highlighted ${liked.length} liked posts`);
    } else {
        console.log("💭 No liked posts found yet.");
    }
}

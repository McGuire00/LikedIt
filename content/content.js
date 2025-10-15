let latestGraphQLData = [];
const highlightedShortcodes = new Set();

window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data.type === "IG_GRAPHQL_RESPONSE") {
        latestGraphQLData.push(event.data.payload);
    }
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "START_FIND_LIKED") {
        if (latestGraphQLData.length > 0) {
            latestGraphQLData.forEach((batch) => handleGraphQLResponse(batch));
        } else {
            console.warn("⚠️ No cached data yet — try scrolling the page to trigger requests.");
        }
    }
});

function handleGraphQLResponse(data) {
    const edges = data?.data?.xdt_api__v1__feed__user_timeline_graphql_connection?.edges || [];
    const liked = edges.filter((edge) => edge.node.has_liked);

    liked.forEach((edge) => {
        const shortcode = edge.node.code;
        if (highlightedShortcodes.has(shortcode)) return;
        highlightedShortcodes.add(shortcode);

        const link = document.querySelector(`a[href$="/${shortcode}/"], a[href$="/${shortcode}"]`);

        if (link) {
            const wrapperDiv = link.querySelector("div");
            if (wrapperDiv) {
                wrapperDiv.classList.add("hv-liked");
            } else {
                link.classList.add("hv-liked");
            }
        }
    });

    if (liked.length > 0) {
        console.log(`❤️ Highlighted ${liked.length} liked posts`);
    } else {
        console.log("💭 No liked posts found yet.");
    }
}

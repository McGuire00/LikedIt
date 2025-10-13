(function () {
    if (window.__likedItInterceptor) return;
    window.__likedItInterceptor = true;
    console.log("✅ LikedIt interceptor active");

    const originalFetch = window.fetch;
    if (originalFetch) {
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            try {
                if (typeof args[0] === "string" && args[0].includes("/graphql/query")) {
                    const cloned = await response.clone().json();
                    handleGraphQLResponse(cloned);
                }
            } catch (e) {}
            return response;
        };
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
        this._url = args[1];
        console.log("Arguments", args[1]);
        return originalOpen.apply(this, args);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (...args) {
        this.addEventListener("load", function () {
            try {
                if (this._url && this._url.includes("/graphql/query")) {
                    const json = JSON.parse(this.responseText);
                    handleGraphQLResponse(json);
                }
            } catch (e) {}
        });
        return originalSend.apply(this, args);
    };

    function handleGraphQLResponse(data) {
        if (data?.data?.user?.edge_owner_to_timeline_media) {
            console.log("📸 Caught GraphQL XHR data:", data);
            window.__LIKEDIT_LATEST__ = data;
            window.postMessage({
                type: "IG_GRAPHQL_RESPONSE",
                payload: data,
            });
        }
    }
})();

(function () {
    if (window.__heartviewInterceptor) return;
    window.__heartviewInterceptor = true;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);

        if (typeof args[0] === "string" && args[0].includes("/graphql/query")) {
            response
                .clone()
                .json()
                .then((data) => {
                    if (data?.data?.user?.edge_owner_to_timeline_media) {
                        window.postMessage({
                            type: "IG_GRAPHQL_RESPONSE",
                            payload: data,
                        });
                    }
                })
                .catch(() => {});
        }

        return response;
    };
})();

function listenForClicks() {
    document.addEventListener("click", (e) => {
        function cyclops(tabs) {
            browser.tabs
                .sendMessage(tabs[0].id, {
                    command: "cyclops"
                });
        }

        function reportError(error) {
            console.error(`Could not cyclops: ${error}`);
        }

        browser.tabs
            .query({ active: true, currentWindow: true })
            .then(cyclops)
            .catch(reportError);
    })
}

function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute Cyclops: ${error.message}`);
}

browser.tabs
    .executeScript({ file: "/content_scripts/cyclops.js" })
    .then()
    .catch(reportExecuteScriptError);

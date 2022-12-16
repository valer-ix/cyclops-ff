function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

function updateActiveTab(tabs) {
    getActiveTab()
        .then((tabs) => {
            return browser.storage.local.get(tabs[0].url);
        })
        .then((storedInfo) => {
            if (Object.keys(storedInfo).length !== 0) {
                if (storedInfo[Object.keys(storedInfo)[0]]['checked'] === true) {
                    getActiveTab().then((tabs) => {
                        browser.tabs
                        .sendMessage(tabs[0].id, {
                            action: true,
                        });
                    })
                }
            }
        })
}

browser.tabs.onUpdated.addListener(updateActiveTab);
updateActiveTab();

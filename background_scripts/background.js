const getCurrentUrl = () => {
    return browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => tabs[0].url);
};

const sendMessageIfChecked = (version, message) => {
    getCurrentUrl().then((url) => {
        url = `${url}/${version}`;
        browser.storage.local.get(url).then((result) => {
            if (result[url]) {
                browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
                    browser.tabs.sendMessage(tabs[0].id, message);
                });
            };
        });
    });
};

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        sendMessageIfChecked('v1', { action_v1: true });
    }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        sendMessageIfChecked('v2', { action: true });
    }
});

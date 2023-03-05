const currVersion = 'v2';

const getCurrentUrl = () => {
    return browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => tabs[0].url);
};

const sendMessageIfChecked = () => {
    getCurrentUrl().then((url) => {
        url = `${url}/${currVersion}`;
        browser.storage.local.get(url).then((result) => {
            if (result[url]) {
                browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
                    browser.tabs.sendMessage(tabs[0].id, { action: true });
                });
            };
        });
    });
};

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        sendMessageIfChecked();
    }
});

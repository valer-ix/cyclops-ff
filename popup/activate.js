let myWindowId;
const check = document.getElementById("checkbox");

function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

function cyclops(tabs) {
    let contentToStore = {};
    if (check.checked !== browser.storage.local.get(contentToStore)) {
        contentToStore[tabs[0].url] = {'checked': check.checked};
        getActiveTab().then((tabs) => {
            browser.tabs
            .sendMessage(tabs[0].id, {
                action: check.checked,
            });
        });
        browser.storage.local.set(contentToStore);
    };
}

function reportError(error) {
    console.error(`Could not cyclops: ${error}`);
}

check.addEventListener("change", (e) => {
    browser.tabs
        .query({ windowId: myWindowId, active: true })
        .then(cyclops)
        .catch(reportError);
})

function updateCheck() {
    browser.tabs.query({ windowId: myWindowId, active: true})
        .then((tabs) => {
            return browser.storage.local.get(tabs[0].url);
        })
        .then((storedInfo) => {
            if (Object.keys(storedInfo).length !== 0) {
                check.checked = storedInfo[Object.keys(storedInfo)[0]]['checked'];
            };
        });
}

browser.tabs.onUpdated.addListener(updateCheck);
browser.windows.getCurrent({ populate: true}).then((windowInfo) => {
    myWindowId = windowInfo.id;
    updateCheck();
})

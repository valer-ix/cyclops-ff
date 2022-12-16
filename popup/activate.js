let myWindowId;
const check = document.getElementById("checkbox");

function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
  }

check.addEventListener("change", (e) => {
    function cyclops(tabs) {
        let contentToStore = {};
        contentToStore[tabs[0].url] = {'checked': check.checked};
        browser.storage.local.set(contentToStore);
        getActiveTab().then((tabs) => {
            browser.tabs
            .sendMessage(tabs[0].id, {
                action: check.checked,
            });
        })
    }

    function reportError(error) {
        console.error(`Could not cyclops: ${error}`);
    }

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
                console.log("getState " + storedInfo[Object.keys(storedInfo)[0]]['checked'])
                check.checked = storedInfo[Object.keys(storedInfo)[0]]['checked'];
            };
        });
}

browser.tabs.onActivated.addListener(updateCheck);
browser.tabs.onUpdated.addListener(updateCheck);
browser.windows.getCurrent({ populate: true}).then((windowInfo) => {
    myWindowId = windowInfo.id;
    updateCheck();
})

// browser.tabs
//     .executeScript({ file: "/content_scripts/cyclops.js" })
//     .then(listenForChange)
//     .catch(reportExecuteScriptError);

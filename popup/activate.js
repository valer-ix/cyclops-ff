var cookieVal = {'checkboxState': true};

function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

function cookieUpdate() {
    getActiveTab().then((tabs) => {
        var gettingCookies = browser.cookies.get({
            url: tabs[0].url,
            name: "cyclops"
        });
        gettingCookies.then((cookie) => {
            if (cookie) {
                var cookieVal = JSON.parse(cookie.value);
            }
            const check = document.getElementById("checkbox");
        });
    });
}


console.log(cookieVal)


function listenForChange() {
    const check = document.getElementById("checkbox");
    check.addEventListener("change", (e) => {

        function cyclops(tabs) {
            browser.tabs
                .sendMessage(tabs[0].id, {
                    command: "cyclops",
                });
            cookieVal.checkboxState = check.checked
            console.log("check " + check.checked)
            browser.cookies.set({
                url: tabs[0].url,
                name: "cyclops",
                value: JSON.stringify(cookieVal)
            })
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
    .then(listenForChange)
    .catch(reportExecuteScriptError);

browser.tabs.onUpdated.addListener(cookieUpdate);
browser.tabs.onActivated.addListener(cookieUpdate);

browser.cookies.onChanged.addListener((changeInfo) => {
    console.log(`Cookie changed:\n
                * Cookie: ${JSON.stringify(changeInfo.cookie)}\n
                * Cause: ${changeInfo.cause}\n
                * Removed: ${changeInfo.removed}`);
    });

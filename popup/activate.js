const checkbox_v2 = document.getElementById("checkbox-v2");
const checkbox_v1 = document.getElementById("checkbox-v1");
const currVersion = 'v2';

// Get current URL
//
const getCurrentUrl = () => {
    return browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => tabs[0].url);
};

// Update checkbox
//
getCurrentUrl().then((url) => {
    urlCurr = `${url}/${currVersion}`;
    browser.storage.local.get(urlCurr).then((result) => {
        if (result[urlCurr]) {
            checkbox_v2.checked = true;
        } else {
            checkbox_v2.checked = false;
        }
        if (result[`${url}/v1`]) {
            checkbox_v1.checked = true;
        } else {
            checkbox_v1.checked = false;
        }
    });
});

// Save status
//
checkbox_v2.addEventListener('change', () => {
    const message = checkbox_v2.checked ? { action: true } : { action: false };

    getCurrentUrl().then((url) => {
        const obj = {};
        obj[`${url}/${currVersion}`] = checkbox_v2.checked;
        browser.storage.local.set(obj);
    });

    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        browser.tabs.sendMessage(tabs[0].id, message);
    })
});

checkbox_v1.addEventListener('change', () => {
    const message = checkbox_v1.checked ? { action_v1: true } : { action_v1: false };

    getCurrentUrl().then((url) => {
        const obj = {};
        obj[`${url}/v1`] = checkbox_v2.checked;
        browser.storage.local.set(obj);
    });

    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        browser.tabs.sendMessage(tabs[0].id, message);
    })
});

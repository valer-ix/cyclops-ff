const checkbox_v2 = document.getElementById("checkbox-v2");
const checkbox_dm = document.getElementById("checkbox-darkmode");
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
    });
    //
    urldm = `${url}/dm`;
    browser.storage.local.get(urldm).then((result) => {
        if (result[urldm]) {
            checkbox_dm.checked = true;
        } else {
            checkbox_dm.checked = false;
        }
    });
    //
    urlv1 = `${url}/v1`;
    browser.storage.local.get(urlv1).then((result) => {
        if (result[urlv1]) {
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

checkbox_dm.addEventListener('change', () => {
    const message = checkbox_dm.checked ? { action_dm: true } : { action_dm: false };

    getCurrentUrl().then((url) => {
        const obj = {};
        obj[`${url}/dm`] = checkbox_dm.checked;
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
        obj[`${url}/v1`] = checkbox_v1.checked;
        browser.storage.local.set(obj);
    });

    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        browser.tabs.sendMessage(tabs[0].id, message);
    })
});

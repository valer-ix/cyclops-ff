const checkbox = document.getElementById("checkbox");

// Get current URL
//
const getCurrentUrl = () => {
    return browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => tabs[0].url);
};

// Update checkbox
//
getCurrentUrl().then((url) => {
    browser.storage.local.get(url).then((result) => {
        if (result[url]) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
});

// Save status
//
checkbox.addEventListener('change', () => {
    const message = checkbox.checked ? { action: true } : { action: false };

    getCurrentUrl().then((url) => {
        const obj = {};
        obj[url] = checkbox.checked;
        browser.storage.local.set(obj);
    });

    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        browser.tabs.sendMessage(tabs[0].id, message);
    })
});

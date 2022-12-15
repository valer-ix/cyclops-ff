(() => {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    function cyclops() {
        console.log("hi");
    }

    browser.runtime.onMessage.addListener((message) => {
        if (message.command == "cyclops") {
            cyclops();
        }
    });
})();

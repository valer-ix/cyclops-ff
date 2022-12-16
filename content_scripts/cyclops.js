(() => {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    function cyclops() {
        console.log("hi");
    }

    function decyclops() {
        console.log("bye");
    }

    browser.runtime.onMessage.addListener((message) => {
        if (message.action == true) {
            cyclops();
        } else {
            decyclops();
        }
    });
})();

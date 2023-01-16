(() => {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    var cur = document.body;

    var html_body = document.body.innerHTML;
    var html_text = document.body.innerText;

    var styles = `
    body {
        color: #C0BAB2;
        background-color: white;
        font-family: Lora, serif;
        font-size: 2.25rem;
        max-width: 100%;
        line-height: normal;
    }

    :root {
        --column-gap: 20px;
        --row-gap: 10px;
    }

    div {
        white-space: pre-wrap;
    }

    div#a {
        background-image: none;
    }
    
    .grid {
        display: grid !important;
        grid-auto-columns: 1fr;
        grid-auto-flow: column;
        grid-template-columns: 3fr 2fr 2fr 3fr; 
        grid-column-gap: var(--column-gap);
        grid-row-gap: var(--row-gap);
        justify-content: center;
    }
    
    [class*=l-] {
        background-color: black;
        padding: 0 1rem 0 1rem;
        overflow-wrap: break-word;
    }
    
    .l-left {
        grid-column-start: 2;
        max-width: 100%;
        min-width: 0;
    }
    
    .l-right {
        grid-column-start: 3;
        max-width: 100%;
        min-width: 0;
    }
    `;

    document.addEventListener("scroll", (e) => {
        cur.style.cursor = 'none';
    })

    document.addEventListener("mousemove", (e) => {
        cur.style.cursor = '';
    })

    function cyclops() {
        content = JSON.parse(localStorage.getItem(window.location.href))
        if (content === null) {
            var content = {};
        }

        content['scroll_pos_decyclops'] = window.pageYOffset

        var styleSheet = document.createElement("style")
        styleSheet.id = 'style-cyclops'
        styleSheet.innerText = styles
        document.head.appendChild(styleSheet)

        document.body.innerHTML = `
        <div id='main' class='grid'>
            <div class='l-left'>${html_text}</div>
            <div class='l-right'>${html_text}</div>
        </div>
        `;

        document.documentElement.scrollTop = document.body.scrollTop = content['scroll_pos_cyclops']

        content['active'] = true
        localStorage.setItem(window.location.href, JSON.stringify(content))
    }

    function decyclops() {
        content = JSON.parse(localStorage.getItem(window.location.href))
        if (content === null) {
            var content = {};
        }

        content['scroll_pos_cyclops'] = window.pageYOffset

        const styleTag = document.getElementById('style-cyclops');
        document.getElementsByTagName('head')[0].removeChild(styleTag);

        document.body.innerHTML = html_body;

        document.documentElement.scrollTop = document.body.scrollTop = content['scroll_pos_decyclops']

        content['active'] = false
        localStorage.setItem(window.location.href, JSON.stringify(content))
    }

    const interval = setInterval(function() {
        content = JSON.parse(localStorage.getItem(window.location.href))
        if (content !== null) {
            if (content['active'] === true) {
                content['scroll_pos_cyclops'] = window.pageYOffset
            } else {
                content['scroll_pos_decyclops'] = window.pageYOffset
            }
            localStorage.setItem(window.location.href, JSON.stringify(content))
        }
    }, 60000);

    browser.runtime.onMessage.addListener((message) => {
        if (message.action == true) {
            cyclops();
        } else {
            decyclops();
        }
    });
})();

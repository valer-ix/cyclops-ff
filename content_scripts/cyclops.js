(() => {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    var html_body = document.documentElement.outerHTML;
    var html_text = document.body.innerText;

    var styles = `
    body {
        color: #C0BAB2;
        background-color: white;
        font-family: Lora, serif;
        font-size: 2.25rem;
        max-width: 100%;
        line-height: normal;
        overflow: hidden;
        height: 100vh;
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
    
    .grid-cyclops {
        display: grid !important;
        grid-auto-columns: 1fr;
        grid-auto-flow: column;
        grid-template-columns: 3fr 2fr 2fr 3fr; 
        grid-column-gap: var(--column-gap);
        grid-row-gap: var(--row-gap);
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 1);
        z-index: 99999;
    }
    
    [class*=l-] {
        padding: 0 1rem 0 1rem;
        overflow-wrap: break-word;
    }
    
    .l-left-cyclops {
        grid-column-start: 2;
        max-width: 100%;
        min-width: 0;
        height: 100vh;
    }
    
    .l-right-cyclops {
        grid-column-start: 3;
        max-width: 100%;
        min-width: 0;
        height: 100vh;
    }

    iframe {
        width: 100%;
        border: none;
        overflow: hidden; /* hide the scrollbar */
      }
      
    `;

    // Cyclops
    //
    function cyclops() {
        // Get cookies
        //
        const url = window.location.href
        content = JSON.parse(localStorage.getItem(url))
        if (content === null) {
            var content = {};
        }

        // Style sheet
        //
        var styleSheet = document.createElement("style")
        styleSheet.id = 'style-cyclops'
        styleSheet.innerText = styles
        document.head.appendChild(styleSheet)

        // Create iframes
        var wrapper = document.createElement("div");
        wrapper.id = "main-cyclops";
        wrapper.className = "grid-cyclops";
        wrapper.style.overflow = "hidden";
        document.body.appendChild(wrapper);

        var leftIframe = document.createElement("iframe");
        leftIframe.id = "L";
        leftIframe.className = "l-left-cyclops";
        leftIframe.src = url;
        wrapper.appendChild(leftIframe);

        var rightIframe = document.createElement("iframe");
        rightIframe.id = "R";
        rightIframe.className = "l-right-cyclops";
        rightIframe.src = url;
        wrapper.appendChild(rightIframe);

        // Iframe listeners
        //
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.addEventListener('load', () => {
                const iframeDoc = iframe.contentDocument;

                // Hide scrollbar
                //
                iframeDoc.body.style.overflow = "hidden";
                iframeDoc.body.style.scrollbarWidth = "none";
                iframeDoc.documentElement.style.overflowY = 'scroll';
                iframeDoc.documentElement.style.scrollbarWidth = "none";

                // Set initial scroll position
                //
                // console.log('initial:', content['scroll_pos_cyclops'])
                iframe.contentDocument.scrollingElement.scrollTop = content['scroll_pos_cyclops'];
                // console.log('CHECK:', iframe.contentWindow.scrollY)

                // Hide cursor on scroll
                //
                iframeDoc.addEventListener('scroll', () => {
                    iframeDoc.body.style.cursor = 'none';
                    content['scroll_pos_cyclops'] = parseInt(iframe.contentDocument.scrollingElement.scrollTop)
                    // console.log('-cyclops:', content['scroll_pos_cyclops'])
                    localStorage.setItem(url, JSON.stringify(content))
                });
                iframeDoc.addEventListener('mousemove', () => {
                    iframeDoc.body.style.cursor = 'default';
                });
            });
        });

        // Sync scroll
        //
        leftIframe.addEventListener("load", function() {
            leftIframe.contentWindow.addEventListener("scroll", function() {
                // console.log('left:', leftIframe.contentWindow.scrollY, '; right:', rightIframe.contentWindow.scrollY)
                rightIframe.contentDocument.scrollingElement.scrollTop = leftIframe.contentDocument.scrollingElement.scrollTop
                // console.log('NEW RIGHT:', rightIframe.contentWindow.scrollY)
            });
        });
        rightIframe.addEventListener("load", function() {
            rightIframe.contentWindow.addEventListener("scroll", function() {
                // console.log('right:', rightIframe.contentWindow.scrollY, '; left:', leftIframe.contentWindow.scrollY)
                leftIframe.contentDocument.scrollingElement.scrollTop = rightIframe.contentDocument.scrollingElement.scrollTop
                // console.log('NEW LEFT:', leftIframe.contentWindow.scrollY)
            });
        });

        // Set cookies
        //
        content['active'] = true
        localStorage.setItem(url, JSON.stringify(content))
    }

    // Decyclops
    //
    function decyclops() {
        // Get cookies
        //
        const url = window.location.href
        content = JSON.parse(localStorage.getItem(url))
        if (content === null) {
            var content = {};
        }

        // Delete cyclops wrapper
        //
        const wrapperTag = document.getElementById('main-cyclops');
        document.getElementsByTagName('body')[0].removeChild(wrapperTag);

        // Delete style
        //
        const styleTag = document.getElementById('style-cyclops');
        document.getElementsByTagName('head')[0].removeChild(styleTag);

        // Set cookies
        //
        content['active'] = false
        localStorage.setItem(url, JSON.stringify(content))
    }

    // Trigger
    //
    browser.runtime.onMessage.addListener((message) => {
        if (message.action == true) {
            cyclops();
        } else {
            decyclops();
        }
    });
})();

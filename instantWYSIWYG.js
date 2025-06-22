/**
 * @license MIT
 * 
 * Instant WYSIWYG
 * Version 1.0.0
 * Copyright (c) 2025 Fatos Bediu
 * 
 * Instant WYSIWYG is a script that turns any HTML page it's included in
 * into a WYSIWYG editor, allowing users to edit the page's content 
 * directly in the browser.
 */
injectStyle();
/* */
var supportedTextTags = [
    'SPAN', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LABEL'
];
var supportedTags = [
    'DIV',
    'IMG',
    'VIDEO',
    'A',
    'BUTTON',
    ...supportedTextTags
];
/* */
document.body.addEventListener('mouseover', function(event) {
    event.target.setAttribute('instant-wysiwyg-hover', '');
});
document.body.addEventListener('mouseout', function(event) {
    event.target.removeAttribute('instant-wysiwyg-hover');
});
/* */
document.body.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    removeSettingsWindow();
    createSettingsWindow(event.target, event.target.tagName);
});
document.body.addEventListener('scroll', function(event) {
    removeSettingsWindow();
});
/* */
function createSettingsWindow(element, tagName) {
    /**
     * Unselect the previously selected element
     */
    let previousSelectedElement = document.querySelector('[instant-wysiwyg-selected]');
    if (previousSelectedElement) {
        previousSelectedElement.removeAttribute('instant-wysiwyg-selected');
        previousSelectedElement.removeAttribute('contenteditable');
    };
    /**
     * Ignore settings window for elements that are not
     * interactive or not allowed to be styled.
     */
    if (!supportedTags.includes(tagName)) {
        return;
    }
    /* */
    element.setAttribute('instant-wysiwyg-selected', '');
    element.setAttribute('contenteditable', 'true');
    /* */
    let windowEl = document.createElement('div');
    let h = 300;
    let w = 270;
    let top;
    let left;
    /**
     * In here, we set the settings window size based on the tag name,
     * which for each tag name, we have different settings.
     */
    if (tagName === 'DIV') {
        h = 450;
    }
    if (supportedTextTags.includes(tagName)) {
        h = 360;
    }
    if (tagName === 'IMG') {
        h = 225;
    }
    if (tagName === 'VIDEO') {
        h = 225;
    }
    if (tagName === 'A') {
        h = 225;
    }
    if (tagName === 'BUTTON') {
        h = 240;
    }
    /* */
    windowEl.id = 'instant-wysiwyg-window';
    windowEl.style.position = 'fixed';
    windowEl.style.width = w + 'px';
    windowEl.style.height = h + 'px';
    windowEl.style.backgroundColor = 'white';
    windowEl.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    windowEl.style.borderRadius = '12px';
    windowEl.style.zIndex = '1000';
    windowEl.style.padding = '15px';
    windowEl.style.overflow = 'auto';
    windowEl.style.fontFamily = 'sans-serif';
    windowEl.style.fontSize = '14px';
    windowEl.style.color = 'black';
    /**
     * In here, we determine whether to show the settings window
     * at the top of the element, right, bottom, or left.
     */
    let targetRect = element.getBoundingClientRect();
    let viewportW = window.innerWidth;
    let viewportH = window.innerHeight;
    let elementW = targetRect.width;
    let elementH = targetRect.height + 10;
    let elementTop = targetRect.top + 10;
    let elementLeft = targetRect.left;
    /* bottom-left */
    if (elementTop + elementH + h <= viewportH && elementLeft + w <= viewportW) {
        top = elementTop + elementH;
        left = elementLeft;
    }
    /* bottom-right */
    else if (elementTop + elementH + h <= viewportH && elementLeft + w > viewportW) {
        top = elementTop + elementH;
        left = viewportW - w;
    }
    /* top-left */
    else if (elementTop - h >= 0 && elementLeft + w <= viewportW) {
        top = elementTop - h;
        left = elementLeft;
    }
    /* top-right */
    else if (elementTop - h >= 0 && elementLeft + w > viewportW) {
        top = elementTop - h;
        left = viewportW - w;
    }
    /* fallback */
    else {
        top = 20;
        left = 20;
    }
    /* */
    windowEl.style.top = top + 'px';
    windowEl.style.left = left + 'px';
    /* DIV */
    if (tagName === 'DIV') {
        windowEl.innerHTML = `
            <p class="gap-5">Dimensions (px)</p>
            <div class="flex gap-5">
                <input type="number" value="${element.offsetWidth}" placeholder="Width" oninput="onStyleInput(event, 'width', 'px')" />
                <input type="number" value="${element.offsetHeight}" placeholder="Height" oninput="onStyleInput(event, 'height', 'px')" />
            </div>
            <p class="mt-5">Margin (px)</p>
            <div class="flex gap-5">
                <input type="number" value="${parseInt(getComputedStyle(element).marginTop)}" placeholder="Top" oninput="onStyleInput(event, 'marginTop', 'px')" />
                <input type="number" value="${parseInt(getComputedStyle(element).marginRight)}" placeholder="Right" oninput="onStyleInput(event, 'marginRight', 'px')" />
            </div>
            <div class="flex gap-5">
                <input type="number" value="${parseInt(getComputedStyle(element).marginBottom)}" placeholder="Bottom" oninput="onStyleInput(event, 'marginBottom', 'px')" />
                <input type="number" value="${parseInt(getComputedStyle(element).marginLeft)}" placeholder="Left" oninput="onStyleInput(event, 'marginLeft', 'px')" />
            </div>
            <p class="mt-5">Padding (px)</p>
            <div class="flex gap-5">
                <input type="number" value="${parseInt(getComputedStyle(element).paddingTop)}" placeholder="Top" oninput="onStyleInput(event, 'paddingTop', 'px')" />
                <input type="number" value="${parseInt(getComputedStyle(element).paddingRight)}" placeholder="Right" oninput="onStyleInput(event, 'paddingRight', 'px')" />
            </div>
            <div class="flex gap-5">    
                <input type="number" value="${parseInt(getComputedStyle(element).paddingBottom)}" placeholder="Bottom" oninput="onStyleInput(event, 'paddingBottom', 'px')" />
                <input type="number" value="${parseInt(getComputedStyle(element).paddingLeft)}" placeholder="Left" oninput="onStyleInput(event, 'paddingLeft', 'px')" />
            </div>
            <p class="mt-5">Background Color</p>
            <input type="color" value="${getComputedStyle(element).backgroundColor}" placeholder="Background Color" oninput="onStyleInput(event, 'backgroundColor', '')" />
            <p class="mt-5">Radius</p>
            <input type="number" value="${parseInt(getComputedStyle(element).borderRadius)}" placeholder="Border Radius" oninput="onStyleInput(event, 'borderRadius', 'px')" />
        `;
    };
    /* text */
    if (supportedTextTags.includes(tagName)) {   
        windowEl.innerHTML = `
            <p>Font Family</p>
            <input type="text" value="${getComputedStyle(element).fontFamily}" placeholder="Font Family" oninput="onStyleInput(event, 'fontFamily', '')" />
            <p class="mt-5">Size (PX) & Style</p>
            <div class="flex gap-5">
                <input type="number" value="${parseInt(getComputedStyle(element).fontSize)}" placeholder="Font Size" oninput="onStyleInput(event, 'fontSize', 'px')" />
                <select oninput="onStyleInput(event, 'fontStyle', '')">
                    <option value="normal" ${getComputedStyle(element).fontStyle === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="italic" ${getComputedStyle(element).fontStyle === 'italic' ? 'selected' : ''}>Italic</option>
                    <option value="oblique" ${getComputedStyle(element).fontStyle === 'oblique' ? 'selected' : ''}>Oblique</option>
                </select>
            </div>
            <p class="mt-5">Text Align</p>  
            <select oninput="onStyleInput(event, 'textAlign', '')">
                <option value="left" ${getComputedStyle(element).textAlign === 'left' ? 'selected' : ''}>Left</option>
                <option value="center" ${getComputedStyle(element).textAlign === 'center' ? 'selected' : ''}>Center</option>
                <option value="right" ${getComputedStyle(element).textAlign === 'right' ? 'selected' : ''}>Right</option>
                <option value="justify" ${getComputedStyle(element).textAlign === 'justify' ? 'selected' : ''}>Justify</option>
            </select>
            <p class="gap-5 mt-5">Background & Text</p>
            <div class="flex gap-5">
                <input type="color" value="${getComputedStyle(element).backgroundColor}" placeholder="Background Color" oninput="onStyleInput(event, 'backgroundColor', '')" />
                <input type="color" value="${getComputedStyle(element).color}" placeholder="Text Color" oninput="onStyleInput(event, 'color', '')" />
            </div>
            <p class="mt-5">Line Height (px)</p>
            <input type="number" value="${parseInt(getComputedStyle(element).lineHeight)}" placeholder="Line Height" oninput="onStyleInput(event, 'lineHeight', 'px')" />
        `;
    };
    /* IMG */
    if (tagName === 'IMG') {
        windowEl.innerHTML = `
            <p>Source</p>
            <input type="text" value="${element.src}" placeholder="Image Source" oninput="onInput(event, 'src', '')" />
            <p class="mt-5">Alt (px)</p>
            <input type="text" value="${element.alt}" placeholder="Image Alt Text" oninput="onInput(event, 'alt', '')" />
            <p class="mt-5">Dimensions (px)</p>
            <div class="flex gap-5">
                <input type="number" value="${element.offsetWidth}" placeholder="Width" oninput="onStyleInput(event, 'width', 'px')" />
                <input type="number" value="${element.offsetHeight}" placeholder="Height" oninput="onStyleInput(event, 'height', 'px')" />
            </div>
        `;
    };
    /* VIDEO */
    if (tagName === 'VIDEO') {
        windowEl.innerHTML = `
            <p>Source</p>
            <input type="text" value="${element.src}" placeholder="Image Source" oninput="onInput(event, 'src', '')" />
            <p class="mt-5">Alt (px)</p>
            <input type="text" value="${element.alt}" placeholder="Image Alt Text" oninput="onInput(event, 'alt', '')" />
            <p class="mt-5">Dimensions (px)</p>
            <div class="flex gap-5">
                <input type="number" value="${element.offsetWidth}" placeholder="Width" oninput="onStyleInput(event, 'width', 'px')" />
                <input type="number" value="${element.offsetHeight}" placeholder="Height" oninput="onStyleInput(event, 'height', 'px')" />
            </div>
        `;
    };
    /* A */
    if (tagName === 'A') {
        windowEl.innerHTML = `
            <p>Link</p>
            <input type="text" value="${element.href}" placeholder="Link URL" oninput="onInput(event, 'href', '')" />
            <p class="mt-5">Text</p>
            <input type="text" value="${element.textContent}" placeholder="Link Text" oninput="onInput(event, 'textContent', '')" />
            <p class="mt-5">Target</p>
            <select oninput="onInput(event, 'target', '')">
                <option value="_self" ${element.target === '_self' ? 'selected' : ''}>Same Tab</option>
                <option value="_blank" ${element.target === '_blank' ? 'selected' : ''}>New Tab</option>
                <option value="_parent" ${element.target === '_parent' ? 'selected' : ''}>Parent Frame</option>
                <option value="_top" ${element.target === '_top' ? 'selected' : ''}>Full Body</option>
            </select>
        `;
    }
    /* BUTTON */
    if (tagName === 'BUTTON') {
        windowEl.innerHTML = `
            <p>Text</p>
            <input type="text" value="${element.textContent.trim()}" placeholder="Button Text" oninput="onInput(event, 'textContent', '')" />
            <p class="mt-5">On click</p>
            <textarea type="text" placeholder="JavaScript Function" oninput="onInput(event, 'onclick', '')">${element.getAttribute('onclick') ? element.getAttribute('onclick').toString().trim() : ''}</textarea>
        `;
    }
    /**
     * prevent clicks on the settings window from
     * selecting the element again.
     */
    windowEl.addEventListener('click', function(event) {
        event.stopPropagation(); 
    });
    /* */
    document.body.insertAdjacentElement('afterend', windowEl);
}
/* */
function removeSettingsWindow() {
    let windowEl = document.getElementById('instant-wysiwyg-window');
    if (windowEl) {
        windowEl.remove();
    }
}
/* */
function onStyleInput(event, property, unit) {
    let input = event.target;
    let value = input.value + unit;
    let element = document.querySelector('[instant-wysiwyg-selected]');
    if (!element) return;
    /* */
    element.style[property] = value;
    /* */
    emitUpdate(element);
};
function onInput(event, property, unit) {
    let input = event.target;
    let value = input.value + unit;
    let element = document.querySelector('[instant-wysiwyg-selected]');
    if (!element) return;
    /* */
    element[property] = value;
    /* */
    if (property === 'onclick') {
        element.setAttribute('onclick', value);
    };
    /* */
    emitUpdate(element);
}
/* */
function injectStyle() {
    let style = document.createElement('style');
    style.innerHTML = `
        #instant-wysiwyg-window {
            transition: all 0.3s ease;
        }
        #instant-wysiwyg-window:hover {
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
        }
        [instant-wysiwyg-hover] {
            outline: 2px dashed blue;
        }
        [instant-wysiwyg-selected] {
            outline: 2px solid blue !important;
        }
        .flex {
            display: flex;
        }
        .f-column {
            flex-direction: column;
        }
        .a-center {
            align-items: center;
        }
        .gap-5 {
            gap: 5px;    
        }
        .mt-5 {
            margin-top: 5px;
        }
        input, select {
            width: 100%;
            height: 30px;
            padding: 5px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 6px;
            background-color: transparent;
        }
        textarea {
            width: 100%;
            height: 105px;
            padding: 5px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 6px;
            background-color: transparent;
            resize: none;
        }
        input[type="color"] {
            padding: 0;
        }
        p {
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
};
/**
 * Since your page is supposed to be inside an iframe, this function
 * will remove any script artifacts and emit an update event with 
 * the modified HTML when an element is updated.
 */
function emitUpdate(element) {
    let clonedPage = document.cloneNode(true);
    /**
     * We remove the selected & hovered attributes, which might
     * have been added to the elements.
     */
    clonedPage.querySelectorAll('[instant-wysiwyg-selected], [instant-wysiwyg-hover]').forEach(el => {
        el.removeAttribute('instant-wysiwyg-selected');
        el.removeAttribute('instant-wysiwyg-hover');
        el.removeAttribute('contenteditable');
    });
    /**
     * We remove the settings window, which is not needed
     * in the cloned page.
     */
    let settingsWindow = clonedPage.getElementById('instant-wysiwyg-window');
    if (settingsWindow) {
        settingsWindow.remove();
    }
    /**
     * We remove self, which is the script that is running
     * this code, so that it doesn't interfere with the cloned page.
     */
    let script = clonedPage.querySelector('script[src*="instantWISYWIG.js"]');
    if (script) {
        script.remove();
    };
    /* emit to parent */
    window.parent.postMessage({
        type: 'instant-wysiwyg-update',
        html: clonedPage.documentElement.outerHTML
    }, '*');
};
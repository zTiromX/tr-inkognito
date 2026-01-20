const storedState = localStorage.getItem('tr_privacy_active');
let privacyActive = storedState === null ? true : (storedState === 'true');

function createToggleButton() {
    if (document.getElementById('tr-privacy-toggle-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'tr-privacy-toggle-btn';
    updateButtonState(btn);
    btn.onclick = togglePrivacy;
    document.body.appendChild(btn);
}

function updateButtonState(btn) {
    if (privacyActive) {
        btn.innerText = '🔒 Privacy ON';
        btn.classList.add('active');
    } else {
        btn.innerText = '👁️ Privacy OFF';
        btn.classList.remove('active');
    }
}

function togglePrivacy() {
    privacyActive = !privacyActive;
    localStorage.setItem('tr_privacy_active', privacyActive);
    
    const btn = document.getElementById('tr-privacy-toggle-btn');
    updateButtonState(btn);

    if (privacyActive) {
        hideSensitiveData();
    } else {
        revealData();
    }
}

function hideSensitiveData() {
    if (!privacyActive) return;

    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    while (node = walker.nextNode()) {
        const text = node.nodeValue;

        if ((text.includes('€') || text.includes('$')) && !text.includes('%')) {
            const parent = node.parentElement;
            
            if (parent && parent.id !== 'tr-privacy-toggle-btn' && !parent.classList.contains('tr-privacy-hidden')) {
                parent.classList.add('tr-privacy-hidden');
            }
        }
    }
}

function revealData() {
    const hiddenElements = document.querySelectorAll('.tr-privacy-hidden');
    hiddenElements.forEach(el => {
        el.classList.remove('tr-privacy-hidden');
    });
}

const observer = new MutationObserver((mutations) => {
    if (privacyActive) {
        hideSensitiveData();
    }
});

window.onload = () => {
    createToggleButton();
    if (privacyActive) hideSensitiveData();
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
};
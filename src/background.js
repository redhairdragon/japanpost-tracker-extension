let trackingNumber = '';

chrome.tabs.onActivated.addListener((tab) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab.url.includes("japanpost.jp")) {
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                files: ["src/content.js"]
            });
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.trackingNumber) {
        trackingNumber = message.trackingNumber;
    }
});

chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "popup") {
        port.postMessage({ trackingNumber: trackingNumber });
    }
});
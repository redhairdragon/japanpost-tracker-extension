function getTrackingNumber() {
    let trackingNumber = document.querySelector('table[summary="配達状況詳細"] tbody tr:nth-child(2) td.w_180')?.textContent.trim();
    return trackingNumber;
}

chrome.runtime.sendMessage({ action: "jppost_extraction", trackingNumber: getTrackingNumber() });

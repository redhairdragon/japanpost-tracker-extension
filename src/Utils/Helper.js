function load_tracking_data_from_storage() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['trackingItems'], function(result) {
            console.log('Value currently is ' + result.trackingItems);
            resolve(result.trackingItems || []); // Return empty array if undefined
        });
    });
}

function save_tracking_data_to_storage(items) {
    return new Promise((resolve) => {
        chrome.storage.sync.set({ trackingItems: items }, function() {
            console.log('Tracking items saved');
            resolve();
        });
    });
}

export { load_tracking_data_from_storage, save_tracking_data_to_storage };

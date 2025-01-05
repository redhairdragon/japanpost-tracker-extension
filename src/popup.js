import { JapanPostTracker } from './Tracker/JapanPostTracker.js';
import { JapanPostStatus } from './Status/JapanPostStatus.js';
import { load_tracking_data_from_storage, save_tracking_data_to_storage } from './Utils/Helper.js';

const form = document.getElementById('tracking-form');
const trackingList = document.getElementById('tracking-list');
const trackingInput = document.getElementById('tracking-number');
const trackingItems = [];

const jppostTracker = new JapanPostTracker();

function attachRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            trackingItems.splice(index, 1);
            updateTrackingList();
        });
    });
}

function updateTrackingList() {
    trackingList.innerHTML = '';
    trackingItems.forEach((item, index) => {
        const listItem = document.createElement('div');
        listItem.className = 'tracking-item';
        listItem.innerHTML = `
            <span>${item.itemNumber}</span>
            <span>Status: ${item.getLastestStatus().status}</span>
            <span>Last Location: ${item.getLastestStatus().office},  ${item.getLastestStatus().location}</span>
            <button class="remove-button btn btn-danger" data-index="${index}">Remove</button>
        `;
        trackingList.appendChild(listItem);
    });
    attachRemoveButtons();
}

load_tracking_data_from_storage().then(items => {
    console.log('Loaded tracking items:', JSON.stringify(items));
    trackingItems.length = 0; // Clear the array
    items.forEach(item => {
        const jppostStatus = new JapanPostStatus(item.itemNumber, item.status, item.history);
        trackingItems.push(jppostStatus);
    });
    updateTrackingList(); // Call updateTrackingList after loading data
});


document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let trackingNumber = trackingInput.value.trim();
        trackingNumber = trackingNumber.replace(/\s+/g, ''); // Remove spaces
        console.log("Tracking Number: " + trackingNumber);

        if (trackingNumber) {
            addTrackingItem(trackingNumber);
            trackingInput.value = '';
        }
    });

    function addTrackingItem(trackingNumber) {
        console.log("Adding tracking item: " + trackingNumber);

        if (trackingItems.some(item => item.itemNumber === trackingNumber)) {
            console.log('Tracking number already exists');
            return;
        }

        const jppostStatus = new JapanPostStatus(trackingNumber, '', []);
        trackingItems.push(jppostStatus);

        jppostTracker.getTrackingStatus(trackingNumber).then((trackingInfo) => {
            jppostStatus.history = trackingInfo.history;
            updateTrackingList();
            save_tracking_data_to_storage(trackingItems).then(() => {
                console.log('Save completed');
            });
        });
        updateTrackingList();
    }
});

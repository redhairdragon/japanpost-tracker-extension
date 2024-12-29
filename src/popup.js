const trackingItems = [];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tracking-form');
    const trackingInput = document.getElementById('tracking-number');
    const trackingList = document.getElementById('tracking-list');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const trackingNumber = trackingInput.value.trim();
        console.log(trackingNumber);
        if (trackingNumber) {
            addTrackingItem(trackingNumber);
            trackingInput.value = '';
        }
    });

    function addTrackingItem(trackingNumber) {
        const item = {
            number: trackingNumber,
            status: 'Pending',
            lastUpdate: new Date().toLocaleString()
        };
        trackingItems.push(item);
        updateTrackingList();
    }

    function updateTrackingList() {
        trackingList.innerHTML = '';
        trackingItems.forEach((item, index) => {
            const listItem = document.createElement('div');
            listItem.className = 'tracking-item';
            listItem.innerHTML = `
                <span>${item.number}</span>
                <span>Status: ${item.status}</span>
                <span>Last Update: ${item.lastUpdate}</span>
                <button class="remove-button" data-index="${index}">Remove</button>
            `;
            trackingList.appendChild(listItem);
        });
        attachRemoveButtons();
    }

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
});
import { JapanPostStatus } from '../Status/JapanPostStatus.js';

class JapanPostTracker {
    constructor() {
        this.baseUrl = 'https://trackings.post.japanpost.jp/services/srv/search';
    }

    async getTrackingStatus(trackingNumber) {
        if (typeof trackingNumber !== 'string' || trackingNumber.trim() === '') {
            throw new Error('Invalid tracking number');
        }

        const sanitizedNum = trackingNumber.replace(/\s+/g, ''); // Remove spaces
        const payload = {
            search: 'Tracking start',
            locale: 'en',
            requestNo1: sanitizedNum
        };

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(payload).toString(),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const text = await response.text();
            return this.parseTrackingStatus(text);
        } catch (error) {
            console.error('Failed to fetch tracking status:', error);
            return null;
        }
    }

    parseTrackingStatus(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const trackingInfo = {
            itemNumber: '',
            itemType: '',
            additionalServices: '',
            history: []
        };


        // Get main tracking details from the first table
        const mainTable = doc.querySelector('table.tableType01');
        if (mainTable) {
            const rows = mainTable.querySelectorAll('tr');
            if (rows.length > 1) {
                const cells = rows[1].querySelectorAll('td');
                trackingInfo.itemNumber = cells[0].textContent.trim();
                trackingInfo.itemType = cells[1].textContent.trim();
                trackingInfo.additionalServices = cells[2].textContent.trim();
            }
        }

        // Get history information from the second table
        const historyTable = doc.querySelectorAll('table.tableType01')[1];
        if (historyTable) {
            const rows = Array.from(historyTable.querySelectorAll('tr'));

            // Skip the first two header rows
            for (let i = 2; i < rows.length; i += 2) {
                const currentRow = rows[i];
                const nextRow = rows[i + 1];

                if (!currentRow || !nextRow) continue;

                const currentCells = currentRow.querySelectorAll('td');
                const nextCells = nextRow.querySelectorAll('td');

                if (currentCells.length >= 5) {
                    const historyEntry = {
                        date: currentCells[0].textContent.trim(),
                        status: currentCells[1].textContent.trim(),
                        details: currentCells[2].textContent.trim(),
                        office: currentCells[3].textContent.trim(),
                        location: currentCells[4].textContent.trim(),
                        zipCode: nextCells[0]?.textContent.trim() || ''
                    };
                    trackingInfo.history.push(historyEntry);
                }
            }
        }

        let jppostStatus = new JapanPostStatus(
            trackingInfo.itemNumber, 
            trackingInfo.itemType,
            trackingInfo.history
        );

        return jppostStatus;
    }
}

export { JapanPostTracker };
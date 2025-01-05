class JapanPostStatus {
    constructor(itemNumber, itemType, history) {
        this.itemNumber = itemNumber;
        this.itemType = itemType;
        this.history = history;
    }

    getLastestStatus() {
        if (this.history.length > 0) {
            return this.history[this.history.length-1];
        }
        return {
            date: '',
            status: '',
            details: '',
            office: '',
            location: '',
            zipCode: ''
        };
    }
}

export { JapanPostStatus };
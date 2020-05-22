import { LightningElement, track, api } from 'lwc';
import GET_WISH from '@salesforce/apex/GetMessages.getWishesByOcc';

export default class GiveThanks extends LightningElement {

    @track selectedUsers = [];
    @track count = 0;

    @track selectedOcassionId;
    @track userSelection;
    @track writeNoteToUsers;
    @track sendEmail = false;

    @api
    get thanksOpen() {
        return this.userSelection
    }

    set thanksOpen(value) {
        this.userSelection = value;
    }

    @track wishes = [];
    @api
    get ocassion() {
        return this.selectedOcassionId
    }

    set ocassion(value) {
        this.selectedOcassionId = value;
    }

    connectedCallback() {
        this.getWishes('');
        this.userSelection = true;
    }

    getWishes(searchTerm) {
        GET_WISH({
            occId: this.selectedOcassionId
        }).then(response => {
            this.wishes = [];
            if (searchTerm === '')
                this.wishes = JSON.parse(JSON.stringify(response));
            for (let i = 0; i < response.length; i++) {
                let StrippedString = response[i].HTB__Wish__c.replace(/(<([^>]+)>)/ig, "");
                if (searchTerm === '') {
                    this.wishes[i].HTB__Wish__c = StrippedString;
                    this.firstSearch = true;
                } else {

                    if (response[i].Owner.Name.toLowerCase().includes(searchTerm.toLowerCase()) || StrippedString.toLowerCase().includes(searchTerm.toLowerCase())) {
                        this.wishes.push(JSON.parse(JSON.stringify(response[i])));
                        this.wishes[this.wishes.length - 1].HTB__Wish__c = StrippedString;
                    }
                }
            }
        })
    }

    changeIconType(event) {
        event.target.iconName = "action:check";
        this.selectedUsers.push({ userName: event.target.dataset.user, id: event.target.dataset.userid });
        this.count = this.count + 1;

    }

    removeUser(event) {
        this.selectedUsers = this.selectedUsers.filter(item => item.id != event.target.dataset.user);
        this.template.querySelector('[data-userid="' + event.target.dataset.user + '"]').iconName = "utility:add";
        this.count = this.count - 1;
    }
    search(event) {
        this.getWishes(event.target.value);
    }

    closeThanksPopup() {
        this.dispatchEvent(
            new CustomEvent('closethanks')
        );
    }

    writeNote() {
        this.userSelection = false;
        this.writeNoteToUsers = true;
    }

    sendNote() {
        this.sendEmail = true;
    }

}
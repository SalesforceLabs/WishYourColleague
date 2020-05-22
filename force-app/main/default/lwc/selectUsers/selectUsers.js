import { LightningElement, api, track } from 'lwc';


export default class SelectUsers extends LightningElement {
    @api user;
    @api profile;
    @track applyClass;
    @track selectedUser;


    @api
    get selctedUserId() {
        return this.selectedUser;
    }

    set selctedUserId(value) {
        if (value === this.user.HTB__User__c) {
            this.applyClass = "selected";
            this.dispatchEvent(
                new CustomEvent('updateselecteduser', {
                    detail: {
                        selected: this.user
                    }
                })
            )
        } else
            this.applyClass = "";

    }


}
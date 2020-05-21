import { LightningElement, track, api } from 'lwc';
import THANK_USERS from '@salesforce/apex/ThankedMessages.updateMessages';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class WriteANote extends LightningElement {

    @track users = [];
    @api selectedUsers;
    @api ocassionId;
    @track isSend = null;

    @api
    get send() {
        return this.isSend;
    }

    set send(value) {
        this.isSend = value;
        if (this.isSend === true)
            this.sendEmail()
    }

    sendEmail() {
        let emailBody = this.template.querySelector('[data-element="emailbody"]').value;
        if (emailBody != "" && this.users.length > 0) {

            let userIds = this.users.map(item => item.id);
            THANK_USERS({
                emailBody: emailBody,
                yourOccId: this.ocassionId,
                Users: userIds
            }).then(() => {
                const evt = new ShowToastEvent({
                    title: 'Thanks Sent!!',
                    variant: 'Success'
                });
                this.dispatchEvent(evt);

                this.dispatchEvent(
                    new CustomEvent('popupclose')
                )
            })
        } else {
            const evt = new ShowToastEvent({
                title: 'No content',
                message: 'Please input the content that needs to be sent to the users selected',
                variant: 'error'
            });
            this.dispatchEvent(evt);
        }

    }


    connectedCallback() {
        this.users = this.selectedUsers;
    }

    removeUser(event) {
        console.log(JSON.stringify(this.users));
        this.users = this.users.filter(item => item.id != event.target.dataset.userid);
    }

}
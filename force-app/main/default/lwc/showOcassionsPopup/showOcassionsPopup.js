import { LightningElement, track } from 'lwc';
import GETOCC from '@salesforce/apex/UsersOcassions.getOcassions';

export default class ShowOcassionsPopup extends LightningElement {
    @track ocassions = [];

    selectedOcassionId;

    closeModal() {
        this.dispatchEvent(
            new CustomEvent('closeocassionpopup')
        )
    }

    getOcc(searchTerm) {
        GETOCC({
                keyTerm: searchTerm
            })
            .then(response => {
                //console.log(JSON.stringify(response));
                this.ocassions = response.map(row => {
                    let obj = { id: "", ocassionName: "", occDate: "" };
                    obj.ocassionName = row.HTB__Occasion__r.Name;
                    obj.occDate = row.HTB__Ocassion_Date__c;
                    obj.id = row.Id;
                    return obj;
                })
            })

    }
    getOcassions(event) {
        this.getOcc(event.target.value);
        console.log(event.target.value);
    }

    connectedCallback() {
        this.getOcc('');

    }

    handleOcassionSelect(event) {
        if (this.template.querySelector('.radioChecked') != null) {
            this.template.querySelector('.radioChecked').checked = false;
            this.template.querySelector('.radioChecked').classList.remove('radioChecked');
        }
        event.target.classList.add('radioChecked');
        this.selectedOcassionId = event.currentTarget.dataset.ocassionid;
    }

    handlesendOcassionId() {
        this.dispatchEvent(
            new CustomEvent('ocassionselected', { detail: this.selectedOcassionId })
        )


    }
}
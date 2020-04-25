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

    connectedCallback() {
        GETOCC()
            .then(response => {
                this.ocassions = response.map(row => {
                    let obj = { id: "", ocassionName: "", occDate: "" };
                    obj.ocassionName = row.Occasion__r.Name;
                    obj.occDate = row.Ocassion_Date__c;
                    obj.id = row.Id;
                    return obj;
                })
            })

    }

    handleOcassionSelect(event) {
        this.selectedOcassionId = event.currentTarget.dataset.ocassionid;
        this.template.querySelector('.selected') != null ? this.template.querySelector('.selected').classList.remove('selected') : '';
        event.currentTarget.classList.add('selected');

    }

    handlesendOcassionId() {
        this.dispatchEvent(
            new CustomEvent('ocassionselected',{detail:this.selectedOcassionId})
        )


    }
}
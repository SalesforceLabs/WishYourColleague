import { LightningElement, api, track } from 'lwc';
import OCC_ICON from '@salesforce/resourceUrl/OcassionGenericIcon';

export default class SelectOcassion extends LightningElement {
    @track ICON = OCC_ICON;
    @track selectedOcassion;
    @api occ;
    @track applyClass;
    @track ocassionDate = '';

    @api
    get selctedOccId() {
        return this.selectedOcassion;
    }

    set selctedOccId(value) {
        let occDate = this.occ.HTB__Ocassion_Date__c.split('-');
        this.ocassionDate = occDate[2] + '/' + occDate[1];
        if (value === this.occ.Id) {
            this.applyClass = "selected";
            this.dispatchEvent(
                new CustomEvent('updateselectedocassion', {
                    detail: {
                        selected: this.occ
                    }
                })
            )
        } else
            this.applyClass = "";

    }

}
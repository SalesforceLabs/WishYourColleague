import { LightningElement,api,track } from 'lwc';

export default class SelectOcassion extends LightningElement {
    @track selectedOcassion;
    @api occ;
    @track applyClass;

    @api
    get selctedOccId(){
        return this.selectedOcassion;
    }

    set selctedOccId(value){
        if(value === this.occ.Id){
            this.applyClass= "selected";
            this.dispatchEvent(
                new CustomEvent('updateselectedocassion', {detail : {
                    selected: this.occ
                }})
            )
        }
        else
            this.applyClass = "";
        
    }

}
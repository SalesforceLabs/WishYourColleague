import { LightningElement,api } from 'lwc';

export default class UploadYourOwnTemplate extends LightningElement {
    @api recId;
    handleUploadFinished(){
        //console.log(this.recId);
        this.dispatchEvent(
            new CustomEvent('updatetemplates',{detail:""})
        )
    }
}
import { LightningElement,api,track,wire } from 'lwc';
import{CurrentPageReference} from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { fireEvent } from 'c/pubsub';

export default class OpenPopUpOnProfile extends LightningElement {
    @api userId;
    @track selectedUser;
    @wire (CurrentPageReference) pageRef;
    @track usernameUpdated=false;

    connectedCallback(){
        registerListener('passusername', this.updateSelectedUser, this);
    }

    disconnectedCallback(){
        unregisterAllListeners(this);
    }

    updateSelectedUser(selectedUser){
        this.selectedUser = selectedUser;
        this.usernameUpdated = true;
    }

    closeModal(){
        fireEvent(this.pageRef,'closemodal',"");
    }
}
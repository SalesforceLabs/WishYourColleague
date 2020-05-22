import { LightningElement, track } from 'lwc';
import GETOCC from '@salesforce/apex/CreateYourOcassions.getOcassions';
import { createRecord } from 'lightning/uiRecordApi';
import YOUROCCOBJ from '@salesforce/schema/Your_Ocassion__c';
import HIDE_FIELD from '@salesforce/schema/Your_Ocassion__c.Hide_the_wishes__c';
import Ocassion_Date_FIELD from '@salesforce/schema/Your_Ocassion__c.Ocassion_Date__c'
import Ocassion_FIELD from '@salesforce/schema/Your_Ocassion__c.Occasion__c';
import USER_FIELD from '@salesforce/schema/Your_Ocassion__c.User__c';
import USER_ID from '@salesforce/user/Id';
import GetAllOccasionsThisYear from '@salesforce/apex/UsersOcassions.getAllOccasionsThisYear';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class App extends LightningElement {
    @track ocassions = [];

    updateYourOcassions = [];
    @track showSpinner = false;
    @track showOcc = false;

    connectedCallback() {

        GETOCC()
            .then(response => {
                this.showSpinner = true;
                this.ocassions = response;
                GetAllOccasionsThisYear()
                    .then(resp => {
                        this.ocassions = this.ocassions.filter(item => {
                            for (let i = 0; i < resp.length; i++) {
                                if (resp[i].HTB__Occasion__c === item.Id)
                                    return false;
                            }
                            return true;
                        })
                        this.showSpinner = false;
                        this.ocassions.length > 0 ? this.showOcc = true : this.showOcc = false;
                    })

            })
    }

    updateDate(event) {
        let occName = event.target.dataset.occtype;
        let occHide = this.template.querySelector('[ data-occhide="' + occName + '"]').checked;
        this.checkAndCreate(occName, event.target.value, occHide);
        console.log(this.updateYourOcassions);
    }

    hideWishes(event) {
        let occName = event.target.dataset.occhide;
        let occDate = this.template.querySelector('[ data-occtype="' + occName + '"]').value;
        let occHide = this.template.querySelector('[ data-occhide="' + occName + '"]').checked;
        this.checkAndCreate(occName, occDate, occHide);
    }

    checkAndCreate(occName, occDate, hide) {
        this.updateYourOcassions.forEach((item, index) => {
            if (Object.keys(item)[0] === occName) {
                item[occName].hide = hide;
                item[occName].occDate = occDate;
            } else if (index === this.updateYourOcassions.length - 1) {

                let obj = {};
                obj[occName] = {
                    hide: hide,
                    occDate: occDate
                }
                this.updateYourOcassions.push(obj);
            }
        })

        if (this.updateYourOcassions.length === 0) {
            console.log("length =>0");
            let obj = {};
            obj[occName] = {
                hide: hide,
                occDate: occDate
            }
            this.updateYourOcassions.push(obj);
        }
    }

    createYourOcassions() {
        for (let i = 0; i < this.updateYourOcassions.length; i++) {
            let fields = {};
            let key = Object.keys(this.updateYourOcassions[i])[0]
            fields[HIDE_FIELD.fieldApiName] = this.updateYourOcassions[i][key].hide;
            fields[Ocassion_FIELD.fieldApiName] = key;

            let occDate = this.updateYourOcassions[i][key].occDate;
            let splitDate = occDate.split("-");
            splitDate[0] = new Date().getFullYear();
            let currentYearDate = splitDate.join("-")

            fields[Ocassion_Date_FIELD.fieldApiName] = currentYearDate;
            fields[USER_FIELD.fieldApiName] = USER_ID;
            let recordInput = { apiName: YOUROCCOBJ.objectApiName, fields };
            if (this.ocassions[i].occDate != "")
                createRecord(recordInput)
                .then(resp => {
                    console.log(resp);
                    if (i === this.updateYourOcassions.length - 1) {
                        const evt = new ShowToastEvent({
                            title: 'Occasions Created',
                            variant: 'success',
                        });
                        this.dispatchEvent(evt);
                    }
                }).catch(err => {
                    console.log(err);
                })
        }
    }


}
import { LightningElement, track, wire, api } from 'lwc';
import HIDELABELS from '@salesforce/resourceUrl/HideLabels';
import { loadStyle } from 'lightning/platformResourceLoader';
import getTemplates from '@salesforce/apex/GetAttachedTemplates.getTemplates';
import getUserDetailsAndOccassions from '@salesforce/apex/GetUsers.getUsersWithOcc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import GetWishesByUser from '@salesforce/apex/GetMessages.getWishesByUser';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LOCK from '@salesforce/resourceUrl/lockIcon';


export default class WishAUser extends LightningElement {
    @track lockIcon;
    @api profile = false;
    @api userId = '';

    @track emptyTemplates = [1, 2, 3, 4, 5, 6, 7, 8];


    @wire(CurrentPageReference) pageRef;
    @track imagesURL = [];
    @track users = [];

    @track selectedUser = {
        image: "",
        name: "",
        id: "",
        prev: [],
        upcoming: [],
        hasupcoming: false,
        hasprev: false,
        selectedOcassion: "", // your ocassion Id
        selectedOcassionType: "", //ocassion id
        wish: "",
        wishId: ""
    };

    @track position = {
        x: "center",
        y: "center"
    };

    __init__() {
        this.selectedUser.image = "";
        this.selectedUser.id = "";
        this.selectedUser.prev = [];
        this.selectedUser.hasprev = false;
        this.selectedUser.hasupcoming = false;
        this.selectedUser.selectedOcassion = "";
        this.selectedUser.selectedOcassionType = "";
        this.selectedUser.wish = "";
        this.selectedUser.wishId = "";
        this.template.querySelector('[data-targettype="RTA"]').value = '';
    }

    connectedCallback() {
        this.lockIcon = LOCK;
        registerListener('positionchange', this.updatePosition, this);
        Promise.all([
                loadStyle(this, HIDELABELS),

            ])
            .then(() => {

                console.log('files loaded');
            })

        getUserDetailsAndOccassions({
                userId: this.userId
            })
            .then(response => {
                console.log(JSON.stringify(response));
                if (this.userId != '') {
                    this.selectedUser.id = this.userId;
                    this.selectedUser.name = response[0].HTB__User__r.Name;
                    this.selectedUser.prev = [];
                    this.selectedUser.upcoming = [];
                    let currentDate = new Date();
                    for (let i = 0; i < response.length; i++) {
                        if (new Date(response[i].HTB__Ocassion_Date__c) < currentDate) {
                            this.selectedUser.prev.push(response[i])
                        } else {
                            this.selectedUser.upcoming.push(response[i]);
                        }
                    }
                    this.checkocassions();
                    fireEvent(this.pageRef, 'passusername', this.selectedUser);
                } else {

                    let userIds = response.map((item) => {
                        return item.HTB__User__c;
                    })

                    userIds = userIds.filter((item, index) => {
                        return userIds.indexOf(item) >= index;
                    })
                    let j = 0;
                    for (let i = 0; i < response.length; i++) {
                        if (response[i].HTB__User__c === userIds[j]) {
                            if (j < userIds.length) {
                                this.users.push(response[i]);
                                j++;
                            } else
                                break;

                        } else
                            continue;
                    }
                }

            })
    }

    changeTemplates(occId) {

        getTemplates({
                occId: occId
            })
            .then(response => {
                this.imagesURL = [];
                let baseURL = window.location.origin;
                let URL;
                for (let i = 0; i < response.length; i++) {
                    URL = baseURL + '/sfc/servlet.shepherd/version/renditionDownload?rendition=ORIGINAL_Png&versionId=' + response[i].ContentDocument.LatestPublishedVersionId + '&operationContext=CHATTER&contentId=' + response[i].ContentBodyId;
                    this.imagesURL.push(URL);
                }
            })
            .catch(error => {
                console.log("An unexpected Error has occured " + error);
            })


    }

    handleSubmit(event) {
        event.preventDefault();
        let spanText = '<p><span style="font-size: 12px;">';
        const fields = event.detail.fields;
        fields.HTB__selected_template__c = this.selectedUser.image;
        fields.HTB__Your_Ocassion__c = this.selectedUser.selectedOcassion;

        if (this.position.x != "center")
            fields.HTB__PositionY__c = this.position.y;
        if (this.position.y != "center")
            fields.HTB__PositionX__c = this.position.x;

        if (!this.template.querySelector('[data-targettype="RTA"]').value.includes("span")) {
            let splitHTMLTags = this.template.querySelector('[data-targettype="RTA"]').value.split(/<[^>]*>/g);
            fields.HTB__Wish__c = spanText + splitHTMLTags[1] + '</span></p>';
        } else
            fields.HTB__Wish__c = this.template.querySelector('[data-targettype="RTA"]').value;
        if (fields.HTB__selected_template__c != "" && fields.HTB__Your_Ocassion__c != "")
            this.template.querySelector('lightning-record-edit-form').submit(fields);
        else {
            const errorEvt = new ShowToastEvent({
                title: 'Oops!! Template or Occasion not selected',
                variant: 'error'
            });
            this.dispatchEvent(errorEvt);
        }

    }

    handleSuccess(event) {
        this.imagesURL = [];

        this.selectedUser.id = this.selectedUser.name = this.selectedUser.image = this.selectedUser.wish = this.selectedUser.selectedOcassion = this.selectedUser.selectedOcassionType = "";
        this.selectedUser.prev = this.selectedUser.upcoming = [];
        this.selectedUser.hasprev = this.selectedUser.hasupcoming = false;

        this.template.querySelector('[data-targettype="RTA"]').value = "";
        const evt = new ShowToastEvent({
            title: 'Wishes Sent',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
        this.dispatchEvent(
            new CustomEvent('closeppopup')
        )
    }



    handleWishChange(event) {
        this.selectedUser.wish = event.target.value;
    }

    updatePosition(position) {
        if (position.x != "center") {
            this.position.x = position.x;
        }
        if (position.y != "center") {
            this.position.y = position.y;
        }
    }



    handleUserClick(event) {
        this.__init__();
        this.selectedUser.id = event.target.dataset.targetid;
    }

    handleOccClick(event) {
        this.selectedUser.wish = "";
        this.selectedUser.wishId = "";
        this.selectedUser.image = "";
        this.template.querySelector('[data-targettype="RTA"]').value = '';
        this.selectedUser.selectedOcassion = event.target.dataset.targetid;
    }

    checkocassions() {
        this.selectedUser.upcoming.length ? this.selectedUser.hasupcoming = true : this.selectedUser.hasupcoming = false;
        this.selectedUser.prev.length ? this.selectedUser.hasprev = true : this.selectedUser.hasprev = false;
    }

    updateSelectedUser(event) {
        this.selectedUser.id = event.detail.selected.HTB__User__c;
        this.selectedUser.name = event.detail.selected.HTB__User__r.Name;
        getUserDetailsAndOccassions({
                userId: this.selectedUser.id
            })
            .then(response => {
                this.selectedUser.prev = [];
                this.selectedUser.upcoming = [];
                let currentDate = new Date();
                for (let i = 0; i < response.length; i++) {
                    if (new Date(response[i].HTB__Ocassion_Date__c) < currentDate) {
                        this.selectedUser.prev.push(response[i])
                    } else {
                        this.selectedUser.upcoming.push(response[i]);
                    }
                }
                this.checkocassions();

            })
    }

    handleUpdateOcc(event) {
        this.selectedUser.selectedOcassion = event.detail.selected.Id;
        this.selectedUser.selectedOcassionType = event.target.dataset.selectedtype;
        GetWishesByUser({
            userId: this.selectedUser.id,
            ocassionId: this.selectedUser.selectedOcassion
        }).then(response => {
            this.selectedUser.image = response.HTB__selected_template__c;
            this.template.querySelector('[data-targettype="RTA"]').value = response.HTB__Wish__c;
            this.selectedUser.wish = response.HTB__Wish__c;
            let obj = { x: response.HTB__PositionX__c, y: response.HTB__PositionY__c };
            this.position = Object.assign({}, obj);
            this.selectedUser.wishId = response.Id;

        }).catch(error => {
            if (error.body.exceptionType === "System.QueryException") {
                console.log('You have not wished the user on this ocassion');
            }
        })

        this.changeTemplates(this.selectedUser.selectedOcassion);
    }

    handleTemplateChange(event) {
        this.selectedUser.image = event.target.dataset.image;

    }

    handleUpdateTemplate(event) {
        this.selectedUser.image = event.detail.image;
    }

    addFileToTemplates(event) {
        this.changeTemplates(this.selectedUser.selectedOcassion);
    }

}
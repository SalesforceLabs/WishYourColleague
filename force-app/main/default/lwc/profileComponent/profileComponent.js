import { LightningElement, track, api, wire } from 'lwc';
import getWishes from '@salesforce/apex/GetMessages.getWishes';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import Id from '@salesforce/user/Id';


export default class ProfileComponent extends LightningElement {

    @api recordId;
    @wire(CurrentPageReference) pageRef;
    @track options;
    @track popupShowOcassions = false;
    ocassionId = "";

    animation = {
        availableAnimations: ['wobble', 'stretch', 'shake', 'bounceIn'],
    };

    @track openPopUp = false;

    @track wishes = {
        allTemplates: [],
        allWish: [],
        length: 0,
        x: [],
        y: []
    }
    @track selected = {
        currentTemplate: "",
        currentWish: ""
    }

    count = 0;

    loggedInUser = Id;
    @track isLoggedInUser;

    renderedCallback() {
        this.isLoggedInUser = this.loggedInUser === this.recordId;
        registerListener('closemodal', this.closeModal, this);
        let elmt = this.template.querySelector(".animate");
        let imgelmt = this.template.querySelector('[data-targetelement = "img"]');
        let textelmnt = this.template.querySelector('[data-targetelement="text"]');

        if (elmt != null) {

            getWishes({
                    userId: this.recordId,
                    ocassionId: this.ocassionId
                })
                .then(response => {
                    this.wishes.length = response.length;
                    this.wishes.allTemplates = [];
                    this.wishes.allWish = [];
                    this.wishes.x = [];
                    this.wishes.y = [];
                    for (let i = 0; i < this.wishes.length; i++) {
                        this.wishes.allTemplates.push(response[i].selected_template__c);
                        this.wishes.allWish.push(response[i].Wish__c);
                        (response[i].PositionX__c != undefined) ? this.wishes.x.push(response[i].PositionX__c): this.wishes.x.push("center"); // uncommented the
                        (response[i].PositionY__c != undefined) ? this.wishes.y.push(response[i].PositionY__c): this.wishes.y.push("center"); // uncommented the code
                    }
                    this.count === 0 ? this.handleIteration() : "";
                })

        }

    }

    handleIteration() {
        console.log(this);
        let elmt = this.template.querySelector(".animate");
        let imgelmt = this.template.querySelector('[data-targetelement = "img"]');
        let textelmnt = this.template.querySelector('[data-targetelement="text"]');
        if (this.wishes.length === this.count || this.wishes.length < this.count) {
            elmt.classList.remove(this.animation.availableAnimations[(this.count - 1) % this.animation.availableAnimations.length])
            elmt.classList.add(this.animation.availableAnimations[this.count % this.animation.availableAnimations.length]);
            elmt != null ? elmt.removeEventListener('animationiteration', this.handleIteration) : "";
            elmt != null ? elmt.classList.remove('animate') : "";
            this.ocassionSelected = false;
        } else {
            imgelmt.src = this.wishes.allTemplates[this.count];
            this.selected.currentWish = this.wishes.allWish[this.count];
            this.selected.currentTemplate = this.wishes.allTemplates[this.count];
            this.selected.currentWish = this.selected.currentWish ? this.selected.currentWish : "";
            textelmnt.innerHTML = this.selected.currentWish;
            if (this.wishes.x[this.count] != "center") {
                textelmnt.style.marginLeft = this.wishes.x[this.count] + 'px';
            } else {
                textelmnt.style.marginLeft = (imgelmt.offsetWidth / 2 - 10) + 'px';
            }
            if (this.wishes.y[this.count] != "center") {
                textelmnt.style.marginTop = this.wishes.y[this.count] + 'px';

            } else {
                textelmnt.style.marginTop = (imgelmt.offsetHeight / 2 - 10) + 'px';
            }
            if (this.count === 0) {
                elmt.classList.add('wobble');
            } else {
                elmt.classList.remove(this.animation.availableAnimations[(this.count - 1) % this.animation.availableAnimations.length])
                elmt.classList.add(this.animation.availableAnimations[this.count % this.animation.availableAnimations.length]);
            }
            this.count++;
        }
    }


    handlePopUpWYC(event) {
        this.openPopUp = true;
    }
    closeModal(message) {
        this.openPopUp = false;
    }

    handleAnimation(event) {
        if (event.target.dataset.targetaction === 'pause')
            this.template.querySelector('.animate').style.animationPlayState = 'paused';
        else
            this.template.querySelector('.animate').style.animationPlayState = 'running';
    }

    handleShowOcassions(event) {
        this.popupShowOcassions = true;
    }

    handleCloseSelectOcassions() {
        this.popupShowOcassions = false;
    }

    handleOcassionSelect(event) {
        this.popupShowOcassions = false;
        this.ocassionId = event.detail;
        this.template.querySelector('div.background').classList.add('animate');
        this.count = 0;

    }
}
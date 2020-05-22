import { LightningElement, track, api, wire } from 'lwc';
import getWishes from '@salesforce/apex/GetMessages.getWishes';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import Id from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class ProfileComponent extends LightningElement {

    @api recordId;
    @wire(CurrentPageReference) pageRef;
    @track popupShowOcassions = false;
    @track showThanks = false;
    ocassionId = "";
    animation = {
        availableAnimations: ['wobble', 'shake', 'bounceIn'],
    };

    @track yourOccId = "";
    @track openPopUp = false;
    @track wishes = {
        allTemplates: [],
        allWish: [],
        length: 0,
        x: [],
        y: [],
        from: []
    };


    @track selected = {
        currentTemplate: "",
        currentWish: "",
        from: ''
    };
    count = 0;
    loggedInUser = Id;
    @track isLoggedInUser;
    offsetRows = 0;
    isOccasionChanged = false;


    renderedCallback() {
        this.isLoggedInUser = this.loggedInUser === this.recordId;
        registerListener('closemodal', this.closeModal, this);
        let elmt = this.template.querySelector(".animate");

        if (elmt != null) {
            getWishes({
                    userId: this.recordId,
                    ocassionId: this.ocassionId,
                    offsetRows: this.offsetRows,
                })
                .then(response => {
                    console.log(response.length);
                    if (response.length > 0)
                        if (this.yourOccId != response[0].HTB__Your_Ocassion__c) {
                            this.wishes.allTemplates = [];
                            this.wishes.allWish = [];
                            this.wishes.x = [];
                            this.wishes.y = [];
                            this.wishes.from = [];
                            this.offsetRows = 0;
                        }
                    this.wishes.length = this.offsetRows + response.length;
                    this.yourOccId = response.length != 0 ? response[0].HTB__Your_Ocassion__c : "";
                    for (let i = 0; i < response.length; i++) {
                        this.wishes.allTemplates.push(response[i].HTB__selected_template__c);
                        this.wishes.allWish.push(response[i].HTB__Wish__c);
                        (response[i].HTB__PositionX__c != null) ? this.wishes.x.push(response[i].HTB__PositionX__c): this.wishes.x.push("center");
                        (response[i].HTB__PositionY__c != null) ? this.wishes.y.push(response[i].HTB__PositionY__c): this.wishes.y.push("center");
                        this.wishes.from.push(response[i].Owner.Name);
                    }
                    this.wishes.length === 3 ? this.offsetRows = this.offsetRows + 3 : "";
                    this.count === 0 ? this.handleIteration() : "";
                })
        }
    }

    handleIteration() {
        let imgelmt = this.template.querySelector('[data-targetelement = "img"]');
        let textelt = this.template.querySelector('[data-targetelement="text"]');
        if (this.wishes.length != 0 || this.wishes.length > this.count) {
            imgelmt.src = this.wishes.allTemplates[this.count];
            imgelmt.style.visibility = "hidden";
        }
        this.selected.currentWish = this.wishes.allWish[this.count];
        this.selected.currentTemplate = this.wishes.allTemplates[this.count];
        if (this.selected.currentWish != null)
            this.selected.currentWish = !this.selected.currentWish.includes('undefined') ? this.selected.currentWish : "";
        this.selected.from = this.wishes.from[this.count];
        textelt.innerHTML = this.selected.currentWish;
        textelt.style.visibility = "hidden"
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
        console.log(this.ocassionId);
        this.template.querySelector('div.background').classList.add('animate');
        this.count = 0;
    }

    handleScaling() {
        let textElmnt = this.template.querySelector('span') === null ? this.template.querySelector('.absposition').querySelector('p') : this.template.querySelector('span');
        let imgElemnt = this.template.querySelector('[data-elementtype="container"]');
        let divText = this.template.querySelector('[data-targetelement="text"]');
        let elmt = this.template.querySelector(".animate");
        let fontSize;
        if (textElmnt != null)
            fontSize = textElmnt.style.fontSize === "" ? (12 * imgElemnt.offsetHeight) / 300 : (parseInt(textElmnt.style.fontSize.substring(0, 2)) * imgElemnt.offsetHeight) / 300;
        divText.style.fontSize = fontSize + 'px';
        let divTextHeight = divText.offsetHeight * imgElemnt.offsetHeight / 300;
        let divWidth = divText.offsetWidth * imgElemnt.offsetWidth / 400;
        let arrSpan = this.template.querySelectorAll('span');
        var i = 0;
        for (i = 0; i < arrSpan.length; i++) {
            arrSpan[i].style.removeProperty("font-size");
        }

        var divHeightDeduct = i != 0 ? i * fontSize : fontSize;

        if (this.wishes.x[this.count] != "center") {
            divText.style.marginLeft = ((this.wishes.x[this.count] / 100) * (imgElemnt.offsetWidth - divWidth)) + 'px';

        } else {
            divText.style.marginLeft = (imgElemnt.offsetWidth / 2) + 'px';
        }
        if (this.wishes.y[this.count] != "center") {
            divText.style.marginTop = ((this.wishes.y[this.count] / 100) * (imgElemnt.offsetHeight - divHeightDeduct)) + 'px';
        } else {
            divText.style.marginTop = (imgElemnt.offsetHeight / 2) + 'px';
        }

        divText.style.visibility = "visible";
        this.template.querySelector('[data-targetelement = "img"]').style.visibility = 'visible';


        if (this.count === 0) {
            elmt.classList.add('wobble');
        } else {
            elmt.classList.remove(this.animation.availableAnimations[(this.count - 1) % this.animation.availableAnimations.length])
            elmt.classList.add(this.animation.availableAnimations[this.count % this.animation.availableAnimations.length]);
        }

        this.count++;

        if (this.wishes.length === this.count || this.wishes.length < this.count) {
            elmt.classList.remove(this.animation.availableAnimations[(this.count - 1) % this.animation.availableAnimations.length])
            elmt.classList.add(this.animation.availableAnimations[this.count % this.animation.availableAnimations.length]);
            elmt != null ? elmt.removeEventListener('animationiteration', this.handleIteration) : "";
            elmt != null ? elmt.classList.remove('animate') : "";
        }

    }

    showThanksPopup() {
        this.showThanks = true;
        if (this.yourOccId === "") {
            this.showThanks = false;
            const evt = new ShowToastEvent({
                title: 'Invalid Occasion',
                message: 'mmm... It is lonely here!!',
                variant: 'error',
            });
            this.dispatchEvent(evt);
        }
    }
    handleCloseThanks() {
        this.showThanks = false;
    }

}
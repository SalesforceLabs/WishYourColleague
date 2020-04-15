import { LightningElement,track,api,wire } from 'lwc';
import getWishes from '@salesforce/apex/GetMessages.getWishes';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import{CurrentPageReference} from 'lightning/navigation';
import Id from '@salesforce/user/Id';

export default class ProfileComponent extends LightningElement {
    
    @api recordId;
    @wire(CurrentPageReference) pageRef;
    @track options;

    animation={
        availableAnimations: ['fadeInOut','wobble','shake','bounceIn'],
    };

    @track openPopUp = false;

    wishes={
        allTemplates: [],
        allWish: [],
        length:0,
        x:[],
        y:[]
    }
    @track selected={
        currentTemplate:"",
        currentWish:""
    }

    count=0;

    loggedInUser=Id;
    @track isLoggedInUser;

    connectedCallback(){
        this.isLoggedInUser = this.loggedInUser === this.recordId;
        registerListener('closemodal',this.closeModal,this);

        getWishes({
            userId: this.recordId
        })
        .then(response => { 
            this.wishes.length = response.length;
            for(let i=0;i<this.wishes.length;i++){
                this.wishes.allTemplates.push(response[i].selected_template__c);
                this.wishes.allWish.push(response[i].Wish__c);

                /*(response[i].PositionX__c != undefined) ? (this.wishes.x.push(response[i].PositionX__c) * this.template.querySelector('.background').offsetWidth / 500): this.wishes.x.push("center");
                (response[i].PositionY__c != undefined) ? this.wishes.y.push(response[i].PositionY__c * this.template.querySelector('.background').offsetWidth / 300): this.wishes.y.push("center") ;*/
                
            }
            
            this.selected.currentTemplate = this.wishes.allTemplates[this.count];
            this.selected.currentWish = this.wishes.allWish[this.count];
            this.template.querySelector('.animate').style.backgroundImage="url("+this.wishes.allTemplates[this.count]+")";
            
            
            let node = document.createElement('div');
            node.innerHTML = this.selected.currentWish;
            node.classList.add('slds-align_absolute-center');
            /*(this.wishes.y[0] != "center") ? node.style.paddingTop = this.wishes.y[0] + 'px': node.style.paddingTop = (this.template.querySelector('.animate').offsetHeight /2 - 10 ) + 'px';
            if(this.wishes.x[0] != "center")   
             node.style.paddingLeft = this.wishes.x[0] + 'px';*/

            this.template.querySelector('.animate').appendChild(node);
            this.count++;


            let elmt =this.template.querySelector(".animate");
            elmt.addEventListener('animationiteration',()=> {
            if(this.wishes.length === this.count){
                elmt.classList.remove('animate');
            }
            else{

                if(this.count === 1) 
                {
                    elmt.classList.remove('wobble');
                }
                    
                this.selected.currentWish = this.wishes.allWish[this.count];
                this.selected.currentTemplate = this.wishes.allTemplates[this.count]; // post in GUS

                elmt.style.backgroundImage="url("+this.wishes.allTemplates[this.count]+")";
                elmt.classList.remove(this.animation.availableAnimations[ (this.count-1) % this.animation.availableAnimations.length])
                elmt.classList.add(this.animation.availableAnimations[this.count % this.animation.availableAnimations.length]);
                
                if(elmt.children.length)
                    elmt.removeChild(elmt.lastChild)

                let node = document.createElement('p');
                this.selected.currentWish = this.selected.currentWish ? this.selected.currentWish : "";
                node.innerHTML = this.selected.currentWish;
                /*(this.wishes.y[this.count] != "center") ? node.style.paddingTop = this.wishes.y[this.count] + 'px': node.style.paddingTop = (this.template.querySelector('.animate').offsetHeight /2 - 10 ) + 'px';
                if(this.wishes.x[this.count] != "center")   
                    node.style.paddingLeft = this.wishes.x[this.count]+ 'px';*/
                elmt.appendChild(node);
                
                this.count++;
                
            }
            
        }) 
    })
}


    handlePopUpWYC(event){
        console.log(this.recordId);
        this.openPopUp = true;
    }
    closeModal(message){
        this.openPopUp = false;
    }

    handleAnimation(event){
        if(event.target.dataset.targetaction === 'pause')
            this.template.querySelector('.animate').style.animationPlayState = 'paused';
        else
            this.template.querySelector('.animate').style.animationPlayState = 'running';
    }
}
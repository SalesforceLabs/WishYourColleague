import { LightningElement,track,wire,api } from 'lwc';
import HIDELABELS from '@salesforce/resourceUrl/HideLabels';
import {loadStyle } from 'lightning/platformResourceLoader';
import getTemplates from '@salesforce/apex/GetAttachedTemplates.getTemplates';
import getUserDetailsAndOccassions from '@salesforce/apex/GetUsers.getUsersWithOcc';
import{CurrentPageReference} from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

export default class WishAUser extends LightningElement {
    @api profile = false;
    @api userId='';
    
    @wire (CurrentPageReference) pageRef;
    @track imagesURL=[];
    @track selectedImage;   
    @track users=[];
    @track selectedUser={
        image:"",
        name:"",
        id:"",
        prev:[],
        upcoming:[],
        selectedOcassion:"",
    };
   
    /*position={
        x:"center",
        y:"center"
    }*/

    connectedCallback(){

        registerListener('positionchange',this.updatePosition,this);
        Promise.all([
            loadStyle(this,HIDELABELS)
        ])
        .then(()=> {
            
            console.log('files loaded');
        })

        getUserDetailsAndOccassions({
            userId : this.userId
        })
        .then(response => {
            if(this.userId != ''){
                this.selectedUser.id = this.userId;
                this.selectedUser.name = response[0].User__r.Name;
                this.selectedUser.prev =[];
                this.selectedUser.upcoming=[];
                let currentDate = new Date();
                for(let i=0;i<response.length;i++){
                    if(new Date(response[i].Ocassion_Date__c) < currentDate){
                        this.selectedUser.prev.push(response[i])
                    }
                    else{
                        this.selectedUser.upcoming.push(response[i]);
                    }
                }
                fireEvent(this.pageRef,'passusername',this.selectedUser);
            }
            else{

                let userIds = response.map((item) =>{
                    return item.User__c;
               })
                
               userIds = userIds.filter((item,index) =>{
                   return userIds.indexOf(item) >=index;
               })
               let j=0;
               for(let i=0;i< response.length;i++){
                   if(response[i].User__c === userIds[j]){
                       if(j < userIds.length){
                            this.users.push(response[i]);
                            j++;
                       }
                       else
                            break;
                            
                   }
                   else
                        continue;
               }
            }
           
        }
        )
    }




    handleImgClick(event){
        let img;
        let image;
        
        if(event.target.dataset.imgid){
            image = this.template.querySelector('.template.selected');
            if(image)
                image.classList.remove("selected");
            this.selectedImage = event.target.src;
            let selectedImgid = event.target.dataset.imgid; 
             img = this.template.querySelector("[data-imgid = '"+selectedImgid+"']");
             img.classList.add('selected');
             fireEvent(this.pageRef,'templatechange',this.selectedImage);
             
        }
        else{
            if(this.selectedUser.id)
                this.template.querySelector("[data-targetid ='"+this.selectedUser.id+"']").classList.remove('selected');

            this.selectedUser.image=event.target.src;
            this.selectedUser.name= event.currentTarget.dataset.username;
            this.selectedUser.id = event.currentTarget.dataset.targetid;
            img = this.template.querySelector("[data-targetid ='"+this.selectedUser.id+"']");

            getUserDetailsAndOccassions({
                userId: this.selectedUser.id
            })
            .then(response =>{
                this.selectedUser.prev =[];
                this.selectedUser.upcoming=[];
                let currentDate = new Date();
                for(let i=0;i<response.length;i++){
                    if(new Date(response[i].Ocassion_Date__c) < currentDate){
                        this.selectedUser.prev.push(response[i])
                    }
                    else{
                        this.selectedUser.upcoming.push(response[i]);
                    }
                }
                
            })
            img.classList.add('selected');
        }
            
            
    }



    changeTemplates(occId){
        if( occId === ""){
            this.imagesURL =[];
            
        }
        else{
            
            getTemplates({
                occId: occId
            })
            .then(response => {
               
                let baseURL = window.location.origin;
                let URL;
                for (let i=0;i<response.length;i++){
                    URL = baseURL + '/sfc/servlet.shepherd/version/renditionDownload?rendition=ORIGINAL_Png&versionId=' + response[i].ContentDocument.LatestPublishedVersionId + '&operationContext=CHATTER&contentId='+ response[i].ContentBodyId;
                    this.imagesURL.push(URL);
                }
            })
            .catch(error => {
                console.log("An unexpected Error has occured "+error);
            })
        }
        
    }

    handleSubmit(event){
        event.preventDefault();
        const fields = event.detail.fields;
        fields.selected_template__c = this.selectedImage;
        fields.Your_Ocassion__c = this.selectedUser.selectedOcassion;

        /*if(this.position.x != "center")
            fields.PositionY__c = this.position.y;
        if(this.position.y != "center")
            fields.PositionX__c = this.position.x;*/

        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event){
        this.imagesURL =[];
        let image = this.template.querySelectorAll('.selected');
        this.template.querySelector("[data-ocassionid='"+this.selectedUser.selectedOcassion+"']").style.border = "none";
        for (let i=0;i< image.length;i++){
            image[0].classList.remove('.selected');
        }
        
       
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }


    handleImgOccClick(event){
        if(this.selectedUser.selectedOcassion)
            this.template.querySelector("[data-ocassionid='"+this.selectedUser.selectedOcassion+"']").style.border = "none";
        this.imagesURL=[];
        let ocassionSelected = event.currentTarget.dataset.ocassionid;
        this.selectedUser.selectedOcassion = ocassionSelected;

        this.template.querySelector("[data-ocassionid='"+ocassionSelected+"']").style.border = "2px solid slategrey";
        this.changeTemplates(this.selectedUser.selectedOcassion);
    }

    handleWishChange(event){
        fireEvent(this.pageRef,'wishchange',event.target.value);
    }

    updatePosition(position){
        /*if(position.x != "center"){
            this.position.x = position.x;
        }
        if(position.y != "center"){
            this.position.y = position.y;
        }*/
    }
    

}
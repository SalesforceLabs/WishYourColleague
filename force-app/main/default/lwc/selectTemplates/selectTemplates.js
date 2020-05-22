import { LightningElement,api,track } from 'lwc';


export default class SelectTemplates extends LightningElement {
    @api image;
    @track applyClass;

    @api
    get selectedImage(){
        return this.image;
    }

    set selectedImage(value){
         
        if(value === this.image){
            this.applyClass= "template selected";
            this.dispatchEvent(
                new CustomEvent('updatetemplate',{detail:{
                    image: this.image
                }})
            )
        }
        else{
            this.applyClass="template";
        }
    }

}
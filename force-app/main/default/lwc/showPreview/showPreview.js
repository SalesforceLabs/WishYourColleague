import { LightningElement,track,wire } from 'lwc';
import { CurrentPageReference} from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { fireEvent } from 'c/pubsub';

export default class ShowPreview extends LightningElement {

    @track val=50;
    @wire(CurrentPageReference) pageRef;
    @track passedData ={
        wish:"",
        image:"",
    }
    position={
        x:"center",
        y:"center"
    }
    connectedCallback(){
        registerListener('templatechange',this.handleTemplateChange,this);
        registerListener('wishchange',this.wishChange,this);
    }

    handleTemplateChange(imageURL){
        this.passedData.image = imageURL;
        this.template.querySelector('[data-target="preview"]').style.backgroundImage="url("+this.passedData.image+")";
    }
    wishChange(wish){
        this.passedData.wish=wish;
        let divHeight = this.template.querySelector('[data-target="preview"]').offsetHeight;
        let divWidth = this.template.querySelector('[data-target="preview"]').offsetWidth;
        //console.log(divHeight);
        let node =  document.createElement('p');
        node.innerHTML = this.passedData.wish;
        node.setAttribute('data-targetdiv', 'text');
        node.style.marginTop = (divHeight/2 -10) +'px' ;
        node.classList.add('slds-align_absolute-center');
        //node.style.marginLeft = (divWidth/2 -10) +'px';

        if(this.template.querySelector('.background').children.length > 0)
            this.template.querySelector('.background').removeChild( this.template.querySelector('.background').lastElementChild );
        
        this.template.querySelector('.background').appendChild(node); 
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
      }

      repositionText(event){
        let divHeight = this.template.querySelector('[data-target="preview"]').offsetHeight;
        let divWidth = this.template.querySelector('[data-target="preview"]').offsetWidth;
        let textDivHeight = this.template.querySelector("[data-targetdiv = 'text']").offsetHeight;
        
        

        if(event.target.dataset.targetslider === 'height'){
            (((event.target.value /100) * divHeight) - textDivHeight)>0 ? this.template.querySelector("[data-targetdiv = 'text']").style.marginTop = (((event.target.value /100) * divHeight) - textDivHeight)+ 'px' : this.template.querySelector("[data-targetdiv = 'text']").style.marginTop =0 + 'px';
            this.position.y = this.template.querySelector("[data-targetdiv = 'text']").style.marginTop;
        }   
        else{
            this.template.querySelector("[data-targetdiv = 'text']").style.marginLeft = (((event.target.value /100) * divWidth))  + 'px';
            this.position.x = this.template.querySelector("[data-targetdiv = 'text']").style.marginLeft;
        }
            
        fireEvent(this.pageRef,'positionchange',this.position)

      }

}
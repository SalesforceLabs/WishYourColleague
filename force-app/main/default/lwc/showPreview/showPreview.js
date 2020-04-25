import { LightningElement, track, wire, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import { fireEvent } from 'c/pubsub';

export default class ShowPreview extends LightningElement {



    @track val = 50;
    @wire(CurrentPageReference) pageRef;
    @track passedData = {
        wish: "",
        image: "",
    }
    position = {
        x: "center",
        y: "center"
    }


    @api
    get setPosition() {
        return this.position;
    }
    set setPosition(passedPosition) {
        if (passedPosition.x != "center" && passedPosition.y != "center") {
            let imgHeight = this.template.querySelector('[data-targetelement="img"]').offsetHeight;
            let imgWidth = this.template.querySelector('[data-targetelement="img"]').offsetWidth;
            let textElement = this.template.querySelector('[data-targetelement="text"]');
            textElement.style.marginTop = passedPosition.y + 'px';
            textElement.style.marginLeft = passedPosition.x + 'px';
            let sliderHeight = textElement.style.marginTop/ (imgHeight - textElement.offsetHeight);
            let sliderWidth = textElement.style.marginWidth/ (imgWidth - textElement.offsetWidth);
            this.template.querySelector('[data-targetslider="height"]').value = sliderHeight;
            this.template.querySelector('[data-targetslider="width"]').value = sliderWidth;
        } 
    }

    @api
    get image() {
        return this.passedData.image;
    }

    set image(value) {
        this.passedData.image = value;
        if (value)
            this.template.querySelector('[data-targetelement = "img"]').src = this.passedData.image;
    }

    @api
    get wish() {
        return this.passedData.wish;
    }

    set wish(value) {
        this.passedData.wish = value;
        if (value) {
            let textElement = this.template.querySelector('[data-targetelement="text"]');
            textElement.innerHTML = this.passedData.wish;
        }
    }


    repositionText(event) {
        let imgHeight = this.template.querySelector('[data-targetelement="img"]').offsetHeight;
        let imgWidth = this.template.querySelector('[data-targetelement="img"]').offsetWidth;
        let textElement = this.template.querySelector('[data-targetelement="text"]');
        let textHeight = textElement.offsetHeight;
        let textWidth = textElement.offsetWidth;

        if (event.target.dataset.targetslider === 'height') {
            textElement.style.marginTop = (event.target.value / 100) * (imgHeight - textHeight) + 'px';
            this.position.y = textElement.style.marginTop;
        }
        else {
            textElement.style.marginLeft = (event.target.value / 100) * (imgWidth - textWidth) + 'px';
            this.position.x = textElement.style.marginLeft;
        }

        fireEvent(this.pageRef, 'positionchange', this.position)

    }

}
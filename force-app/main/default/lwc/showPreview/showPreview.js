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

            let textHeight = textElement.offsetHeight;
            let textWidth = textElement.offsetWidth;
            textElement.style.marginTop = (passedPosition.y / 100) * (imgHeight - textHeight) + 'px';
            textElement.style.marginLeft = (passedPosition.x / 100) * (imgWidth - textWidth) + 'px';
            let sliderHeight = textElement.style.marginTop / (imgHeight - textElement.offsetHeight);
            let sliderWidth = textElement.style.marginWidth / (imgWidth - textElement.offsetWidth);
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
        else if (this.template.querySelector('[data-targetelement = "img"]') != null) {
            this.template.querySelector('[data-targetelement = "img"]').src = '#';
            this.template.querySelector('[data-targetslider="width"]').value = 0;
            this.template.querySelector('[data-targetslider="height"]').value = 0;
        }


    }

    @api
    get wish() {
        return this.passedData.wish;
    }

    set wish(value) {
        this.passedData.wish = value;
        if (this.template.querySelector('[data-targetelement="text"]') != null) {
            let textElement = this.template.querySelector('[data-targetelement="text"]');
            this.passedData.wish = this.passedData.wish.includes('undefined') ? "" : this.passedData.wish;
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
            let height = (event.target.value / 100) * (imgHeight - textHeight);
            textElement.style.marginTop = height + 'px';
            this.position.y = event.target.value;
        } else {
            let width = (event.target.value / 100) * (imgWidth - textWidth);
            textElement.style.marginLeft = width + 'px';
            this.position.x = event.target.value;
        }

        fireEvent(this.pageRef, 'positionchange', this.position)

    }

}
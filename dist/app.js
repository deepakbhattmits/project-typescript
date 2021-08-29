"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const validate = (validatableObj) => {
    let isValid = true;
    if (validatableObj.required) {
        isValid = isValid && !!validatableObj.value.toString().trim().length;
    }
    if (validatableObj.minLength != null &&
        typeof validatableObj.value === "string") {
        isValid =
            isValid && validatableObj.value.length >= validatableObj.minLength;
    }
    if (validatableObj.maxLength != null &&
        typeof validatableObj.value === "string") {
        isValid =
            isValid && validatableObj.value.length <= validatableObj.maxLength;
    }
    if (validatableObj.min != null && typeof validatableObj.value === "number") {
        isValid = isValid && validatableObj.value >= validatableObj.min;
    }
    if (validatableObj.max != null && typeof validatableObj.value === "number") {
        isValid = isValid && validatableObj.value <= validatableObj.max;
    }
    return isValid;
};
//
const AutoBind = (_, _2, descriptor) => {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
};
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input";
        this.titleElement = this.element.querySelector("#title");
        this.descriptionElement = this.element.querySelector("#description");
        this.peopleElement = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    getherUserInput() {
        const title = this.titleElement.value;
        const description = this.descriptionElement.value;
        const people = this.peopleElement.value;
        const titleValidatable = { value: title, required: true };
        const descriptionValidatable = {
            value: description,
            required: true,
            minLength: 5,
        };
        const peopleValidatable = {
            value: people,
            required: true,
            min: 1,
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            console.log("Invalid Inputs, please try again later");
            return;
        }
        else {
            return [title, description, +people];
        }
    }
    clearInputs() {
        this.titleElement.value = "";
        this.descriptionElement.value = "";
        this.peopleElement.value = "";
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.getherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            console.log(title, description, people);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
__decorate([
    AutoBind
], ProjectInput.prototype, "submitHandler", null);
const prjInput = new ProjectInput();

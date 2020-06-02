"use strict";

/*
 * Steps
 */
export default class Steps {
  constructor(wizard){
    this.wizard = wizard
    this.steps = this.getSteps()
    this.stepsQuantity = this.getStepsQuantity()
    this.currentStep = 0
    this.addStepClasses()
  }

  setCurrentStep(currentStep){
    this.currentStep = currentStep;
    this.handleStepsClasses()
  }

  getSteps(){
    return this.wizard.getElementsByClassName('step');
  }

  getStepsQuantity(){
    return this.getSteps().length;
  }

  addStepClasses() {
    for (let i = 0; i < this.steps.length; i++) {
      let step = this.steps[i]
      let content = step.querySelector('.step-content')
      if(content) {
        let startLine = i == 0 ? '<div class="line -start"></div>' : ''
        content.innerHTML += `<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <div class="lines">
              ${startLine}
              <div class="line -background"></div>
              <div class="line -progress"></div>
            </div> `
      }
    }
  }

  handleConcludeStep(){
    this.steps[this.currentStep].classList.add('-completed');
  }

  handleStepsClasses(){

    for (let i = 0; i < this.steps.length; i++) {
      let step = this.steps[i]
      if(this.currentStep > i) {
        step.classList.add('-completed')
      } else {
        step.classList.remove('-completed')
      }
    } 
  }

  handleStepsClassesOLD(movement){
    if(movement > 0)
      this.steps[this.currentStep - 1].classList.add('-completed');
    else if(movement < 0)
      this.steps[this.currentStep].classList.remove('-completed');  
  }
}

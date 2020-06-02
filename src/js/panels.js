"use strict";

/*
 * Panels
 */
export default class Panels {
  constructor(wizard){
    this.wizard = wizard;
    this.panelWidth = this.wizard.offsetWidth;
    this.panelsContainer = this.getPanelsContainer();
    this.panels = this.getPanels();
    this.panelComplete = this.getPanelComplete()
    this.currentStep = 0;

    this.updatePanelsPosition(this.currentStep);
    this.updatePanelsContainerHeight();
    //this.addPanelClasses()
  }

  getCurrentPanelHeight(step){
    //return `${this.getPanels()[step || this.currentStep].offsetHeight}px`;
    return document.querySelector('.panel.movingIn').offsetHeight + 'px'
  }

  getPanelsContainer(){
    return this.wizard.querySelector('.hs-body');
  }

  getPanels(){
    return this.wizard.getElementsByClassName('panel');
  }

  getPanelComplete(){
    return this.wizard.querySelector('.panel.complete');
  }

  addPanelClasses() {
    this.panelsContainer.innerHTML += `<div class="hs-mask">
      <div class="hs-loader"><div></div><div></div><div></div></div>
    </div>`
  }

  updatePanelsContainerHeight(){
    this.getPanelsContainer().style.height = this.getCurrentPanelHeight()
    //this.panelsContainer.style.height = this.getCurrentPanelHeight()
  }

  updatePanelsPosition(currentStep){
    const panels = this.panels;
    const panelWidth = this.panelWidth;

    for (let i = 0; i < panels.length; i++) {
      panels[i].classList.remove(
         'movingIn',
         'movingOutBackward',
         'movingOutForward'
      );

      if(i !== currentStep){
        if(i < currentStep) panels[i].classList.add('movingOutBackward');
        else if( i > currentStep ) panels[i].classList.add('movingOutForward');
      }else{
        panels[i].classList.add('movingIn');
      }
    }

    this.updatePanelsContainerHeight();
  }

  updatePanelsComplete() {
    const completePanel = this.getPanelComplete()
    if(!completePanel) return
    const panels = this.panels;
    const panelWidth = this.panelWidth;

    for (let i = 0; i < panels.length; i++) {
      panels[i].classList.remove(
         'movingIn',
         'movingOutBackward',
         'movingOutForward'
      );

      if(panels[i].classList.contains('complete')) {
        panels[i].classList.add('movingIn')
      } else {
        panels[i].classList.add('movingOutBackward')
      }
    }

    this.updatePanelsContainerHeight();
  }

  setCurrentStep(currentStep){
    this.currentStep = currentStep;
    this.updatePanelsPosition(currentStep);
  }
}
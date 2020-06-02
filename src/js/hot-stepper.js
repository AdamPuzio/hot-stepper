"use strict";

import Steps from './steps.js'
import Panels from './panels.js'

const DEFAULT_OPTIONS = {
  linear: true,
  animation: false,
  selectors: {
    steps: '.step',
    trigger: '.step-trigger',
    stepper: '.bs-stepper'
  },
  onChange: async function(info) {
    return true
  },
  onComplete: async function() {
    return true
  },
  onReset: async function() {
    return true
  }
}

export default class HotStepper {
  constructor (element, _options = {}) {
    this._element = element
    this._currentIndex = 0
    this._stepsCount = 0
    this._stepsContents = []
    this._elements = {}

    this.options = {
      ...DEFAULT_OPTIONS,
      ..._options
    }

    this.options.selectors = {
      ...DEFAULT_OPTIONS.selectors,
      ...this.options.selectors
    }

    this.panels = new Panels(this._element)
    this.steps = new Steps(this._element)
    this._stepsCount = this.steps.getStepsQuantity()
    this.addClasses()
    this.addHandlers()
    this.addListeners()
  }

  async next () {
    let response
    let info = {
      stepFrom: this._currentIndex,
      stepTo: this._currentIndex + 1,
      totalSteps: this._stepsCount,
      move: 'forward'
    }
    if(this._currentIndex + 1 >= this._stepsCount) {
      info.move = 'complete'
      response = await this.onComplete(info)
      if(response === false) return false
      this._currentIndex = this._stepsCount
      this.steps.setCurrentStep(this._currentIndex)
      this.panels.updatePanelsComplete()
      this.manageHandlers(info)
      await this.complete()
      return
    }
    response = await this.onChange(info)
    if(response === false) return false
    this._currentIndex += 1
    this.steps.setCurrentStep(this._currentIndex)
    this.panels.setCurrentStep(this._currentIndex)
    this.manageHandlers(info)
    this.resize()
  }

  async previous () {
    if(this._currentIndex - 1 < 0) return
    let info = {
      stepFrom: this._currentIndex,
      stepTo: this._currentIndex - 1,
      totalSteps: this._stepsCount,
      move: 'backward'
    }
    let response = await this.onChange(info)
    if(response === false) return false
    this._currentIndex -= 1
    this.steps.setCurrentStep(this._currentIndex)
    this.panels.setCurrentStep(this._currentIndex)
    this.manageHandlers(info)
    this.resize()
  }

  async reset () {
    let info = {
      stepFrom: this._currentIndex,
      stepTo: 0,
      totalSteps: this._stepsCount,
      move: 'reset'
    }
    let response = await this.onReset(info)
    if(response === false) return false
    this._currentIndex = 0
    this.steps.setCurrentStep(this._currentIndex)
    this.panels.setCurrentStep(this._currentIndex)
    this.manageHandlers(info)
    this.resize()
  }

  complete () {
    if(this.options.animation === true)
      this._element.classList.add('completed')
    if(this._elements.btnPrev) this._elements.btnPrev.disabled = true
    if(this._elements.btnNext) this._elements.btnNext.disabled = true
  }

  async onChange (info) {
    this._element.classList.add('loading')
    let response = await this.options.onChange.bind(this)(info)
    this._element.classList.remove('loading')
    return response
  }

  async onComplete (info) {
    this._element.classList.add('loading')
    let response = await this.options.onComplete.bind(this)(info)
    this._element.classList.remove('loading')
    return response
  }

  async onReset (info) {
    this._element.classList.add('loading')
    let response = await this.options.onReset.bind(this)(info)
    this._element.classList.remove('loading')
    return response
  }

  addClasses() {
    this._element.innerHTML += `<div class="hs-mask">
      <div class="hs-loader"><div></div><div></div><div></div></div>
    </div>`
  }

  addHandlers() {
    let footer = this._element.querySelector('.hs-footer')
    if(!footer) return
    this._elements.btnNext = footer.querySelector('.btn-next')
    this._elements.btnPrev = footer.querySelector('.btn-prev')
    if(this._elements.btnPrev) this._elements.btnPrev.disabled = true
  }

  manageHandlers(info) {
    if(this._elements.btnPrev) this._elements.btnPrev.disabled = false
    if(this._elements.btnNext) this._elements.btnNext.disabled = false
    if(info.stepTo == 0 && this._elements.btnPrev)
      this._elements.btnPrev.disabled = true
    if(info.move == 'complete' && this._elements.btnNext)
      this._elements.btnNext.disabled = true
  }

  addListeners() {
    window.addEventListener('resize', this.resize)
  }

  resize() {
    this.panels.updatePanelsContainerHeight()
  }

  updatePanel(panel, html) {
    let el = this.panels.panels[panel - 1]
    this.updateEl(el, html)
  }

  updateEl(el, html) {
    if(typeof el === 'string') el = document.querySelector(el)
    //let el = this.panels.panels[panel - 1]
    let a = '(function(){ '
    let b = ' })()'
    el.innerHTML = html
    Array.from(el.querySelectorAll("script")).forEach( oldScript => {
      const newScript = document.createElement("script")
      Array.from(oldScript.attributes)
        .forEach( attr => newScript.setAttribute(attr.name, attr.value) )
      newScript.appendChild(document.createTextNode(a + oldScript.innerHTML + b))
      oldScript.parentNode.replaceChild(newScript, oldScript)
    })
    this.resize()
  }
}

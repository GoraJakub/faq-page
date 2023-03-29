/// Homepage JavaScript File
/// Here we import all the JavaScript files we need for our homepage.

import '../styles/faq-page.scss'
import '../../../global-scripts/scripts/fetchData.js'
import { fetchData } from '../../../global-scripts/scripts/fetchData.js'

const API_LINK = 'json/faq.json'


// This class could have been written more universally, but for the purpose of the task it only has one role
class FAQ {
    constructor(selector,apiLink) {
        this.wrapper = document.querySelector(selector)
        this.apiLink = apiLink
    }
    question_elements
    question_wrapper

    async fetchFAQ() {
        const data = await fetchData(this.apiLink)
        return data
    }

    buildItem({q, a}) {
        const html = 
        `<div class="faq-questions-item">
        <button class="faq-questions-question">
          <h2 class="faq-questions-question-header">
            ${q}
          </h2>
        </button>
        <p class="faq-questions-answer">
            ${a}
        </p>
      </div>`
      return html
    }

    async buildSection() {
        const data = await this.fetchFAQ()
        const items = data.map(item=>this.buildItem(item)).join('')
        if(!this.wrapper) throw Error("Wrapper selector is invalid")
        this.wrapper.innerHTML = items

    }

    selectElements() {
        this.question_elements = document.querySelectorAll('.faq-questions-question')
        this.question_wrapper = document.querySelector('.faq-questions')
    }

   

    setTabIndexes(target) {
        (target) ? target.parentElement.querySelectorAll('a').forEach(a=>a.setAttribute('tabindex',0)) : this.question_wrapper.querySelectorAll('a').forEach(a=>a.setAttribute('tabindex',-1))
    }

    clearElements(target) {
        this.question_elements.forEach(elem=>{
            if(target.parentNode === elem.parentNode) return
            
            const answerElement = elem.nextElementSibling
            elem.parentNode.classList.remove('open')
            answerElement.style.maxHeight = null
        })
        this.setTabIndexes()
    }

    isOpen(el) {
        return el.classList.contains('open')
    }

    listenerCallback(e) {
        const answerElement = e.target.nextElementSibling
        const parentElement = e.target.parentNode
        this.clearElements(e.target)
        parentElement.classList.toggle('open')
        this.setTabIndexes(this.isOpen(parentElement) ? e.target : null)
        answerElement.style.maxHeight = (this.isOpen(parentElement)) ? answerElement.scrollHeight + "px" : null
    }

    bindEvents(){
        this.question_elements.forEach(elem=>elem.addEventListener('click',(e) => this.listenerCallback(e)),false)
    }


    init() {
        this.buildSection().then(()=>{
            this.selectElements()
            this.bindEvents()
        })
    }
}

const faq = new FAQ('.faq-questions',API_LINK)

//simulate fetch delay
setTimeout(()=>{
    faq.init()
},1000)
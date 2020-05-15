import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-new3-location'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} iframe { width: 100%; }
         </style>
         <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4166.955461487204!2d39.867116297673405!3d43.9442505414373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40f684d9d934eca5%3A0x85ac36acd4cd77a9!2z0KfQuNCz0YPRgNGB0LDQvdCwLCDQoNC10YHQv9GD0LHQu9C40LrQsCDQkNC00YvQs9C10Y8sIDM4NTc5Nw!5e1!3m2!1sru!2sru!4v1589529205815!5m2!1sru!2sru" width="400" height="300" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
      `
      wcMixin(this)
   }

   onRoute() {
      const but = document.createElement('button')
      but.innerHTML = 'Save<br>&rArr;'
      but.onclick = () => {
         APP.route('page-home')
         this.bubbleEvent('set-msg', 'Saved !')
      }
      this.bubbleEvent('set-buts', { custom: [but] })
      this.bubbleEvent('set-msg', 'Check location:')
   }
})

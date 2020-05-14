import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-new3'
customElements.define(me, class extends HTMLElement {
   _location = null

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} nav { display: flex; flex-flow: row nowrap; }
            ${me} nav button { flex: 1 1 auto; }
         </style>
         <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d575869.7969494411!2d39.58731392946736!3d44.004863867825826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40f69a97320fb1c3%3A0x4d8520015f1ad2f3!2z0YDRg9GHLiDQktC-0LTQvtC_0LDQtNC40YHRgtGL0Lk!5e0!3m2!1sru!2sru!4v1589474666577!5m2!1sru!2sru" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false"></iframe>
      `
      wcMixin(this)

      navigator.geolocation.getCurrentPosition(loc => this._location = loc.coords)
      navigator.geolocation.watchPosition(loc => this._location = loc.coords)
   }

   async onRoute() {
      const but = document.createElement('button')
      but.innerHTML = 'Save<br>&rArr;'
      but.onclick = () => {
         this.bubbleEvent('set-msg', 'Saved !')
         APP.route('page-home')
      }
      this.bubbleEvent('set-buts', { custom: [but] })
      this.bubbleEvent('set-msg', 'Check location:')
   }
})

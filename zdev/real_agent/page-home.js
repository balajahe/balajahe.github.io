import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               height: 100%; width: 100%;
               display: flex; flex-direction: column;
               justify-content: center; align-items: center;
            }
            ${me} > * {
               margin: 0.5em;
            }
         </style>
         <center>Real Agent is a database of arbitrary objects with geolocation, photos and videos !<br><br></center>
      `
      wcMixin(this)
   }

   onRoute() {
      const but = document.createElement('button')
      but.innerHTML = 'New<br>&rArr;'
      but.onclick = () => APP.route('page-new1')
      this.bubbleEvent('set-buts', { back: false, custom: [but] })
      this.bubbleEvent('set-msg', 'Object list:')
   }
})

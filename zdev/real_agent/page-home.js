import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               height: 100%; width: 100%;
               justify-content: center; align-items: center;
            }
         </style>
         <center>
            Real Agent is a database of arbitrary objects with geolocation, photos and videos !
            <br><br><br>
         </center>
      `
      wcMixin(this)
   }

   onRoute() {
      this.bubbleEvent('set-bar', {
         msg: '',
         back: false,
         buts: [{
            html: 'New<br>&rArr;',
            click: () => APP.route('page-new')
         }]
      })
   }
})

import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-work'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} #textDiv { border: 1px solid silver; }
         </style>
         <p w-id='/msg'>Enter text:</p>
         <p w-id='textDiv/text' contenteditable='true'>1)<br>2)<br>3)</p>
      `
      wcMixin(this)

      this.addEventListener('notify-timer', (ev) => {
         this.msg = `Enter text (elapsed ${ev.val}s):`
      })
   }

   async onRoute() {
      this.textDiv.focus()
      document.execCommand('selectAll',false,null)
      const but = document.createElement('button')
      but.innerHTML = 'Done<br>&rArr;'
      but.onclick = () => alert(this.text)
      this.bubbleEvent('set-buts', { custom: [but] })
   }
})

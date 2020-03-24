import WC from '../WeirdComponentMixin.js'
import './standard-controlls-details.js'

customElements.define('standard-controlls-summary', class extends HTMLElement {
   connectedCallback() {
      this.innerHTML = `
         <p>Weird Components Demo: <span w-name='/time'></span></p>
         <standard-controlls-details w-name='details'></standard-controlls-details>
         <br>
         <div>
            Summary:&emsp;
            <button w-name='hide'>Hide summary</button>
            <div w-name='summary/summ' style='margin-top:0.5em; border:1px solid silver'></div>
         </div>
         <br>
         <a href='https://github.com/balajahe/balajahe.github.io/tree/master/weird_components/'>Sources on GitHub</a>
      `
      WC.bind(this)

      setInterval(() => this.time = (new Date()).toLocaleString(), 500)

      this.hide.on('w-change', (_) => {
         if (this.hide.val) {
            this.summary.show(false)
            this.hide.innerHTML = 'Show summary'
         } else {
            this.summary.show()
            this.hide.innerHTML = 'Hide summary'
         }
      })

      this.details.on('w-input', () => {
         const dd = this.details
         this.summ =  `
            num1 = ${dd.n1}<br>
            num2 = ${dd.n2}<br>
            dat1 = ${dd.d1}<br>
            dat2 = ${dd.d2}<br>
            check = ${dd.ch}<br>
            butt = ${dd.but}<br>
            sel = ${JSON.stringify(dd.sel)}<br>
            selm = ${JSON.stringify(dd.selm)}<hr>
            <div style='display: inline-block; width: 49%'>
               ${dd.txar.val}
            </div>
            <div style='display: inline-block; width: 49%'>
               ${dd.div.val}
            </div>
         `
      }, true)
   }
})

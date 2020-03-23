import WC from '../WeirdComponentMixin.js'

customElements.define('standard-controlls', class extends HTMLElement {
   connectedCallback() {
      this.innerHTML = `
         <p>Weird Components Demo: <small w-name='/time'></small></p>
         <p>
            <input w-name='num1/n1' type='number' placeholder='Enter first number...'/>
            <input w-name='num2/n2' type='number' placeholder='Enter second number...'/>
            num1 + num2 = <span w-name='/n12'></span>
         </p>
         <p>
            <input w-name='dat1/d1' type='date'/>
            <input w-name='dat2/d2' type='date'/>
            dat2 - dat1 = <span w-name='/d12'></span>
         </p>
         <p>
            <label>Check me<input w-name='check/ch' type='checkbox'/></label>
            <span w-name='/ch1'></span>
            &emsp;
            <button w-name='button/but'>Press me</button>
            <span w-name='/but1'></span>
            &emsp;
            <button w-name='hide'>Hide summary</button>
         </p>
         <p style='display:flex; flex-flow:row nowrap'>
            <select w-name='select/sel' style='height:1.6em'>
               <option value="s1">Single select 1</option>
               <option value="s2">Single select 2</option>
               <option value="s3">Single select 3</option>
            </select>&nbsp;
            <span w-name='/sel1'></span>
            &emsp;
            <select w-name='selectm/selm' multiple>
               <option value="m1">Multiple select 1</option>
               <option value="m2">Multiple select 2</option>
               <option value="m3">Multiple select 3</option>
            </select>&nbsp;
            <span w-name='/selm1'></span>
            &emsp;
            <textarea w-name='txar' placeholder='Text area...'></textarea>&nbsp;
            <span w-name='txar1'></span>
         </p>
         <p><div>
            Div contenteditable="true":<br>
            <div w-name='div' contenteditable='true' style='display:inline-block; width:49%; height:5em; overflow:auto; border:1px solid silver'></div>
            <div w-name='div1' style='display:inline-block; width:49%; height:5em; overflow:auto; white-space: wrap'></div>
         </div></p>
         <p><div>
            Summary:
             <div w-name='summary' style='border:1px solid silver'></div>
         </div></p>
         <a href='https://github.com/balajahe/balajahe.github.io/tree/master/weird_components/'>Sources on GitHub</a>
      `
      new WC().bind(this)

      setInterval(() => {
         this.time = (new Date()).toLocaleString()
      }, 500)

      this.on('w-input',
         [this.num1, this.num2],
         (_) => this.n12 = this.n1 + this.n2
      )

      this.on('w-input',
         [this.dat1, this.dat2],
         (_) => this.d12 = (this.d2 - this.d1) / 86400000
      )

      this.check.on('w-change', (_) => this.ch1 = this.ch)
      this.button.on('w-change', (_) => {
         this.button.className = this.but
         this.but1 = this.but
      })
      this.hide.on('w-change', (_) => {
         if (this.hide.val) {
            this.summary.show(false)
            this.hide.innerHTML = 'Show summary'
         } else {
            this.summary.show()
            this.hide.innerHTML = 'Hide summary'
         }
      })

      this.select.on('w-change', (_) => this.sel1 = this.sel)
      this.selectm.on('w-change', (_) => this.selm1 = this.selm)

      this.txar.on('w-input', (ev) => this.txar1.val = ev.val.toUpperCase())
      this.div.on('w-input', (ev) => this.div1.val = ev.val.toUpperCase())

      this.on('w-input',
         [this.num1, this.num2, this.dat1, this.dat2, this.check, this.button, this.select, this.selectm, this.txar, this.div],
         () => {
            this.summary.val =  `
               num1 = ${this.n1}<br>
               num2 = ${this.n2}<br>
               dat1 = ${this.d1}<br>
               dat2 = ${this.d2}<br>
               check = ${this.ch}<br>
               butt = ${this.but}<br>
               sel = ${JSON.stringify(this.sel)}<br>
               selm = ${JSON.stringify(this.selm)}<hr>
               <div style='display: inline-block; width: 49%'>
                  ${this.txar.val}
               </div>
               <div style='display: inline-block; width: 49%'>
                  ${this.div.val}
               </div>
            `
         },
         true
      )
   }
})

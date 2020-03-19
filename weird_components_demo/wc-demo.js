import WC from './WeirdComponent.js'

customElements.define('wc-demo', class extends WC {
   connectedCallback() {
      this.innerHTML = `
         <p>Weird Components Demo: <small w-name='time'></small></p>
         <p>
            <input w-name='num1' type='number' placeholder='Enter first number...'/>
            <input w-name='num2' type='number' placeholder='Enter second number...'/>
            num1 + num2 = <span w-name='num12'></span>
         </p>
         <p>
            <input w-name='dat1' type='date'/>
            <input w-name='dat2' type='date'/>
            dat2 - dat1 = <span w-name='dat12'></span>
         </p>
         <p>
            <label>Check me<input w-name='check' type='checkbox'/></label>
            <span w-name='check1'></span>
            &emsp;
            <button w-name='butt'>Press me</button>
            <span w-name='butt1'></span>
         </p>
         <p style='display:flex; flex-flow:row nowrap'>
            <select w-name='sel' style='height:1.6em'>
               <option value="s1">Single select 1</option>
               <option value="s2">Single select 2</option>
               <option value="s3">Single select 3</option>
            </select>&nbsp;
            <span w-name='sel1'></span>
            &emsp;
            <select w-name='selm' multiple>
               <option value="m1">Multiple select 1</option>
               <option value="m2">Multiple select 2</option>
               <option value="m3">Multiple select 3</option>
            </select>&nbsp;
            <span w-name='selm1'></span>
            &emsp;
            <textarea w-name='txar'>Text area...</textarea>&nbsp;
            <span w-name='txar1'></span>
         </p>
         <p><div>
            Div contenteditable="true":<br>
            <div w-name='div' contenteditable='true' style='display:inline-block; width:49%; height:5em; overflow:auto; border:1px solid silver'></div>
            <div w-name='div1' style='display:inline-block; width:49%; height:5em; overflow:auto'></div>
         </div></p>
         <p><div>
            Summary:
             <div w-name='summary' style='border:1px solid silver'></div>
         </div></p>
      `
      this.generateProps()

      setInterval(() => {
         this.time = (new Date()).toLocaleString()
      }, 500)

      const calcnum = () => this.num12 = this.num1 + this.num2
      this._num1.addEventListener('w-input', calcnum)
      this._num2.addEventListener('w-input', calcnum)

      this._dat12.setFormula(
         'w-change',
         [this._dat1, this._dat2],
         () => (this.dat2 - this.dat1) / 86400000
      )

      this._check.addEventListener('w-change', (ev) => this.check1 = this.check)
      this._butt.addEventListener('w-change', (ev) => this.butt1 = this.butt)

      this._sel.addEventListener('w-change', (ev) => this.sel1 = ev.val)
      this._selm.addEventListener('w-change', (ev) => this.selm1 = ev.val)

      this._txar.addEventListener('w-input', (ev) => this.txar1 = ev.val.toUpperCase())
      this._div.addEventListener('w-input', (ev) => this.div1 = ev.val.toUpperCase())

      this._summary.setFormula(
         'w-input',
         [this._num1, this._num2, this._dat1, this._dat2, this._check, this._butt, this._sel, this._selm, this._txar, this._div],
         () => {
            return `
               num1 = ${this.num1}<br>
               num2 = ${this.num2}<br>
               dat1 = ${this.dat1}<br>
               dat2 = ${this.dat2}<br>
               check = ${this.check}<br>
               butt = ${this.butt}<br>
               sel = ${this.sel}<br>
               selm = ${this.selm}<hr>
               <div style='display: inline-block; width: 49%'>
                  ${this.txar}
               </div>
               <div style='display: inline-block; width: 49%'>
                  ${this.div}
               </div>
            `
         }
      )
   }
})

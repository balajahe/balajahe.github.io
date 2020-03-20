import WC from '../WeirdComponent.js'

customElements.define('wc-demo', class extends WC {
   connectedCallback() {
      this.innerHTML = `
         <p>Weird Components Demo: <small w-name='/time'></small></p>
         <p>
            <input w-name='num1/n1' type='number' placeholder='Enter first number...'/>
            <input w-name='num2/n2' type='number' placeholder='Enter second number...'/>
            num1 + num2 = <span w-name='num12/n12'></span>
         </p>
         <p>
            <input w-name='dat1/d1' type='date'/>
            <input w-name='dat2/d2' type='date'/>
            dat2 - dat1 = <span w-name='dat12/d12'></span>
         </p>
         <p>
            <label>Check me<input w-name='check/ch' type='checkbox'/></label>
            <span w-name='check1/ch1'></span>
            &emsp;
            <button w-name='butt/b'>Press me</button>
            <span w-name='butt1/b1'></span>
         </p>
         <p style='display:flex; flex-flow:row nowrap'>
            <select w-name='sel/se' style='height:1.6em'>
               <option value="s1">Single select 1</option>
               <option value="s2">Single select 2</option>
               <option value="s3">Single select 3</option>
            </select>&nbsp;
            <span w-name='sel1'></span>
            &emsp;
            <select w-name='selm/sem' multiple>
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
            <div w-name='div1' style='display:inline-block; width:49%; height:5em; overflow:auto; white-space: wrap'></div>
         </div></p>
         <p><div>
            Summary:
             <div w-name='/summary' style='border:1px solid silver'></div>
         </div></p>
         <a href='https://github.com/balajahe/balajahe.github.io/tree/master/weird_components/'>Sources on GitHub</a>
      `
      this.generate_props()

      setInterval(() => {
         this.time = (new Date()).toLocaleString()
      }, 500)

      this.set_formula('n12', 'w-input',
         [this.num1, this.num2],
         () => this.n1 + this.n2
      )

      this.set_formula('d12', 'w-input',
         [this.dat1, this.dat2],
         () => (this.d2 - this.d1) / 86400000
      )

      this.check.addEventListener('w-change', (ev) => this.ch1 = this.ch)
      this.butt.addEventListener('w-change', (ev) => this.b1 = this.b)

      this.sel.addEventListener('w-change', (ev) => this.sel1.val = this.sel.val)
      this.selm.addEventListener('w-change', (ev) => this.selm1.val = ev.val)

      this.txar.addEventListener('w-input', (ev) => this.txar1.val = ev.val.toUpperCase())
      this.div.addEventListener('w-input', (ev) => this.div1.val = ev.val.toUpperCase())

      this.set_formula('summary', 'w-input',
         [this.num1, this.num2, this.dat1, this.dat2, this.check, this.butt, this.sel, this.selm, this.txar, this.div],
         () => {
            return `
               num1 = ${this.n1}<br>
               num2 = ${this.n2}<br>
               dat1 = ${this.d1}<br>
               dat2 = ${this.d2}<br>
               check = ${this.ch}<br>
               butt = ${this.b}<br>
               sel = ${JSON.stringify(this.se)}<br>
               selm = ${JSON.stringify(this.sem)}<hr>
               <div style='display: inline-block; width: 49%'>
                  ${this.txar.val}
               </div>
               <div style='display: inline-block; width: 49%'>
                  ${this.div.val}
               </div>
            `
         }
      )
   }
})

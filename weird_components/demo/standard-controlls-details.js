import WC from '/weird_components/WeirdComponentMixin.js'

customElements.define('standard-controlls-details', class extends HTMLElement {
   connectedCallback() {
      this.innerHTML = `
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
            <button w-name='button/but/className'>Press me</button>
            <span w-name='/but1'></span>
            &emsp;
            <button w-name='setsel'>Select "v2"</button>
         </p>
         <p>
            <select w-name='select/sel' style='height:1.6em'>
               <option value="v1">Select 1</option>
               <option value="v2">Select 2</option>
               <option value="v3">Select 3</option>
            </select>
            <span w-name='/sel1'></span>
            &emsp;
            <select w-name='selectm/selm' multiple>
               <option value="v1">Multi-select 1</option>
               <option value="v2">Multi-select 2</option>
               <option value="v3">Multi-select 3</option>
            </select>
            <span w-name='/selm1'></span>
            &emsp;
            <textarea w-name='txar' placeholder='Text area...'></textarea>
            <span w-name='txar1'></span>
         </p>
         Div contenteditable="true":
         <div>
            <div w-name='div' contenteditable='true' style='display:inline-block; width:49%; height:5em; overflow:auto; border:1px solid silver'></div>
            <div w-name='div1' style='display:inline-block; width:49%; height:5em; overflow:auto; white-space: wrap'></div>
         </div>
      `
      WC.bind(this)

      this.onAny('w-input',
         [this.num1, this.num2],
         (_) => this.n12 = this.n1 + this.n2,
         true
      )

      this.onAny('w-change',
         [this.dat1, this.dat2],
         (_) => this.d12 = (this.d2 - this.d1) / 86400000,
         true
      )

      this.check.on('w-change', (_) => this.ch1 = this.ch)
      this.button.on('w-input', (_) => this.but1 = this.but)
      this.setsel.on('w-change', () => {
         this.sel = 'v2'
         this.selm = ['v2']
      })

      this.select.on('w-change', (_) => this.sel1 = this.sel)
      this.selectm.on('w-change', (_) => this.selm1 = this.selm)

      this.txar.on('w-input', (ev) => this.txar1.val = ev.val.toUpperCase())
      this.div.on('w-input', (ev) => this.div1.val = ev.val.toUpperCase())
   }
})

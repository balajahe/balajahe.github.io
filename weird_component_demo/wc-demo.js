import WC from './weird-component.js'

customElements.define('wc-demo', class extends WC {
   connectedCallback() {
      this.innerHTML = `
         <p>Weird Component Demo: <small val='time'></small></p>
         <p>
            <input val='num1' type='number' placeholder='Enter first number...'/>
            <input val='num2' type='number' placeholder='Enter second number...'/>
            num1 + num2 = <span val='num12'></span>
         </p>
         <p>
            <input val='dat1' type='date'/>
            <input val='dat2' type='date'/>
            dat2 - dat1 = <span val='dat12'></span>
         </p>
         <p>
            <button val='but'>Press me</button>
            <span val='but1'></span>
            &emsp;
            <label>Check me<input val='ch' type='checkbox'/></label>
            <span val='ch1'></span>
         </p>
         <p>
            <select val='sel'>
               <option value="s1">Single select 1</option>
               <option value="s2">Single select 2</option>
               <option value="s3">Single select 3</option>
            </select>
            <span val='sel1'></span>
            &emsp;
            <select val='selm' multiple>
               <option value="m1">Multiple select 1</option>
               <option value="m2">Multiple select 2</option>
               <option value="m3">Multiple select 3</option>
            </select>
            <span val='selm1'></span>
         </p>
         <div>
            Enter some formatted text:<br>
            <div val='ed' contenteditable='true' style='display:inline-block; width:49%; height:10em; overflow:auto; border:1px solid silver'></div>
            <div val='ed1' style='display:inline-block; width:49%; height:10em; overflow:auto'></div>
         </div>
         <p>
            Summary:
             <div val='summary'></div>
         </p>
      `
      this.generate_props()

      setInterval(() => {
         this.time = new Date().toLocaleString()
      }, 500)

      const calcnum = () => this.num12 = this.num1 + this.num2
      this._num1.addEventListener('val_input', calcnum)
      this._num2.addEventListener('val_input', calcnum)

      const calcdat = () => this.dat12 = (this.dat2 - this.dat1) / 86400000
      this._dat1.addEventListener('val_input', calcdat)
      this._dat2.addEventListener('val_input', calcdat)

      this._but.addEventListener('val_input', (ev) => this.but1 = ev.val)

      this._ch.addEventListener('val_input', (ev) => this.ch1 = ev.val)

      this._sel.addEventListener('val_input', (ev) => this.sel1 = ev.val)

      this._selm.addEventListener('val_input', (ev) => this.selm1 = ev.val)

      this._ed.addEventListener('val_input', (ev) => this.ed1 = ev.val.toUpperCase())

      const summary = (_) => {
         this.summary = `
<pre>
   num1 = ${this.num1}
   num2 = ${this.num2}
   dat1 = ${this.dat1}
   dat2 = ${this.dat2}
   but = ${this.but}
   ch = ${this.ch}
   sel = ${this.sel}
   selm = ${this.selm}
</pre>
${this.ed}
         `
      }
      this._ed.addEventListener('val_input', summary)
   }
})

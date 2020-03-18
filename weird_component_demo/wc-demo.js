import WC from './weird-component.js'

customElements.define('wc-demo', class extends WC {
   connectedCallback() {
      this.innerHTML = `
         <p>Weird-component demo: <small val='time'></small></p>
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
         <p>
            <div val='ed' contenteditable='true' style='display:inline-block; width:49%; height:10em; overflow:auto; border:1px solid black'>
               <small>Enter some text</small>...
            </div>
            <div val='ed1' style='display:inline-block; width:49%; height:10em; overflow:auto'></div>
         </p>
      `
      this.generate_props()

      setInterval(() => {
         this.time = new Date().toLocaleString()
      }, 500)

      const calcnum = () => this.num12 = this.num1 + this.num2
      this.num1_el.addEventListener('ch', calcnum)
      this.num2_el.addEventListener('ch', calcnum)

      const calcdat = () => this.dat12 = (this.dat2 - this.dat1) / 86400000
      this.dat1_el.addEventListener('ch', calcdat)
      this.dat2_el.addEventListener('ch', calcdat)

      this.but_el.addEventListener('ch', (_) => {
         this.but1 = this.but
      })

      this.ch_el.addEventListener('ch', () => {
         this.ch1 = this.ch
      })

      this.sel_el.addEventListener('ch', () => {
         this.sel1 = JSON.stringify(this.sel)
      })

      this.selm_el.addEventListener('ch', () => {
         this.selm1 = JSON.stringify(this.selm)
      })

      this.ed_el.addEventListener('ch', () => {
         this.ed1 = this.ed.toUpperCase()
      })
   }
})

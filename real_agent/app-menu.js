import wcMixin from '/WcMixin/WcMixin.js'

const me = 'app-menu'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style>
            ${me} {
               position: fixed; z-index: 10;
               width: 60%; max-width: calc(var(--app-max-width) * 0.6);
               margin: var(--margin1); padding: 0.5em;
               display: flex; flex-direction: column;
               background-color: LightGrey;
               border-right: solid 2px grey; border-bottom: solid 2px grey;
            }
            ${me} > button {flex: 1 1 auto; margin: 0.2em;}
         </style>
         <button w-id='home'>HOME</button>
         <button w-id='labels'>Organize labels</button>
         <button w-id='export'>Export database</button>
         <button w-id='source'>Sources on GitHub</button>
         <a w-id='a' style='display:none'></a>
      `
      wcMixin(this)

      this.home.onclick = () => APP.route('page-home')
      //this.labels.onclick = () => APP.route('page-labels')
      this.export.onclick = () => this.exportDb()
      this.source.onclick = () => location.href = 'https://github.com/balajahe/balajahe.github.io/tree/master/real_agent'
   }

   exportDb() {
      const res = []
      APP.db.transaction("Objects").objectStore("Objects").openCursor(null,'prev').onsuccess = (ev) => {
         const cur = ev.target.result
         if (cur) {
            res.push(cur.value)
            cur.continue()
         } else {
            const blob = new Blob([ JSON.stringify(res) ], { type : 'application/json' })
            URL.revokeObjectURL(this.a.href)
            this.a.href = URL.createObjectURL(blob)
            this.a.download = 'RealAgent.json'
            this.a.click()
         }
      }
   }
})

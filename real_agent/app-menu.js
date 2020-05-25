import wcMixin from '/WcMixin/WcMixin.js'
import {exportDB} from './obj-utils.js'

const me = 'app-menu'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style>
            ${me} {
               position: absolute;
               width: 70%; max-width: calc(var(--app-max-width) * 0.7);
               margin: var(--margin1); padding: 0.5em;
               border-right: solid 2px grey; border-bottom: solid 2px grey;
               display: flex; flex-direction: column;
               background-color: LightGrey;
            }
            ${me} > button {flex: 1 1 auto; margin: 0.2em;}
         </style>
         <button w-id='home'>HOME</button>
         <!--<button w-id='labels'>Organize labels</button>-->
         <button w-id='export'>Export database</button>
         <button w-id='source'>Sources on GitHub</button>
         <a w-id='a' style='display:none'></a>
      `
      wcMixin(this)

      this.home.onclick = () => location.reload() //location.href = APP.baseUrl
      //this.labels.onclick = () => APP.route('page-labels')
      this.export.onclick = () => exportDb()
      this.source.onclick = () => location.href = 'https://github.com/balajahe/balajahe.github.io/tree/master/real_agent'
   }
})

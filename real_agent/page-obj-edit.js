import wcMixin from '/WcMixin/WcMixin.js'
import {saveExistObj} from './obj-utils.js'

const me = 'page-obj-edit'
customElements.define(me, class extends HTMLElement {
   obj = null

   build(obj) {
      this.obj = obj
      return this
   }

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} > #descDiv {
               min-height: 5em;
               border: solid 1px silver;
               margin: var(--margin1); padding-left: var(--margin2);
            }
            ${me} > #labelsDiv { min-height: calc(var(--button-height) * 0.9); }
            ${me} > #allLabelsDiv { margin-top: var(--margin2); margin-bottom: var(--margin2); }
            ${me} button { height: calc(var(--button-height) * 0.8); }
            ${me} > .separ { display: flex; flex-flow: row nowrap; }
            ${me} > .separ hr { display: inline-block; flex: 1 1 auto; }
            ${me} > #newLabelInp { width: 30%; }
            ${me} > iframe { height: 250px; width: 100%; }
         </style>
         <div w-id='descDiv/desc' contenteditable='true'></div>
         <div w-id='labelsDiv/labels/children'></div>
         <div w-id='mediaDiv'></div>
         <iframe w-id='mapIframe'></iframe>
         <div w-id='/loc'></div>
         <div w-id='allLabelsDiv'>
            <div class='separ'>&nbsp;<small>Click to add label:</small>&nbsp;<hr/></div>
            <input w-id='newLabelInp/newLabel' placeholder='New label...'/>
         </div>
      `
      wcMixin(this)

      if (!localStorage.getItem('labels')) {
         localStorage.setItem('labels', 'Дом,Дача,Участок,Заброшен,Ветхий,Разрушен,Жилой,Продается')
      }
      for (const lab of localStorage.getItem('labels').split(',')) this.addAvailLabel(lab)

      if (this.obj) {
         this.desc = this.obj.desc
         for (const lab of this.obj.labels) this.addLabel(lab)
      }

      this.mediaDiv.replaceWith(document.createElement('obj-media-div').build(this.obj, true))

      if (this.obj.location) {
         this.loc = this.obj.location.latitude + ' - ' + this.obj.location.longitude
         this.mapIframe.contentWindow.location.replace(`https://www.openstreetmap.org/export/embed.html?bbox=${APP.location.longitude-0.002}%2C${APP.location.latitude-0.002}%2C${APP.location.longitude+0.002}%2C${APP.location.latitude+0.002}&layer=mapnik&marker=${APP.location.latitude}%2C${APP.location.longitude}`)
      }

      this.newLabelInp.onkeypress = (ev) => {
         if (ev.key === 'Enter') {
            this.addAvailLabel(this.newLabel)
            localStorage.setItem('labels', localStorage.getItem('labels') + ',' + this.newLabel)
            this.newLabel = ''
         }
      }
   }

   addLabel(lab) {
      const but = document.createElement("button")
      but.innerHTML = lab
      but.onclick = () => but.remove()
      this.labelsDiv.append(but)
   }

   addAvailLabel(lab) {
      const but = document.createElement("button")
      but.innerHTML = lab
      but.onclick = (ev) => this.addLabel(ev.target.innerHTML)
      this.newLabelInp.before(but)
   }

   onRoute() {
      APP.setBar({
         buts: [{
            html: 'Save<br>&rArr;',
            click: () => {
               if (this.desc) {
                  saveExistObj()
                  APP.popModal()
               } else {
                  APP.setMsg('<span style="color:red">Empty description !</span>')
                  this.descDiv.focus()
               }
            }
         }]
      })
   }
})

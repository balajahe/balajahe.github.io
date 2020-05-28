import wcMixin from '/WcMixin/WcMixin.js'
import './media-container.js'

const me = 'obj-edit'
customElements.define(me, class extends HTMLElement {
   obj = null

   build(obj) {
      this.obj = obj
      return this
   }

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} button { height: calc(var(--button-height) * 0.8); }
            ${me} input { height: calc(var(--button-height) * 0.8); width: 30%; }
            ${me} > #descDiv {
               min-height: 5em;
               margin: var(--margin1); padding-left: var(--margin2);
               border: solid 1px silver;
               display: block;
            }
            ${me} #labelsDiv { min-height: calc(var(--button-height) * 0.9); }
            ${me} .separ { margin-top: var(--margin2); flex-flow: row nowrap; }
            ${me} .separ hr { display: inline-block; flex: 1 1 auto; }
            ${me} #locDiv { 
               height: 250px; width: 100%; 
               margin-top: var(--margin2); margin-bottom: var(--margin2);
            }
            ${me} #locDiv > iframe { 
               display: inline-block; 
               width: 100%; /*calc(100% - var(--button-height)); */
            }
            ${me} #locDiv > div { 
               display: none;
               height: 100%; width: var(--button-height);
               flex-direction: column; justify-content: center; align-items: margin-bottom;
               writing-mode: tb-rl; text-align: right; padding-bottom: 0.3rem;
            }
         </style>
         <div id='locDiv'>
            <iframe w-id='mapIframe'></iframe>
            <div w-id='/loc'></div>
         </div>
         <div w-id='descDiv/desc' contenteditable='true'></div>
         <nav w-id='labelsDiv/labels/children'></nav>
         <media-container w-id='objMedias/medias/value'></media-container>
         <div class='separ'>&nbsp;<small>Click to add label:</small>&nbsp;<hr/></div>
         <div w-id='allLabelsDiv'>
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

      this.objMedias.build(this.obj.medias, true, true)

      if (this.obj.location) {
         this.loc = this.obj.location.latitude + ' - ' + this.obj.location.longitude
         this.mapIframe.contentWindow.location.replace(`https://www.openstreetmap.org/export/embed.html?bbox=${this.obj.location.longitude-0.002}%2C${this.obj.location.latitude-0.002}%2C${this.obj.location.longitude+0.002}%2C${this.obj.location.latitude+0.002}&layer=mapnik&marker=${this.obj.location.latitude}%2C${this.obj.location.longitude}`)
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
      APP.setBar([
         ['but', 'Delete<br>&#8224;', () => {
            if (confirm('Delete current object forever ?')) this.deleteObj()
         }],
         ['sep'],
         ['but', 'Cancel<br>&lArr;', () => history.go(-1)],
         ['but', 'Save<br>&rArr;', () => {
            if (!this.desc) {
               APP.setMsg('<span style="color:red">Empty description !</span>')
               this.descDiv.focus()
            } else if (this.labels.length === 0) {
               APP.setMsg('<span style="color:red">No labels !</span>')
            } else {
               this.saveExistObj()
            }
         }]
      ])
   }

   saveExistObj() {
      const origins = []
      this.medias.forEach(media => {
         origins.push({ created: media.created, origin: media.origin })
      })
      const now = APP.now()
      const obj = {
         created: this.obj.created,
         modified: now,
         location: this.obj.location,
         desc: this.desc,
         labels: Array.from(this.labels).map(el => el.innerHTML),
         medias: Array.from(this.medias).map(media => media)
      }
      APP.db.transaction("Objects", "readwrite").objectStore("Objects").put(obj).onsuccess = (ev) => {
         document.querySelector('obj-list').setItem(obj)
         APP.popModal()
         APP.setMsg('Saved !')
      }
   }

   deleteObj(id) {
      APP.db.transaction("Objects", "readwrite").objectStore("Objects").delete(this.obj.created).onsuccess = (ev) => {
         document.querySelector('obj-list').getItem(this.obj.created).remove()
         APP.popModal()
         APP.setMsg('Deleted !')
      }
   }
})

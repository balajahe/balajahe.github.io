export function saveNewObj() {
   const med = document.querySelector('page-obj-new1')
   const form = document.querySelector('page-obj-new2')
   const created = (new Date()).toISOString().replace(/:/g, '.').replace(/T/g, ', ').slice(0, -5)
   const obj = {
      created: created,
      modified: created,
      location: {latitude: APP.location?.latitude, longitude: APP.location?.longitude},
      desc: form.desc,
      labels: Array.from(form.labels).map(el => el.innerHTML),
      medias: Array.from(med.medias).map(el => ({ tagName: el.firstChild.tagName, blob: el.firstChild._blob }))
   } 
   APP.db.transaction("Objects", "readwrite").objectStore("Objects").add(obj).onsuccess = (ev) => {
      APP.remove(med)
      APP.remove(form)
      document.querySelector('page-home').addObj(obj)
      APP.setMsg('Saved !')
   }
}

export function saveExistObj() {
   APP.setMsg('Saved !')
}

export function exportDB() {
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

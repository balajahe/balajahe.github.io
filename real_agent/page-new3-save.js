export default function objSave() {
   const med = document.querySelector('page-new1-media')
   const form = document.querySelector('page-new2-form')
   const created = (new Date()).toISOString().replace(/:/g, '.').replace(/T/g, ', ').slice(0, -5)
   const obj = {
      created: created,
      modified: created,
      desc: form.desc,
      location: {latitude: APP.location?.latitude, longitude: APP.location?.longitude},
      labels: Array.from(form.labels).map(el => el.innerHTML),
      medias: Array.from(med.medias).map(el => ({tagName: el.tagName, blob: el._blob}))
   }
   APP.db.transaction("Objects", "readwrite").objectStore("Objects").add(obj).onsuccess = (ev) => {
      APP.remove(med)
      APP.remove(form)
      APP.route('page-home')
      APP.setMsg('Saved !')
   }
}

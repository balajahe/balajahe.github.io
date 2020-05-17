export default function save() {
   const new1 = document.querySelector('page-new1')
   const new2 = document.querySelector('page-new2-video')
   const created = (new Date()).toISOString().replace(/:/g, '.').replace(/T/g, ', ').slice(0, -5)
   const obj = {
      created: created,
      modified: created,
      desc: new1.desc,
      location: APP.location,
      labels: Array.from(new1.labels).map(el => el.innerHTML),
      medias: Array.from(new2.medias).map(el => ({tagName: el.tagName, blob: el._blob}))
   }
   APP.db.transaction("Objects", "readwrite").objectStore("Objects").add(obj).onsuccess = (ev) => {
      APP.remove(new1)
      APP.remove(new2)
      APP.route('page-home')
      APP.setMsg('Saved !')
   }
}

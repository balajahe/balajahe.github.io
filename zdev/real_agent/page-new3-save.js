export default function save() {
   const new1 = document.querySelector('page-new1')
   const new2 = document.querySelector('page-new2-video')
   const obj = {
      desc: new1.desc,
      location: APP.location,
      labels: Array.from(new1.labels).map(el => el.innerHTML),
      medias: Array.from(new2.medias).map(el => ({tagName: el.tagName, blob: el._blob}))
   }
   //console.log(obj)
   const tr = APP.db.transaction(["Objects"], "readwrite")
   const os = tr.objectStore("Objects")
   const re = os.add(obj)
   re.onsuccess = (ev) => {
      console.log(ev.target.result)
      //APP.remove(new1)
      //APP.remove(new2)
      APP.route('page-home')
      APP.bubbleEvent('set-msg', 'Saved !')
   }
}

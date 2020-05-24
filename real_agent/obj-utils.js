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

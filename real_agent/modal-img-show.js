import wcMixin from '/WcMixin/WcMixin.js'

const me = 'modal-img-show'

customElements.define(me, class extends HTMLElement {
	src = null
	delAction = null

	build(src, del) {
		this.src = src
		this.delAction = del
		return this
	}

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} > img { height: auto; width: 100%; }
				${me} > img:hover { cursor: pointer; }
			</style>
			<img w-id='img'/>
		`
		wcMixin(this)
		this.img.src = this.src
		this.onclick = () => history.go(-1)
	}

   onRoute() {
   	const bar = []
   	if (this.delAction) bar.push(['but', 'Delete<br>&#8224;', () => { 
   		this.delAction()
   		history.go(-1)
   	}])
      APP.setBar(bar.concat([
         ['msg', ''],
         ['but', 'Close<br>&#65794;', () => history.go(-1)],
      ]))
   }
})

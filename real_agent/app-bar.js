import wcMixin from '/WcMixin/WcMixin.js'
import './app-menu.js'

const me = 'app-bar'
customElements.define(me, class extends HTMLElement {
	_stack = []

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} {
					display: flex; flex-flow: row nowrap;
				}
				${me} > button {
					height: calc(100% - 1*var(--margin1));
					margin-top: 0;
					min-width: 3.8rem;
				}
				${me} > div {
					display: inline-block;
					height: 100%;
					flex: 1 1 auto;
					margin-top: var(--margin1); margin-left: 0.5em; margin-right: 0.5em;
					display: flex; flex-flow: row wrap; justify-content: center; align-items: center; text-align: center;
					overflow: hidden;
					font-size: small;
				}
				${me} #msgBut {
					display: none;
					position: fixed; z-index: 1000;
					top: 0; left:calc(100% - 10rem);
					height: var(--app-bar-height);
					width: 10rem;
					margin: 0;
					background-color: silver;
				}
			</style>
			
			<app-menu w-id='appMenu' style='display:none'></app-menu>
			<button w-id='menuBut'>&#9776;</button>
		`
		wcMixin(this)

		this.menuBut.onclick = (ev) => {
			ev.stopPropagation()
			this.appMenu.display()
			APP.onclick = () => {
				this.appMenu.display(false)
				APP.onclick = null
			}
		}
	}

	setBar(bar) {
		for (let el = this.menuBut.nextElementSibling; el; el = this.menuBut.nextElementSibling) el.remove()
		for (const b of bar) {
			if (b) {
				let el = document.createElement('button')

				if (b[0] === 'but') {
					el.innerHTML = b[1]
					el.onclick = b[2]

				} else if (b[0] === 'back') {
					el.innerHTML = 'Back<br>&lArr;'
					if (b[1]) el.onclick = b[1]
					else el.onclick = () => history.go(-1)

				} else if (b[0] === 'ok') {
					el.innerHTML = 'OK'
					if (b[1]) el.onclick = b[1]
					else el.onclick = () => history.go(-1)

				} else if (b[0] === 'cancel') {
					el.innerHTML = 'Cancel<br>&lArr;'
					el.onclick = () => history.go(-1)

				} else if (b[0] === 'next') {
					el.innerHTML = 'Next<br>&rArr;'
					el.onclick = b[1]

				} else if (b[0] === 'new') {
					el.innerHTML = 'New<br>&rArr;'
					el.onclick = b[1]

				} else if (b[0] === 'save') {
					el.innerHTML = 'Save<br>&rArr;'
					el.onclick = b[1]

				} else if (b[0] === 'delete') {
					el.innerHTML = 'Delete<br>&#8224;'
					el.onclick = b[1]

				} else if (b[0] === 'msg') {
					el = document.createElement('div')
					el.className = 'msgDiv'
					el.innerHTML = b[1]

				} else if (b[0] === 'sep') {
					el = document.createElement('div')
					el.className = 'msgDiv'
				}

				this.append(el)
			}
		}
	}

	pushBar() {
		const old = []
		for (let b = this.menuBut.nextElementSibling; b; b = this.menuBut.nextElementSibling) {
			old.push(b)
			b.remove()
		}
		this._stack.push(old)
	}

	popBar() {
		for (let b = this.menuBut.nextElementSibling; b; b = this.menuBut.nextElementSibling) b.remove()
		for (const b of this._stack.pop()) this.append(b)
	}

	message(msg, timeout = 2000) { 
		setTimeout(() => {
			const div = this.querySelectorAll('div')[0]
			const saveContent = div.innerHTML
			div.innerHTML = '<b>' + msg + '</b>'
			setTimeout(() => div.innerHTML = saveContent, timeout)
		}, 100)
	}
})

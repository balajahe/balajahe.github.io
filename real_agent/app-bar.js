import wcMixin from '/WcMixin/WcMixin.js'
import './app-menu.js'

const me = 'app-bar'
const stack = []

customElements.define(me, class extends HTMLElement {

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} {
					display: flex; flex-flow: row nowrap;
				}
				${me} > button {
					height: calc(100% - 2*var(--margin1));
					min-width: 17%;
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
				if (b[0] === 'msg') {
					const el = document.createElement('div')
					el.className = 'msgDiv'
					el.innerHTML = b[1]
					this.append(el)
				} else if (b[0] === 'sep') {
					const el = document.createElement('div')
					el.className = 'msgDiv'
					this.append(el)
				} else if (b[0] === 'back') {
					const el = document.createElement('button')
					el.innerHTML = 'Back<br>&lArr;'
					el.onclick = () => history.go(-1)
					this.append(el)
				} else if (b[0] === 'but') {
					const el = document.createElement('button')
					el.innerHTML = b[1]
					el.onclick = b[2]
					this.append(el)
				}
			}
		}
	}

	setMsg(msg) { 
		this.querySelectorAll('div')[0].innerHTML = msg ? msg : '' 
	}

	pushBar() {
		const old = []
		for (let b = this.menuBut.nextElementSibling; b; b = this.menuBut.nextElementSibling) {
			old.push(b)
			b.remove()
		}
		stack.push(old)
	}

	popBar() {
		for (let b = this.menuBut.nextElementSibling; b; b = this.menuBut.nextElementSibling) b.remove()
		for (const b of stack.pop()) this.append(b)
	}
})

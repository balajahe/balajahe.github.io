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
					height: 100%;
					min-width: 17%;
				}
				${me} > div {
					display: inline-block;
					height: 100%;
					flex: 1 1 auto;
					margin-left: 0.5em; margin-right: 0.5em; margin-top: var(--margin1);
					display: flex; justify-content: center; align-items: center; text-align: center;
					font-size: small;
					overflow: hidden;
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
			let el
			if (b[0] === 'msg') {
				el = document.createElement('div')
				el.className = 'msgDiv'
				el.innerHTML = b[1]
			} else if (b[0] === 'back') {
				el = document.createElement('button')
				el.innerHTML = 'Back<br>&lArr;'
				el.onclick = () => history.go(-1)
			} else if (b[0] === 'but') {
				el = document.createElement('button')
				el.innerHTML = b[1]
				el.onclick = b[2]
			}
			this.append(el)
		}
	}


	addBackBut(click) {
		const b = document.createElement('button')
		b.innerHTML = 'Back<br>&lArr;'
		b.onclick = click ? click : () => history.go(-1)
		this.append(b)
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

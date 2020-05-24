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
					height: 100%;
					min-width: 17%;
				}
				${me} #msgDiv {
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
			<div w-id='msgDiv'></div>
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

		this.addBackBut()
	}

	addBackBut(click) {
		const b = document.createElement('button')
		b.innerHTML = 'Back<br>&lArr;'
		b.onclick = click ? click : () => history.go(-1)
		this.append(b)
	}

	setMsg(msg) { this.msgDiv.val = msg ? msg : '' }

	setBar(bar) {
		this.msgDiv.val = bar.msg ? bar.msg : ''

		const back = this.msgDiv.nextElementSibling
		back.disabled = bar.back?.disabled ? true : false
		if (bar.back?.onclick) back.onclick = bar.back.click

		for (let b = back.nextElementSibling; b; b = back.nextElementSibling) b.remove()
		if (bar.buts) for (const b of bar.buts) {
			const but = document.createElement('button')
			but.innerHTML = b.html
			but.onclick = b.click
			this.append(but)
		}
	}

	pushBar() {
		const old = []
		for (let b = this.msgDiv.nextElementSibling; b; b = this.msgDiv.nextElementSibling) {
			old.push(b)
			b.remove()
		}
		this._stack.push(old)
	}

	popBar() {
		for (let b = this.msgDiv.nextElementSibling; b; b = this.msgDiv.nextElementSibling) b.remove()
		for (const b of this._stack.pop()) this.append(b)
	}
})

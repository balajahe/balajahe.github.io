import wcMixin from '/WcMixin/WcMixin.js'
import './app-menu.js'

const me = 'app-bar'
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
				${me} > #msgDiv {
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
			<button w-id='backBut' disabled>Back<br>&lArr;</button>
			<button></button>
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

		this.backBut.onclick = () => history.go(-1)
	}

	setMsg(msg) { this.msgDiv.val = msg ? msg : '' }

	setBar(bar) {
		this.msgDiv.val = bar.msg ? bar.msg : ''
		this.backBut.disabled = bar.back === false ? true : false
		for (let b = this.backBut.nextSibling; b; b = this.backBut.nextSibling) b.remove()
		if (bar.buts) for (const b of bar.buts) {
			const but = document.createElement('button')
			but.innerHTML = b.html
			but.onclick = b.click
			this.append(but)
		}
	}
})

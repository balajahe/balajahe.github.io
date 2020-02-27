customElements.define('item-search',
    class extends HTMLElement {
        constructor() {
            super()
            this.innerHTML = `
                <form action="#" style="display:inline">
                    <input type="text" required placeholder="Search text (alt-shift-s)..." accesskey="s"/> 
                    <input type="submit" value="Search"/>
                </form>
            `
            this.querySelector('form').addEventListener('submit', (ev) => {
                ev.preventDefault()
                const its = document.querySelector('item-list').items_filter(this.querySelector('input').value)

                const w = document.createElement('div')
                w.style = 'position:absolute; left:0; top:0; width:100vw; height:100vh; background:rgba(0, 0, 0, 0.5)'
                w.innerHTML = `
                    <div style="position:absolute; width:60vw; height:60vh; left:20vw; top:20vh; padding:2%; overflow:auto; background: white">
                        <button>Close window</button>
                        <ol style="display:flex; flex-direction:column-reverse"></ol>
                    </div>
                `
                for (const it of its) {
                    w.querySelector('ol').insertAdjacentHTML('beforeend', it.innerHTML) // клонирование wc не работает
                } 

                document.body.appendChild(w)
                w.querySelector('button').focus()
                w.querySelector('button').addEventListener('click', (ev) => {
                    document.body.removeChild(w)
                    document.querySelector('item-list').focus()
                })
            })
        }
    }
)
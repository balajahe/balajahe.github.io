customElements.define('login-session',
    class extends HTMLElement {
        _login_name = ''
        get login_name() { return this._login_name }

        constructor() {
            super()
            this.innerHTML = `
                <form action="#">
                    <input is="input-text" required placeholder="Your name..."/>
                    <input type="submit" value="Enter"/>
                </form>
                <div>
                    <p>
                        Your name is "<a href="#"></a>"
                        &emsp;
                        <item-search/>
                    </p>
                    <item-list/>
                </div>
            `
            this.querySelector('form').addEventListener('submit', (ev) => {
                ev.preventDefault()
                this._login_name = this.querySelector('input').value
                this.display('item_list')
            })
            this.querySelector('a').addEventListener('click', (ev) => {
                ev.preventDefault()
                this.display('login')
            })
            this.display('login')
        }

        display(mode) {
            if (mode === 'login') {
                location.hash = '#login'    
                this.querySelector('form').style.display = 'block'
                this.querySelector('div').style.display = 'none'
                document.querySelector('input').focus()  
            } 
            else if (mode === 'item_list') {
                location.hash = '#item_list'    
                this.querySelector('form').style.display = 'none'
                this.querySelector('div').style.display = 'block'
                this.querySelector('a').innerHTML = this.login_name
                this.querySelector('item-list').focus()
            }
        }
    }
)
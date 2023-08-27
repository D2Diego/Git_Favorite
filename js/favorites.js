import { GithubUser } from "./GithubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }


    async add(username) {
        try {
            const userExistis = this.entries.find(entry => entry.login === username)


            const user = await GithubUser.search(username)

            if (user.login === undefined) {
                throw new Error('usuário não encontrado')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        }
        catch (error) {
            alert(error.message)
        }

    }
    delete(user) {
        const filterEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filterEntries

        this.update()
        this.save()
    }

}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('#favoritar')

        addButton.onclick = () => {
            const { value } = this.root.querySelector('#input-search')

            this.add(value)
        }
    }

    update() {
        this.removeALLtr()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers


            row.querySelector('.remove').onclick = () => {
                const really = confirm('Tem certeza que deseja deletar essa linha?')
                if (really) {
                    this.delete(user)
                }
            }
            this.tbody.append(row)

        })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
            <a href="https://github.com/maykbrito" target="_blank">
                <p>Mayk Brito</p>
                <span>maykbrito</span>
            </a>
        </td>
        <td class="repositories">
            76
        </td>
        <td class="followers">
            9589
        </td>
        <td>
            <button class="remove">Remover</button>
        </td>
        `

        return tr
    }

    removeALLtr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }

}
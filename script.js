class Atom {
    constructor(x, y, bondedTo) {
        this.x = x
        this.y = y
        this.bonds = []
        this.element = document.createElement('div')
        this.element.classList.add('atom')
        this.element.style.left = `${this.x}px`
        this.element.style.top = `${this.y}px`
        this.element.style.zIndex = '1'
        if (bondedTo) {
            this.molecule = bondedTo.molecule
            this.bonds = [bondedTo]
            this.molecule.atoms.push(this)
            bondedTo.bonds.push(this)
            let bond = document.createElement('div')
            bond.classList.add('bond')
            bond.style.left = `${(this.x + bondedTo.x) / 2}px`
            bond.style.top = `${(this.y + bondedTo.y) / 2}px`
            let width = Math.sqrt(((this.x - bondedTo.x) * (this.x - bondedTo.x)) + ((this.y - bondedTo.y) * (this.y - bondedTo.y)))
            bond.style.width = `${width}px`
            let rotate = Math.atan((bondedTo.y - this.y) / (bondedTo.x - this.x))
            console.log(rotate)
            bond.style.transform = `translate(${width / -2}px, -1px) rotate(${rotate}rad)`
            // bond.style.transform = `rotate(${rotate}rad) translate(${0 * Math.abs((this.x - bondedTo.x) / 2)}px, ${-1 * Math.abs((this.y - bondedTo.y) / 2)}px)`
            // bond.style.transform = `rotate(${rotate}rad) translate(${-1 * Math.abs((this.x - bondedTo.x) / 2)}px, ${-1 * Math.abs((this.y - bondedTo.y) / 2)}px)`
            bond.addEventListener('mouseenter', () => {
                cursorInAtom = true
            })
            bond.addEventListener('mouseleave', () => {
                cursorInAtom = false
            })
            document.body.appendChild(bond)
        } else {
            this.molecule = new Molecule([this])
        }
        this.element.addEventListener('click', () => {
            if (selected == this) {
                selected = null
                this.element.style.backgroundColor = 'white'
                return
            }
            selected = this
            for (let atom of document.querySelectorAll('.atom')) {
                atom.style.backgroundColor = 'white'
            }
            this.element.style.backgroundColor = 'brown'
        })
        this.element.addEventListener('mouseenter', () => {
            cursorInAtom = true
        })
        this.element.addEventListener('mouseleave', () => {
            cursorInAtom = false
        })
        document.body.appendChild(this.element)
    }
}

class Molecule {
    constructor(atoms) {
        this.atoms = atoms
    }
}

let atoms = []
let molecules = []
let cursorInAtom = false

let selected = null

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', event => {
        if (!cursorInAtom) {
            let newAtom = new Atom(event.offsetX, event.offsetY, selected)
            for (let atom of document.querySelectorAll('.atom')) {
                atom.style.backgroundColor = 'white'
            }
            atoms.push(newAtom)
            if (!selected) {
                molecules.push(newAtom.molecule)
            }
            selected = null
        }
    })
})
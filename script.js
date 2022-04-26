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

class Chain {
    constructor(atoms) {
        this.atoms = atoms
        this.branchesAt = []
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
            console.log(nameMolecule(newAtom.molecule))
            if (!selected) {
                molecules.push(newAtom.molecule)
            }
            selected = null
        }
    })
})

function nameMolecule(molecule) {
    let chains = []
    for (let moleculeAtomIndex = 0; moleculeAtomIndex < molecule.atoms.length; moleculeAtomIndex++) {
        let atom = molecule.atoms[moleculeAtomIndex]
        if (atom.bonds.length == 0) {
            chains.push(new Chain([atom]))
        }
        if (atom.bonds.length == 1) {
            let newChain = new Chain([atom, atom.bonds[0]])
            chains.push(newChain)
            let changed = false
            do {
                changed = checkChains(chains)
                console.log('checking')
            } while (changed)
        }
    }
    let parentLength = 0
    for (let chain of chains) {
        if (chain.atoms.length > parentLength) {
            parentLength = chain.atoms.length
        }
    }
    console.log(chains)
    return parentLength
}

function checkChains(chains) {
    let changed = false
    for (let chainIndex = 0; chainIndex < chains.length; chainIndex++) {
        let chain = chains[chainIndex]
        let lastAtom = chain.atoms[chain.atoms.length - 1]
        if (lastAtom.bonds > 1) {
            changed = true
            let secondlastAtom = chain.atoms[chain.atoms.length - 2]
            let otherAtoms = []
            for (let i = 0; i < lastAtom.bonds.length; i++) {
                if (lastAtom.bonds[i] != secondlastAtom) {
                    otherAtoms.push(lastAtom.bonds[i])
                }
            }
            for (let i = 1; i < otherAtoms.length; i++) {
                let newChain = chain.copy()
                newChain.atoms.push(otherAtoms[i])
                chains.push(newChain)
            }
            chain.atoms.push(otherAtoms[0])
        }
    }
    return changed
}
const Commander = require('commander')
const database = require('./database')
const Heroi = require('./heroi')

async function main(params) {
    Commander
        .version('v1')
        .option('-n, --nome [value]', "Nome do Herói")
        .option('-p, --poder [value]', "Poder do Herói")
        .option('-i, --id [value]', "Id do Herói")

        .option('-c, --cadastrar', "Cadastrar um Herói")
        .option('-l, --listar', "Listar um Herói")
        .option('-r, --remover', "Remover um Herói pelo Id")
        .option('-a, --atualizar [value]', "Atualizar um Herói pelo Id")
        .parse(process.argv)
    
    const heroi = new Heroi(Commander)

    try {
        if(Commander.cadastrar) {
            delete heroi.id
            const resultado = await database.cadastrar(heroi)
            if(!resultado) {
                console.error("Herói não foi cadastrado!")
                return;
            }
            console.log(`${heroi.nome} cadastrado com sucesso!`)
            return;
        }

        if(Commander.listar) {
            const resultado = await database.listar()
            console.log(resultado)
            return;
        }
        
        if(Commander.remover) {
            const resultado = await database.remover(heroi.id)
            if(!resultado) {
                console.error(`Não foi possivel remover o herói ${heroi.nome}.`)
                return;
            }
            console.log(`${heroi.nome} removido com sucesso!`)
            return;
        }

        if(Commander.atualizar) {
            const idAtualizar = parseInt(Commander.atualizar)
            delete heroi.id
            const dado = JSON.stringify(heroi)
            const heroiAtualizar = JSON.parse(dado)
            const resultado = await database.atualizar(idAtualizar, heroiAtualizar)
            if(!resultado) {
                console.error("Não foi possível atualizar Herói")
                return;
            }
            console.log("Herói atualizado com sucesso")
            return;
        }
    } catch (error) {
        console.error("Deu ruim: ", error)
    }
}

main()
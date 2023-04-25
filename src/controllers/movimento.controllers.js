import { ObjectId } from "mongodb"
import { db } from "../database/database.connection.js"
import dayjs from "dayjs"




export async function novoMovimento(req, res) {//usa token
    const { tipo } = req.params
    const { valor } = (req.body)
    const { descrição } = (req.body)
    const { dia } = (req.body)

    const novoMovimento = {
        valor: valor,
        tipo: tipo,
        descrição: descrição,
        dia: dia
    }


    try {
        const sessao = res.locals.sessao
        await db.collection("movimento").insertOne({ ...novoMovimento, idUsuario: sessao.idUsuario })
        return res.status(201).send("Movimento adicionado!")
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}


export async function paginaInicial(req, res) { //usa token

    try {
        const sessao = res.locals.sessao
        const usuario = await db.collection("usuarios").findOne({ _id: sessao.idUsuario })
        if (usuario) delete usuario.senha
        const extratoDoUsuario = await db.collection("movimento").find({ idUsuario: usuario._id }).sort({ _id: -1 }).toArray()


        const entradas = extratoDoUsuario.filter((obj) => obj.tipo === "entrada")
        const saidas = extratoDoUsuario.filter((obj) => obj.tipo === "saida")



        if (entradas.length === 0 && saidas.length === 0){
            const saldoFinal = 0
            return res.status(200).send({extratoDoUsuario, saldoFinal})
        } else if (entradas.length !== 0 && saidas.length ===0){
            const saldoFinal = extratoDoUsuario.filter((obj) => obj.tipo === "entrada").map((i)=> (parseFloat(i.valor))).reduce((total, quantidade) => total + quantidade);
            return res.status(200).send({extratoDoUsuario, saldoFinal})
        } else if (entradas.length === 0 && saidas.length !==0){
            const saldoFinal = extratoDoUsuario.filter((obj) => obj.tipo === "saida").map((i)=> (parseFloat(i.valor))).reduce((total, quantidade) => total + quantidade);
            return res.status(200).send({extratoDoUsuario, saldoFinal})
        } else if (entradas.length !== 0 && saidas.length !==0){
            const entradasTotais = extratoDoUsuario.filter((obj) => obj.tipo === "entrada").map((i)=> (parseFloat(i.valor))).reduce((total, quantidade) => total + quantidade);
            const saidasTotais = extratoDoUsuario.filter((obj) => obj.tipo === "saida").map((i)=> (parseFloat(i.valor))).reduce((total, quantidade) => total + quantidade);
            const saldoFinal = (entradasTotais - saidasTotais).toFixed(2)
            return res.status(200).send({extratoDoUsuario, saldoFinal})
        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deletarMovimentoPorUsuario(req, res) {//uso próprio pra limpar os movimentos
    const { id } = req.params

    try {
        const deletar = await db.collection("movimento").deleteMany({ idUsuario: new ObjectId(id) })
        if (deletar.deletedCount === 0) return res.status(404).send("Esse item não existe!")
        res.send("Item deletado com sucesso!")
    }

    catch (err) {
        res.status(500).send(err.message)
    }
}

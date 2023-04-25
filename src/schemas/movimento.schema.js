import joi from "joi"

export const movimentoSchema = joi.object({
    valor: joi.number().positive().required(),
    descrição: joi.string().required(),
    dia: joi.required()
})
import { Router } from "express";
import { cadastarUsuario, deletarUsuarios, deslogarUsuario, fazerLogin, verSessoes, verUsuarios } from "../controllers/usuario.controllers.js";
import { schemaValido } from "../middlewares/schema.middleware.js";
import { cadastroSchema } from "../schemas/cadastro.schema.js";
import { loginSchema } from "../schemas/login.schema.js";
import { authValidar } from "../middlewares/auth.middleware.js";


const usuarioRouter = Router()


//PARA USO PROPRIO
usuarioRouter.get("/cadastro", verUsuarios)
usuarioRouter.delete("/cadastro/muitos/:filtro", deletarUsuarios)
usuarioRouter.get("/sessoes", verSessoes )


//PARA USO DO PROJETO

usuarioRouter.post("/cadastro", schemaValido(cadastroSchema),cadastarUsuario)
usuarioRouter.post("/", schemaValido(loginSchema),fazerLogin)
usuarioRouter.use(authValidar)
usuarioRouter.delete("/sair", deslogarUsuario)



export default usuarioRouter
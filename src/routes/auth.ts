import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function authRoutes(fastify: FastifyInstance) {
    // Essa rota verifiqua se o JWT é verificado se sim retorna as informaçoes do usuário em questão se não vai dar algum erro.
    fastify.get(
        '/me',
        {
            onRequest: [authenticate]
        },  
        (request) => {
            return {
                user: request.user,
            }
        }
    );

    /*
        Essa rota recebe um access_token e faz uma chamada para a api do OAuth na rota de userInfo passando o metodo GET e no cabeçalho da chamada passando o access_token
        atravez do Bearer e tudo der certo isso vai nos retornar uma Promise pegamos então essa Promise e a convertemos em JSON. Logo após a verificação de autenticação
        vamos verificar se o cliente existe no Banco de Dados, se o cliente não existir pegue o valor do retorno da busca pelo cliente e crie um cliente se o cliente existir
        gere um token JWT passando o nome e imagem de perfil como payload de JWT e como segundo parametro informe quem gerou o token e o tempo para expiração e retorne
        o tokenJWT para o cliente.
    */
    fastify.post("/user", async (request, reply) => {
        const userBodyType = z.object({
            access_token: z.string(),
        });

        const {access_token} =  userBodyType.parse(request.body);

        const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })

        const userData = await userResponse.json();

        const userInfoSchema = z.object({
            id: z.string(),
            email: z.string().email(),
            name: z.string(),
            picture: z.string().url(),
        });

        const userInfo = userInfoSchema.parse(userData);

        let user = await prisma.user.findUnique({
            where: {
                googleId: userInfo.id,
            }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    googleId: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    avatarUrl: userInfo.picture,
                }
            })
        }

        const tokenJWT = fastify.jwt.sign({
            name: user.name,
            avatarUrl: user.avatarUrl,
        }, {
            // Quem gerou o token ?
            sub: user.id,
            expiresIn: '7 days',
        });

        return reply.send({tokenJWT});
    });
}
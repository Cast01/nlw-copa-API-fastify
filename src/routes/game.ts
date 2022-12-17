import { FastifyInstance } from "fastify";
import { date, z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify: FastifyInstance) {

    // Essa rota vai receber o id da sala que o cliente entrou pela URL e vai retornar quantos jogos existem dentro desta sala e se o cliente tiver um palpite dentro jogo pegue os dados desse palpite e retorne o primeiro palpite do clente caso ele tenha mais de um.
    fastify.get('/room/:id/games', {
        onRequest: [authenticate]
    }, async (request, reply) => {
        const roomParams = z.object({
            id: z.string(),
        });
        

        const {id} = roomParams.parse(request.params);

        const games = await prisma.game.findMany({
            orderBy: {
                date: 'desc',
            },
            include: {
                Guess: {
                    where: {
                        participants: {
                            userId: request.user.sub,
                            roomId: id,
                        }
                    }
                }
            }
        });

        return {
            games: games.map(game => {
                return {
                    ...game,
                    Guess: game.Guess.length > 0 ? game.Guess[0] : null,
                }
            })
        }
    });
}
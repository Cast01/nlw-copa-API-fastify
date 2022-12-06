import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify: FastifyInstance) {
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
                    guess: game.Guess.length > 0 ? game.Guess[0] : null,
                    Guess: undefined,
                }
            })
        }
    });
}
import { FastifyInstance } from "fastify";
import { string, z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
    fastify.get('/guess/quantity', async (request, reply) => {
        const guessQuantity = await prisma.guess.count();

        return reply.status(201).send({guessQuantity});
    });

    fastify.post('/room/:roomId/games/:gameId/guesses', {
        onRequest: [authenticate],
    }, async (request, reply) => {
        const createGuessParams = z.object({
            roomId: z.string(),
            gameId: z.string(),
        });

        const createGuessBody = z.object({
            firstTeamPoints: z.number(),
            secondTeamPoints: z.number(),
        });

        const {gameId, roomId} = createGuessParams.parse(request.params);
        const {firstTeamPoints, secondTeamPoints} = createGuessBody.parse(request.body);

        const participant = await prisma.participant.findUnique({
            where: {
                userId_roomId: {
                    roomId,
                    userId: request.user.sub,
                }
            }
        });

        if (!participant) {
            return reply.status(400).send("You're not allowed to create a guess inside this room.");
        }

        // Verifica se dentro do jogo que tem o id = request.params.gameId tem um participante que tem o mesmo id que o usuario que esta acessando
        // se sim retorne suas informações se não retorne qqr valor que se false.
        const guess = await prisma.guess.findUnique({
            where: {
                participantId_gameId: {
                    gameId,
                    participantId: participant.id,
                }
            }
        });

        // Se 
        if (guess) {
            return reply.status(400).send({
                message: "You already sont a guess to this game on this room."
            });
        }

        const game = await prisma.game.findUnique({
            where: {
                id: gameId,
            }
        });

        if (!game) {
            return reply.status(400).send({
                message: "Game not found."
            });
        }

        if (game.date < new Date()) {
            return reply.status(400).send({
                message: "You cannot send the guess after de game over."
            });
        }

        await prisma.guess.create({
            data: {
                gameId,
                participantId: participant.id,
                firstTeamPoints,
                secondTeamPoints,
            }
        });

        return reply.status(200).send({
            message: "Guess successefuly created!"
        });
    });
}
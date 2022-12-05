import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function guessRoutes(fastify: FastifyInstance) {
    fastify.get('/guess/quantity', async (request, reply) => {
        try {
            const guessQuantity = await prisma.guess.count();
    
            return reply.status(201).send({guessQuantity});
        } catch (error) {
            return error
        }
    });
}
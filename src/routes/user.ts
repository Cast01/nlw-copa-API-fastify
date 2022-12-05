import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function userRoutes(fastify: FastifyInstance) {
    fastify.get('/user/quantity', async (request, reply) => {
        try {
            const userQuantity = await prisma.user.count();
    
            return reply.status(200).send({userQuantity});
        } catch (error) {
            return error
        }
    });
    
    fastify.get('/my-rooms/:userId', async (request, reply) => {
        const userIdParams = z.object({
            userId: z.string(),
        });
    
        const {userId} = userIdParams.parse(request.params);
        
        const userRooms = await prisma.room.findMany({
            where: {
                owner: {
                    id: userId
                }
            }
        });
    
        reply.send(userRooms);
    });
}
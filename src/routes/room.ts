import { FastifyInstance } from "fastify";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";
import { gameRoutes } from "./game";

export async function roomRoutes(fastify: FastifyInstance) {

    // Criar uma sala
    fastify.post('/room', {
        onRequest: authenticate,
    }, async (request, reply) => {
        const createRoomBody = z.object({
            title: z.string(),
        });

        const { title } = createRoomBody.parse(request.body);

        const generateRandomCode = new ShortUniqueId({ length: 6 });
        const code = String(generateRandomCode()).toUpperCase();

        const roomCreated = await prisma.room.create({
            data: {
                title,
                code,
                ownerId: request.user.sub,

                Participant: {
                    create: {
                        userId: request.user.sub,
                    }
                }, 
            }
        })

        if (!roomCreated) {
            return reply.status(400).send({
                message: "Unexpected ERROR",
            });
        }

        return reply.status(201).send({ title, code, roomCreatedId: roomCreated.id});
    });

    fastify.get('/room/quantity', async () => {
        const roomQuantity = await prisma.room.count();

        return {
            roomQuantity
        }
    });

    // Participar de uma sala.
    fastify.post('/room/join', {
        onRequest: [authenticate]
    }, async (request, reply) => {
        const enterInRoomBody = z.object({
            code: z.string(),
        });

        const { code } = enterInRoomBody.parse(request.body);

        // Me traga a primeira sala que tem esse código e lá de dentro me traga o participante que tem esse id(request.user.sub).
        const room = await prisma.room.findFirst({
            where: {
                code,
            },
            include: {
                Participant: {
                    where: {
                        userId: request.user.sub,
                    }
                }
            }
        });

        // Se essa sala não existir retorne uma mensagem de error pro front-end pegar.
        if (!room) {
            return reply.status(400).send({
                message: "Nenhuma sala corresponde ao código."
            });
        }

        // Se existir um participante 
        if (room) {
            if (room.Participant.length > 0) {
                return reply.status(400).send({
                    message: "Você já participa desta sala."
                });
            }
        }

        if (!room.ownerId) {
            await prisma.room.update({
                where: {
                    id: room.id,
                },
                data: {
                    ownerId: request.user.sub
                }
            });
        }

        await prisma.participant.create({
            data: {
                roomId: room.id,
                userId: request.user.sub,
            }
        });

        return reply.code(200).send({
            roomId: room.id,
            message: "User successfuly created!",
        });
    });

    // Listar todas as salas que o cliente está participando.
    fastify.get('/room', {
        onRequest: [authenticate],
    }, async (request, reply) => {
        const participatingRooms = await prisma.room.findMany({
            // Onde
            where: {
                // Dentro da lista de participantes
                Participant: {
                    //Pelo menos
                    some: {
                        userId: request.user.sub,
                    }
                }
            },
            include: {
                _count: {
                    select: {
                        Participant: true,
                    }
                },
                Participant: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        },
                    },
                    take: 4,
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        return reply.code(200).send(participatingRooms);
    })

    // Entrar na sala pelo ID
    fastify.get('/room/:id', {
        onRequest: [authenticate],
    }, async (request, reply) => {
        const roomParams = z.object({
            id: z.string(),
        });

        const { id } = roomParams.parse(request.params);

        const insideRoom = await prisma.room.findFirst({
            // Onde
            where: {
                // id seja o id que foi passado pelo parametro
                id
            },
            include: {
                _count: {
                    select: {
                        Participant: true,
                    }
                },
                Participant: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        },
                    },
                    take: 4,
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        return {insideRoom};
    });
}
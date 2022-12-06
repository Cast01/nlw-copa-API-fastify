import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

async function main() {

    const user = await prisma.user.create({
        data: {
            name: "OUTRO5",
            email: "OUTRO5@teste.com",
            avatarUrl: "http://github.com/diego3g.png",
        }
    });

    const room = await prisma.room.create({
        data: {
            title: "Sala teste 5",
            code: "POL555",
            ownerId: user.id,

            Participant: {
                create: {
                    userId: user.id,
                }
            }
        }
    });

    await prisma.game.create({
        data: {
            date: "2022-12-25T12:33:56.786Z",
            firstTeamCountryCode: "UK",
            secondTeamCountryCode: "BR",

            Guess: {
                create: {
                    firstTeamPoints: 4,
                    secondTeamPoints: 4,

                    participants: {
                        connect: {
                            userId_roomId: {
                                userId: user.id,
                                roomId: room.id,
                            }
                        }
                    }
                }
            }
        }
    });

    await prisma.game.create({
        data: {
            date: "2022-11-23T18:33:56.786Z",
            firstTeamCountryCode: "FR",
            secondTeamCountryCode: "US",

            Guess: {
                create: {
                    firstTeamPoints: 0,
                    secondTeamPoints: 0,

                    participants: {
                        connect: {
                            userId_roomId: {
                                userId: user.id,
                                roomId: room.id,
                            }
                        }
                    }
                }
            }
        }
    });

}

main();
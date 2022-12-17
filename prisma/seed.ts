import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

async function main() {

    const user = await prisma.user.create({
        data: {
            name: "TESTE1",
            email: "TESTE1@teste.com",
            avatarUrl: "http://github.com/diego3g.png",
        }
    });

    const room = await prisma.room.create({
        data: {
            title: "Sala teste 1",
            code: "POL111",
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
            date: "2022-12-11T17:33:56.786Z",
            firstTeamCountryCode: "FR",
            secondTeamCountryCode: "LI",

            Guess: {
                create: {
                    firstTeamPoints: 1,
                    secondTeamPoints: 1,

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
            date: "2022-12-12T12:33:56.786Z",
            firstTeamCountryCode: "FR",
            secondTeamCountryCode: "BR",

            Guess: {
                create: {
                    firstTeamPoints: 1,
                    secondTeamPoints: 1,

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
            date: "2022-12-13T12:33:56.786Z",
            firstTeamCountryCode: "IT",
            secondTeamCountryCode: "GE",
        }
    });
    await prisma.game.create({
        data: {
            date: "2022-12-28T12:33:56.786Z",
            firstTeamCountryCode: "MT",
            secondTeamCountryCode: "US",

            Guess: {
                create: {
                    firstTeamPoints: 1,
                    secondTeamPoints: 1,

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
            date: "2022-12-23T12:33:56.786Z",
            firstTeamCountryCode: "KE",
            secondTeamCountryCode: "RU",

            Guess: {
                create: {
                    firstTeamPoints: 1,
                    secondTeamPoints: 1,

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
            date: "2022-12-23T12:33:56.786Z",
            firstTeamCountryCode: "TY",
            secondTeamCountryCode: "OO",
        }
    });

}

main();
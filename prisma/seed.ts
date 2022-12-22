import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

const hour = new Date().getHours() + 3;
const minute = new Date().getMinutes();

async function main() {

    const user = await prisma.user.create({
        data: {
            name: "TESTE4",
            email: "TESTE4@teste.com",
            avatarUrl: "http://github.com/diego3g.png",
        }
    });

    const room = await prisma.room.create({
        data: {
            title: "Sala teste 4",
            code: "POL444",
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
            date: `2022-12-21T20:35:52.786Z`,
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
            date: `2022-12-20T20:38:52.786Z`,
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
            date: `2022-12-21T20:40:52.786Z`,
            firstTeamCountryCode: "IT",
            secondTeamCountryCode: "GE",
        }
    });
    await prisma.game.create({
        data: {
            date: `2022-12-21T20:42:52.786Z`,
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
            date: `2022-12-21T20:44:52.786Z`,
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
            date: `2022-12-21T20:46:52.786Z`,
            firstTeamCountryCode: "IR",
            secondTeamCountryCode: "JP",
        }
    });
    await prisma.game.create({
        data: {
            date: `2022-12-21T20:48:52.786Z`,
            firstTeamCountryCode: "BR",
            secondTeamCountryCode: "JP",
        }
    });
    await prisma.game.create({
        data: {
            date: `2022-12-21T20:50:52.786Z`,
            firstTeamCountryCode: "IR",
            secondTeamCountryCode: "GE",
        }
    });
    await prisma.game.create({
        data: {
            date: `2022-12-21T20:52:52.786Z`,
            firstTeamCountryCode: "IT",
            secondTeamCountryCode: "RU",
        }
    });

}

main();
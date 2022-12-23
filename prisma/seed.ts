import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

const hour = new Date().getHours() + 3;
const minute = new Date().getMinutes();

async function main() {

    await prisma.game.create({
        data: {
            date: `2022-12-23T01:54:52.786Z`,
            firstTeamCountryCode: "FR",
            secondTeamCountryCode: "LI",
        }
    });
    await prisma.game.create({
        data: {
            date: `2022-12-23T01:56:52.786Z`,
            firstTeamCountryCode: "FR",
            secondTeamCountryCode: "BR",
        }
    });
    await prisma.game.create({
        data: {
            date: `2022-12-23T00:55:52.786Z`,
            firstTeamCountryCode: "IT",
            secondTeamCountryCode: "GE",
        }
    });
    await prisma.game.create({
        data: {
            date: `2022-12-23T00:57:52.786Z`,
            firstTeamCountryCode: "MT",
            secondTeamCountryCode: "US",
        }
    });
    await prisma.game.create({
        data: {
            date: `2022-12-21T20:44:52.786Z`,
            firstTeamCountryCode: "KE",
            secondTeamCountryCode: "RU",
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
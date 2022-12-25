import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

import { roomRoutes } from './routes/room';
import { userRoutes } from './routes/user';
import { guessRoutes } from './routes/guess';
import { authRoutes } from './routes/auth';
import { gameRoutes } from './routes/game';

async function api() {
    const fastify = Fastify({
        logger: true,
    });
    await fastify.register(cors, { 
        origin: true,
    })

    await fastify.register(jwt, {
        secret: 'nlwCopa'
    });

    // Rotas que envolvem a sala
    // ===============================
    await fastify.register(roomRoutes);

    // Rotas que envolvem o usuario
    // ===============================
    await fastify.register(userRoutes);
    
    // Rotas que envolvem o palpite
    // ===============================
    await fastify.register(guessRoutes);

    // Rotas que envolvem o palpite
    // ===============================
    await fastify.register(authRoutes);

    // Rotas que envolvem o palpite
    // ===============================
    await fastify.register(gameRoutes);
    
    

    await fastify.listen({port: 3333});
}

api();
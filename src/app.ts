import fastifySession, { MemoryStore } from '@mgcrea/fastify-session';
import { RedisStore } from '@mgcrea/fastify-session-redis-store';
import createFastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyPassport from 'fastify-passport';
import Redis from 'ioredis';
import { IS_PROD, IS_TEST, REDIS_URI, SESSION_KEY, SESSION_TTL } from './config/env';
import { LocalStrategy } from './config/passport/LocalStrategy';
import { baseRoutes, usersRoutes, sessionsRoutes } from './routes';

export const buildFastify = (options?: FastifyServerOptions): FastifyInstance => {
  const fastify = createFastify(options);
  // Use cookies
  fastify.register(fastifyCookie);
  // Configure session
  fastify.register(fastifySession, {
    store: IS_TEST ? new MemoryStore() : new RedisStore({ client: new Redis(REDIS_URI), ttl: SESSION_TTL }),
    key: SESSION_KEY,
    cookie: { secure: IS_PROD ? true : false, maxAge: SESSION_TTL },
  });
  // Initialize passport
  fastify.register(fastifyPassport.initialize());
  // Add support for sessions
  fastify.register(fastifyPassport.secureSession());
  // Add auth strategies
  fastifyPassport.use(new LocalStrategy());

  fastify.register(baseRoutes);
  fastify.register(sessionsRoutes);
  fastify.register(usersRoutes);

  return fastify;
};

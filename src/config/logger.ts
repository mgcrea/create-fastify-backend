/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { FastifyLoggerOptions } from 'fastify';

export const logger: FastifyLoggerOptions = {
  prettyPrint: {
    colorize: true,
    ignore: 'pid,hostname',
  },
  serializers: {
    req(request) {
      return {
        method: request.method,
        url: request.url,
        remoteAddress: request.socket.remoteAddress,
        remotePort: request.socket.remotePort,
        // Including the headers in the log could be in violation
        // of privacy laws, e.g. GDPR. You should use the "redact" option to
        // remove sensitive fields. It could also leak authentication data in
        // the logs.
        headers: request.headers,
      };
    },
  },
};

// const serializers = {
//   req: function asReqValue (req) {
//     return {
//       method: req.method,
//       url: req.url,
//       version: req.headers['accept-version'],
//       hostname: req.hostname,
//       remoteAddress: req.ip,
//       remotePort: req.socket.remotePort
//     }
//   },
//   err: pino.stdSerializers.err,
//   res: function asResValue (reply) {
//     return {
//       statusCode: reply.statusCode
//     }
//   }
// }
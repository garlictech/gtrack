// eslint:disable-next-line:no-var-requires
import * as sms from 'source-map-support';
sms.install();
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Context, Handler } from 'aws-lambda';
import * as serverless from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import * as express from 'express';
import { Server } from 'http';
import { AppModule } from './app/modules/app.module';

let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  return NestFactory.create(AppModule, adapter)
    .then(app => app.use(eventContext()))
    .then(app => app.setGlobalPrefix('v1'))
    .then(app => {
      app.enableCors();
      return app.init();
    })
    .then(() => serverless.createServer(expressApp));
}

export const handler: Handler = (event: any, context: Context): any => {
  if (!cachedServer) {
    Logger.log('Starting server');
    bootstrapServer().then(server => {
      Logger.log('Bootstraping server');
      cachedServer = server;
      return serverless.proxy(server, event, context);
    });
  } else {
    return serverless.proxy(cachedServer, event, context);
  }
};

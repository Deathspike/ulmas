import * as app from '.';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import {NestFactory} from '@nestjs/core';
import {WsAdapter} from '@nestjs/platform-ws';
import compression from 'compression';
import express from 'express';
import path from 'path';
const packageData = require('../../package');

export class Server {
  private constructor(private readonly server: nst.INestApplication) {}

  static async createAsync() {
    const options = {cors: true};
    const server = await NestFactory.create(app.ServerModule, options);
    return new Server(server);
  }

  async runAsync() {
    this.attachMiddleware();
    this.attachOptions();
    this.attachSwagger();
    await this.server.listen(process.env.PORT || 6877).catch(() => {});
  }

  private attachMiddleware() {
    const publicPath = path.join(__dirname, '../../public');
    this.server.use(compression());
    this.server.use(express.static(publicPath));
  }

  private attachOptions() {
    const options = {transform: true, whitelist: true};
    this.server.useGlobalPipes(new nst.ValidationPipe(options));
    this.server.useWebSocketAdapter(new WsAdapter(this.server));
  }

  private attachSwagger() {
    const options = getDocumentBuilder().build();
    const document = swg.SwaggerModule.createDocument(this.server, options);
    swg.SwaggerModule.setup('api', this.server, document);
  }
}

function getDocumentBuilder() {
  return new swg.DocumentBuilder()
    .setDescription(packageData.description)
    .setTitle(packageData.name)
    .setVersion(packageData.version);
}

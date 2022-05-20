import * as app from '.';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import {NestFactory} from '@nestjs/core';
import compression from 'compression';
import express from 'express';
import path from 'path';

export class Server {
  private constructor(
    private readonly server: nst.INestApplication) {}

  static async createAsync() {
    const options = {cors: true};
    const server = await NestFactory.create(app.ServerModule, options);
    return new Server(server);
  }

  async runAsync() {
    this.attachMiddleware();
    this.attachRequestValidation();
    this.attachSwagger();
    await this.server.listen(process.env.PORT || 6877);
  }
  
  private attachMiddleware() {
    const publicPath = path.join(__dirname, '../../public');
    this.server.use(compression());
    this.server.use(express.static(publicPath));
  }

  private attachRequestValidation() {
    const options = {forbidNonWhitelisted: true, forbidUnknownValues: true, transform: true};
    this.server.useGlobalPipes(new nst.ValidationPipe(options));
  }

  private attachSwagger() {
    const documentBuilder = getDocumentBuilder();
    const document = swg.SwaggerModule.createDocument(this.server, documentBuilder.build());
    swg.SwaggerModule.setup('api', this.server, document);
  }
}

function getDocumentBuilder() {
  return new swg.DocumentBuilder()
    .setDescription(app.settings.app.description)
    .setTitle(app.settings.app.name)
    .setVersion(app.settings.app.version);
}

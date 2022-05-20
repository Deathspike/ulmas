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
    const packageData = require('../../package');
    const builder = new swg.DocumentBuilder().setDescription(packageData.description).setTitle(packageData.name).setVersion(packageData.version);
    swg.SwaggerModule.setup('api', this.server, swg.SwaggerModule.createDocument(this.server, builder.build()));
  }
}

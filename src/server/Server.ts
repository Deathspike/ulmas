import * as app from '.';
import * as nst from '../nest';
import express from 'express';

export class Server {
  private constructor(
    private readonly server: nst.INestApplication) {}

  static async createAsync() {
    const options = {cors: true};
    const server = await nst.NestFactory.create(app.ServerModule, options);
    return new Server(server);
  }

  async runAsync() {
    this.attachRequestValidation();
    this.attachStaticFiles();
    this.attachSwagger();
    await this.server.listen(process.env.PORT || 6877);
  }
  
  private attachRequestValidation() {
    const options = {forbidNonWhitelisted: true, forbidUnknownValues: true, transform: true};
    this.server.useGlobalPipes(new nst.ValidationPipe(options));
  }

  private attachStaticFiles() {
    this.server.use(express.static('public'));
  }

  private attachSwagger() {
    const packageData = require('../../package');
    const builder = new nst.DocumentBuilder().setDescription(packageData.description).setTitle(packageData.name).setVersion(packageData.version);
    nst.SwaggerModule.setup('api', this.server, nst.SwaggerModule.createDocument(this.server, builder.build()));
  }
}

import * as nst from '@nestjs/common';
import express from 'express';
import ipaddr from 'ipaddr.js';

@nst.Injectable()
export class LocalRequestFilter implements nst.CanActivate {
  canActivate(context: nst.ExecutionContext) {
    const request = context.switchToHttp().getRequest() as express.Request;
    const ip = ipaddr.parse(request.ip);
    return ip.range() === 'loopback';
  }
}

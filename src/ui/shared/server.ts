import * as app from '.';

export const server = new app.api.Server(`${window.location.protocol}//${window.location.hostname}:6877/`);

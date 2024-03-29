import * as app from '.';

export const core = {
  api: new app.ApiService(),
  event: new app.EventService(),
  image: new app.ImageService(),
  input: new app.InputService(),
  scan: new app.ScanService(),
  screen: new app.ScreenService(),
  state: new app.StateService()
};

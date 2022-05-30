import * as app from '.';
let api: app.ApiService;
let image: app.ImageService;
let route: app.RouteService;

export const core = {
  get api() {
    api ??= new app.ApiService();
    return api;
  },

  get image() {
    image ??= new app.ImageService();
    return image;
  },

  get route() {
    route ??= new app.RouteService();
    return route;
  }
};

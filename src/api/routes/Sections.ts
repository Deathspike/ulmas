import * as api from '..';

export class Sections {
  constructor(
    readonly baseUrl: URL) {}

  async readAsync() {
    const url = new URL(`/api/sections`, this.baseUrl);
    const request = new api.ServerRequest(url);
    return await request.arrayAsync(api.models.Section);
  }
  
  async createAsync(model: api.models.SectionCreate) {
    const url = new URL(`/api/sections`, this.baseUrl);
    const request = api.ServerRequest.withJson(url, model, {method: 'POST'});
    return await request.emptyAsync();
  }

  async deleteAsync(sectionId: string) {
    const url = new URL(`/api/sections/${sectionId}`, this.baseUrl);
    const request = new api.ServerRequest(url, {method: 'DELETE'});
    return await request.emptyAsync();
  }
  
  async updateAsync(sectionId: string, model: api.models.SectionUpdate) {
    const url = new URL(`/api/sections/${sectionId}`, this.baseUrl);
    const request = api.ServerRequest.withJson(url, model, {method: 'PUT'});
    return await request.emptyAsync();
  }
}

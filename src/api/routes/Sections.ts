import * as api from '..';

export class Sections {
  constructor(private readonly baseUrl: URL) {}

  async readAsync() {
    const url = new URL(`/api/sections`, this.baseUrl);
    const request = new api.ServerRequest(url);
    return await request.arrayAsync(api.models.Section);
  }

  async createAsync(model: api.models.SectionCreate) {
    const url = new URL(`/api/sections`, this.baseUrl);
    const options = {method: 'POST'};
    const request = api.ServerRequest.withJson(url, model, options);
    return await request.emptyAsync();
  }

  async deleteAsync(sectionId: string) {
    const url = new URL(`/api/sections/${sectionId}`, this.baseUrl);
    const options = {method: 'DELETE'};
    const request = new api.ServerRequest(url, options);
    return await request.emptyAsync();
  }

  async updateAsync(sectionId: string, model: api.models.SectionUpdate) {
    const url = new URL(`/api/sections/${sectionId}`, this.baseUrl);
    const options = {method: 'PUT'};
    const request = api.ServerRequest.withJson(url, model, options);
    return await request.emptyAsync();
  }
}

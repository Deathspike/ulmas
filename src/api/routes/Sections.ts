import * as api from '..';

export class Sections {
  constructor(
    private readonly baseUrl: string) {}

  async readAsync() {
    const url = this.baseUrl;
    return await api.ServerResponse.jsonAsync<Array<api.models.Section>>(url);
  }
  
  async createAsync(model: api.models.SectionPart) {
    const body = JSON.stringify(model);
    const headers = {'Content-Type': 'application/json'};
    const method = 'POST';
    return await api.ServerResponse.emptyAsync(this.baseUrl, {body, method, headers});
  }

  async deleteAsync(sectionId: string) {
    const method = 'DELETE';
    const url = new URL(`${sectionId}`, this.baseUrl).toString();
    return await api.ServerResponse.emptyAsync(url, {method});
  }
  
  async updateAsync(sectionId: string, model: api.models.SectionPart) {
    const body = JSON.stringify(model);
    const headers = {'Content-Type': 'application/json'};
    const method = 'PUT';
    const url = new URL(`${sectionId}`, this.baseUrl).toString();
    return await api.ServerResponse.emptyAsync(url, {body, method, headers});
  }
}

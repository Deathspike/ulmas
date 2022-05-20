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

  async deleteAsync(params: api.params.Section) {
    const method = 'DELETE';
    const url = new URL(`${params.sectionId}`, this.baseUrl).toString();
    return await api.ServerResponse.emptyAsync(url, {method});
  }
  
  async updateAsync(params: api.params.Section, model: api.models.SectionPart) {
    const body = JSON.stringify(model);
    const headers = {'Content-Type': 'application/json'};
    const method = 'PUT';
    const url = new URL(`${params.sectionId}`, this.baseUrl).toString();
    return await api.ServerResponse.emptyAsync(url, {body, method, headers});
  }
}

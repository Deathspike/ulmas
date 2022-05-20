import * as app from '..';
import * as mod from '.';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';

@nst.Controller('api/sections')
@swg.ApiTags('sections')
export class Router {
  constructor(
    private readonly sectionsService: mod.Service) {}

  @app.Validator([app.api.models.Section])
  @nst.Get()
  @swg.ApiResponse({status: 200, type: [app.api.models.Section]})
  async readAsync() {
    return await this.sectionsService.readAsync();
  }

  @nst.Post()
  @swg.ApiResponse({status: 201})
  async createAsync(
    @nst.Body() model: app.api.models.SectionPart) {
    const id = Date.now().toString(16);
    await this.sectionsService.createAsync(new app.api.models.Section({...model, id}));
  }

  @nst.Delete(':sectionId')
  @nst.HttpCode(204)
  @swg.ApiResponse({status: 204})
  @swg.ApiResponse({status: 404})
  async deleteAsync(
    @nst.Param() params: app.api.params.Section) {
    const sectionList = await this.readAsync();
    const section = sectionList.find(x => x.id === params.sectionId);
    if (!section) throw new nst.NotFoundException();
    await this.sectionsService.deleteAsync(section);
  }
  
  @nst.Put(':sectionId')
  @nst.HttpCode(204)
  @swg.ApiResponse({status: 204})
  @swg.ApiResponse({status: 404})
  async updateAsync(
    @nst.Param() params: app.api.params.Section,
    @nst.Body() model: app.api.models.SectionPart) {
    const sectionList = await this.readAsync();
    const section = sectionList.find(x => x.id === params.sectionId);
    if (!section) throw new nst.NotFoundException();
    app.mergeProperties(model, section);
    await this.sectionsService.updateAsync(section);
  }
}

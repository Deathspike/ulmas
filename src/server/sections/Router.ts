import * as app from '..';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import {Service} from './Service';

@nst.Controller('api/sections')
@swg.ApiTags('sections')
export class Router {
  constructor(
    private readonly sectionsService: Service) {}

  @nst.Get()
  @swg.ApiResponse({status: 200, type: [app.api.models.Section]})
  async readAsync() {
    const sectionList = await this.sectionsService.readAsync();
    return sectionList.map(x => new app.api.models.Section(x));
  }

  @nst.Post()
  @swg.ApiResponse({status: 201})
  async createAsync(
    @nst.Body() model: app.api.bodies.SectionCreate) {
    await this.sectionsService.createAsync(model.paths, model.title, model.type);
  }

  @nst.Delete(':sectionId')
  @nst.HttpCode(204)
  @swg.ApiResponse({status: 204})
  @swg.ApiResponse({status: 404})
  async deleteAsync(
    @nst.Param() params: app.api.params.Section) {
    const sectionList = await this.sectionsService.readAsync();
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
    @nst.Body() model: app.api.bodies.SectionUpdate) {
    const sectionList = await this.sectionsService.readAsync();
    const section = sectionList.find(x => x.id === params.sectionId);
    if (!section) throw new nst.NotFoundException();
    await this.sectionsService.updateAsync(new app.api.models.Section({...section, ...model}));
  }
}

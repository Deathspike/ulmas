import * as app from '..';
import * as mod from '.';
import * as nst from '../../nest';

@nst.Controller('api/sections')
@nst.ApiTags('sections')
export class Router {
  constructor(
    private readonly sectionsService: mod.Service) {}

  @app.Validator([app.api.models.Section])
  @nst.Get()
  @nst.ApiResponse({status: 200, type: [app.api.models.Section]})
  async sectionListAsync() {
    return await this.sectionsService.sectionListAsync();
  }

  @app.Validator(app.api.models.Section)
  @nst.Get(':sectionId')
  @nst.ApiResponse({status: 200, type: app.api.models.Section})
  @nst.ApiResponse({status: 404})
  async sectionDetailAsync(
    @nst.Param() params: app.api.params.Section) {
    const sectionList = await this.sectionListAsync();
    const section = sectionList.find(x => x.id === params.sectionId);
    if (!section) throw new nst.NotFoundException();
    return section;
  }

  @nst.Post()
  @nst.ApiResponse({status: 201})
  @nst.ApiResponse({status: 409})
  async createAsync(
    @nst.Body() model: app.api.models.SectionPart) {
    const id = app.createId(model.title);
    const sectionList = await this.sectionListAsync();
    const section = sectionList.find(x => x.id === id);
    if (section) throw new nst.ConflictException();
    await this.sectionsService.createAsync(new app.api.models.Section({...model, id}));
  }

  @nst.Delete(':sectionId')
  @nst.HttpCode(204)
  @nst.ApiResponse({status: 204})
  @nst.ApiResponse({status: 404})
  async deleteAsync(
    @nst.Param() params: app.api.params.Section) {
    const section = await this.sectionDetailAsync(params);
    await this.sectionsService.deleteAsync(section);
  }
  
  @nst.Put(':sectionId')
  @nst.HttpCode(204)
  @nst.ApiResponse({status: 204})
  @nst.ApiResponse({status: 404})
  async updateAsync(
    @nst.Param() params: app.api.params.Section,
    @nst.Body() model: app.api.models.SectionPart) {
    const section = await this.sectionDetailAsync(params);
    app.mergeProperties(model, section);
    await this.sectionsService.updateAsync(section);
  }
}

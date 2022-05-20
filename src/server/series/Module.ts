import * as app from '..';
import * as mod from '.';
import * as nst from '@nestjs/common';
const logger = new nst.Logger('Series');

@nst.Module({
  imports: [app.core.Module, app.sections.Module],
  controllers: [mod.Router],
  providers: [mod.Service],
  exports: [mod.Service]})
export class Module implements nst.OnModuleInit {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly sectionService: app.sections.Service,
    private readonly seriesService: mod.Service) {}
  
  onModuleInit() {
    this.updateAsync().catch(x => logger.error(x));
  }

  private async updateAsync() {
    const sectionList = await this.sectionService.readAsync();
    for (const section of sectionList.filter(x => x.type === 'series')) await this.updateSectionAsync(section);
    await this.cacheService.pruneAsync('series');
  }

  private async updateSectionAsync(section: app.api.models.Section) {
    const startTime = Date.now();
    await this.seriesService.listAsync(section.paths, true);
    logger.verbose(`Updated ${section.title} in ${Date.now() - startTime}ms`);
  }
}

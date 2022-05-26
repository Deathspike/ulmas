export class EpisodeViewModel {
  constructor(
    readonly id: string,
    readonly plot: string | undefined,
    readonly thumbSrc: string | undefined,
    readonly title: string,
    readonly url: string,
    readonly watched: boolean) {}
}

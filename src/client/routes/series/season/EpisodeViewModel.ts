export class EpisodeViewModel {
  constructor(
    readonly id: string,
    readonly plot: string | undefined,
    readonly thumbSrc: string | undefined,
    readonly title: string,
    readonly watched: boolean | undefined,
    readonly url: string) {}
}

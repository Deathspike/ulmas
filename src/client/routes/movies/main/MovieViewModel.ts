export class MovieViewModel {
  constructor(
    readonly id: string,
    readonly posterUrl: string | undefined,
    readonly title: string) {}
}

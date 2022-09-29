export interface IController {
  get isScanning(): boolean;
  scanAsync(): Promise<void>;
}

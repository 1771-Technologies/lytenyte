export class StreamingReporter {
  constructor() {
    this._onModule = null;
  }
  setOnModule(cb) {
    this._onModule = cb;
  }
  onTestModuleEnd(testModule) {
    this._onModule?.(testModule);
  }
}

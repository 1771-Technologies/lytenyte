export class StreamingReporter {
  constructor() {
    this._onModule = null;
    this._onTestCase = null;
    this._onTestCaseStart = null;
  }
  setOnModule(cb) {
    this._onModule = cb;
  }
  setOnTestCase(cb) {
    this._onTestCase = cb;
  }
  setOnTestCaseStart(cb) {
    this._onTestCaseStart = cb;
  }
  onTestModuleEnd(testModule) {
    this._onModule?.(testModule);
  }
  onTestCaseReady(testCase) {
    this._onTestCaseStart?.(testCase);
  }
  onTestCaseResult(testCase) {
    this._onTestCase?.(testCase);
  }
}

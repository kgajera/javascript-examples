import * as AxeBuilder from 'axe-webdriverjs';
import * as fs from 'fs';
import { ElementFinder, browser, by, element, logging, promise } from 'protractor';

export class UniversalPage {
  /**
   * Key value store that is transferred from the application on
   * the server side to the application on the client side.
   */
  private transferStateStore: Record<string, any>;

  constructor(private url: string) {}

  /**
   * Returns accessibility report
   */
  analyzeAccessibility(): Promise<AxeBuilder.AxeAnalysis> {
    return (AxeBuilder as any)(browser).analyze();
  }

  /**
   * Returns the document title
   */
  getDocumentTitle(): promise.Promise<string> {
    return browser.getTitle();
  }

  /**
   * Returns the text of the `h1` element
   */
  getHeading1Text(): promise.Promise<string> {
    return element(by.tagName('h1')).getText();
  }

  /**
   * Returns browser log entries
   *
   * @param level Return logs equal to this level or greater
   */
  async getLogEntries(level: logging.Level = logging.Level.SEVERE): promise.Promise<logging.Entry[]> {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    return logs.filter(log => log.level.value >= level.value);
  }

  /**
   * Returns the `content` attribute value for a meta tag
   *
   * @param name The `name` attribute value to find the meta tag element
   */
  getMetaContent(name: string): promise.Promise<string> {
    return element(by.css(`meta[name=${name}]`)).getAttribute('content');
  }

  /**
   * Returns the key value store that is transferred from the application on
   * the server side to the application on the client side.
   */
  getTransferStateStore(): Record<string, any> {
    return this.transferStateStore;
  }

  /**
   * Returns a transfer state value by key
   *
   * @param key A key or partial key to access the value
   */
  getTransferStateStoreValue(key: string): any | null {
    if (!this.transferStateStore) {
      return null;
    }
    if (this.transferStateStore[key]) {
      return this.transferStateStore[key];
    }
    // Attempt to find a partial key match
    for (const k in this.transferStateStore) {
      if (k.includes(key)) {
        return this.transferStateStore[k];
      }
    }
    return null;
  }

  /**
   * Navigate to the url this page was constructed with
   */
  async navigate(): Promise<void> {
    await browser.get(this.url);
    await this.setTransferStateStore();
  }

  /**
   * Returns the screenshot file path
   *
   * @param filename Name of file without extension
   */
  async saveScreenshot(filename: string): Promise<string> {
    const directory = 'coverage/e2e_screenshots';
    const filePath = `${directory}/${filename}.png`;

    // Screenshot as a base-64 encoded PNG
    const screenshot = await browser.takeScreenshot();

    // Create directory if it does not exit
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Save file
    const stream = fs.createWriteStream(filePath);
    stream.write(Buffer.from(screenshot, 'base64'));
    stream.end();

    return filePath;
  }

  /**
   * Find the script element containing the transfer state key value store and
   * parse into a JSON object
   */
  private async setTransferStateStore(): Promise<void> {
    // This id uses the "serverApp" prefix because it is specified in app.module.ts
    const cacheScript: ElementFinder = await element(by.id('serverApp-state'));
    const rawValue: string = await cacheScript.getAttribute('textContent');
    this.transferStateStore = JSON.parse(unescapeHtml(rawValue));
  }

}

/**
 * Unescape the transfer state store so it can be parsed into JSON
 *
 * Copied from https://github.com/angular/angular/blob/master/packages/platform-browser/src/browser/transfer_state.ts#L23
 */
function unescapeHtml(text: string): string {
  const unescapedText: {[k: string]: string} = {
    '&a;': '&',
    '&q;': '"',
    '&s;': '\'',
    '&l;': '<',
    '&g;': '>',
  };
  return text.replace(/&[^;]+;/g, s => unescapedText[s]);
}

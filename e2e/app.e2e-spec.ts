import { AstrolivePage } from './app.po';

describe('astrolive App', () => {
  let page: AstrolivePage;

  beforeEach(() => {
    page = new AstrolivePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

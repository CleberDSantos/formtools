import { FormtoolsPage } from './app.po';

describe('formtools App', () => {
  let page: FormtoolsPage;

  beforeEach(() => {
    page = new FormtoolsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

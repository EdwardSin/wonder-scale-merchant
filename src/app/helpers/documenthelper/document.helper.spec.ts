
import { TestBed } from '@angular/core/testing';
import { DocumentHelper } from './document.helper';


describe('ItemcontrollerComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
  });

  it('will get title', () => {
    DocumentHelper.setUnreadNumber(5);;
    DocumentHelper.setTitle('Home - Wonder Scale');
    let result = '(5) Home - Wonder Scale';
    let title = DocumentHelper.getTitle();

    expect(result).toEqual(title);
  })
});

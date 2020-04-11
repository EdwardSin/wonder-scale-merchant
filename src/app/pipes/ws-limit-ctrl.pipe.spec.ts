import { WsLimitCtrlPipe } from './ws-limit-ctrl.pipe';

describe('LimitCtrlPipe', () => {
  let pipe: WsLimitCtrlPipe;
  beforeEach(() => {
    pipe = new WsLimitCtrlPipe();
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('get number array elements', () => {
    let elements = pipe.getElements([1, 2, 3, 4, 5, 6, 7, 8], 3);
    expect(elements).toEqual([1, 2, 3]);
  });

  it('get substring', () => {
    let elements = pipe.getChars("My name is", 4);
    expect(elements).toEqual("My n...");
  });
});

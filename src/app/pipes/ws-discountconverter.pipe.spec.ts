import { WsDiscountconverterPipe } from './ws-discountconverter.pipe';

describe('DiscountconverterPipe', () => {
  it('create an instance', () => {
    const pipe = new WsDiscountconverterPipe();
    expect(pipe).toBeTruthy();
  });

  it('convert discount', () => {
    const pipe = new WsDiscountconverterPipe();
    const discount = pipe.transform(100, 20);
    expect(discount).toEqual('80.00');
  });

  it('discount value more than 0', () => {
    const pipe = new WsDiscountconverterPipe();
    const discount = pipe.transform(-100, 20);
    expect(discount).toEqual('-100.00');
  });
});

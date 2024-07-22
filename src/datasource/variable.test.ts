import { VariableSupport } from './variable';

/**
 * Variable Support
 */
describe('VariableSupport', () => {
  const variableSupport = new VariableSupport({} as any);

  /**
   * Type
   */
  describe('GetType', () => {
    it('Should return correct type', async () => {
      const type = variableSupport.getType();
      expect(type).toEqual('custom');
    });
  });
});

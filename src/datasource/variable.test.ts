import { VariableSupport } from './variable';

/**
 * Variable Support
 */
describe('VariableSupport', () => {
  const variableSupport = new VariableSupport();

  /**
   * Query
   */
  describe('GetType', () => {
    it('Should return correct type', async () => {
      const type = variableSupport.getType();
      expect(type).toEqual('datasource');
    });
  });
});

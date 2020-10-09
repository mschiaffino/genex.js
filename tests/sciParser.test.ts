import { SciParser } from '../source';
import { Sci } from '../source/sci';

type TestParams = {
  sci: string;
  isValid: boolean;
  expectedErrorMessage: string;
};

describe('SciParser', () => {
  const testParams: TestParams[] = [
    /**
     * Valid SCIs
     */
    { sci: 'A', isValid: true, expectedErrorMessage: null },
    { sci: 'A.B', isValid: true, expectedErrorMessage: null },
    { sci: 'A.B.C', isValid: true, expectedErrorMessage: null },
    { sci: 'A.(B).C', isValid: true, expectedErrorMessage: null },
    { sci: 'A.(B.C)', isValid: true, expectedErrorMessage: null },
    { sci: 'A.(B|C)', isValid: true, expectedErrorMessage: null },
    { sci: 'A*.(B|C)+', isValid: true, expectedErrorMessage: null },
    { sci: 'A*.(B|C|D)+.O', isValid: true, expectedErrorMessage: null },
    { sci: 'A*.(B|C|D)+.O.(Z.Y)*', isValid: true, expectedErrorMessage: null },
    /**
     * Invalid SCIs
     */
    { sci: 'A(', isValid: false, expectedErrorMessage: 'Invalid regular expression: /A(/: Unterminated group' },
  ];

  for (let tp of testParams) {
    describe(`SCI: ${tp.sci}`, () => {
      it(`SciParser.isValid('${tp.sci}') should return ${tp.isValid}`, () => {
        expect(SciParser.isValid(tp.sci)).toBe(tp.isValid);
      });

      it(`SciParser.syntaxErrorMessage('${tp.sci}') should return ${
        tp.isValid ? 'null' : `${tp.expectedErrorMessage}`
      }`, () => {
        expect(SciParser.syntaxErrorMessage(tp.sci)).toEqual(tp.expectedErrorMessage);
      });

      it(`SciParser.parse('${tp.sci}') should return ${tp.isValid ? 'a Sci instance' : 'null'}`, () => {
        const parseResult = SciParser.parse(tp.sci);
        if (tp.isValid) {
          expect(parseResult).toBeInstanceOf(Sci);
        } else {
          expect(parseResult).toBeNull();
        }
      });
    });
  }
});

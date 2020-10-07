import SciParser from '../source';

type TestParams = {
  sci: string;
  validCoverageN: number | null;
  invalidCoverageN: number | null;
  symbols: string[];
  validSequences: string[];
  invalidSequences: string[];
};

describe('sci parser', () => {
  const testParams: TestParams[] = [
    {
      sci: 'O.C',
      validCoverageN: null,
      invalidCoverageN: 2,
      symbols: ['O', 'C'],
      validSequences: ['O.C'],
      invalidSequences: ['O', 'O.O', 'C', 'C.O', 'C.C'],
    },
    {
      sci: 'S|M',
      validCoverageN: null,
      invalidCoverageN: 1,
      symbols: ['S', 'M'],
      validSequences: ['S', 'M'],
      invalidSequences: [],
    },
    {
      sci: 'O.(S|M).C',
      validCoverageN: null,
      invalidCoverageN: 2,
      symbols: ['O', 'S', 'M', 'C'],
      validSequences: ['O.S.C', 'O.M.C'],
      invalidSequences: [
        'O',
        'O.O',
        'O.S',
        'O.M',
        'O.C',
        'S',
        'S.O',
        'S.S',
        'S.M',
        'S.C',
        'M',
        'M.O',
        'M.S',
        'M.M',
        'M.C',
        'C',
        'C.O',
        'C.S',
        'C.M',
        'C.C',
      ],
    },
    {
      sci: 'Open.Close',
      validCoverageN: null,
      invalidCoverageN: 2,
      symbols: ['Open', 'Close'],
      validSequences: ['Open.Close'],
      invalidSequences: ['Open', 'Open.Open', 'Close', 'Close.Open', 'Close.Close'],
    },
    {
      sci: 'Select|Move',
      validCoverageN: null,
      invalidCoverageN: 1,
      symbols: ['Select', 'Move'],
      validSequences: ['Select', 'Move'],
      invalidSequences: [],
    },
    {
      sci: 'Op.(Sel|Mov).Clo',
      validCoverageN: null,
      invalidCoverageN: 1,
      symbols: ['Op', 'Sel', 'Mov', 'Clo'],
      validSequences: ['Op.Sel.Clo', 'Op.Mov.Clo'],
      invalidSequences: ['Op', 'Sel', 'Mov', 'Clo'],
    },
  ];

  for (let tp of testParams) {
    describe(`${tp.sci}`, () => {
      const instance = SciParser(tp.sci);
      const validSequences = instance.generateValidSequences();
      const invalidSequences = instance.generateInvalidSequences(tp.invalidCoverageN);

      describe('getInteractionSymbols()', () => {
        it(`should get symbols ${tp.symbols}`, () => {
          expect(instance.getInteractionSymbols()).toEqual(tp.symbols);
        });
      });

      describe(`generateValidSequences()`, () => {
        it(`should generate [${tp.validSequences.join(', ')}]`, () => {
          expect(validSequences).toEqual(tp.validSequences);
        });

        if (validSequences.toString() !== '') {
          for (let sequence of validSequences) {
            const regex = new RegExp(tp.sci.replace(/\./g, '\\.'));
            it(`'${sequence}' should match ${regex}`, () => {
              expect(regex.test(sequence)).toBeTruthy();
            });
          }
        }
      });

      describe(`generateInvalidSequences()`, () => {
        it(`should generate [${tp.invalidSequences.join(', ')}]`, () => {
          expect(invalidSequences).toEqual(tp.invalidSequences);
        });

        if (invalidSequences.toString() !== '') {
          for (let sequence of invalidSequences) {
            const regex = new RegExp(tp.sci.replace(/\./g, '\\.'));
            it(`'${sequence}' should not match ${regex}`, () => {
              expect(regex.test(sequence)).toBeFalsy();
            });
          }
        }
      });

      describe.skip(`generateInvalidSequences()`, () => {
        // TODO test invalid sequences
      });
    });
  }
});

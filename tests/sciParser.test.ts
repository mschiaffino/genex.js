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
      invalidSequences: ['O', 'C', 'C.O'],
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
        'S',
        'M',
        'C',
        'OO',
        'OS',
        'OM',
        'OC',
        'SO',
        'SS',
        'SM',
        'SC',
        'MO',
        'MS',
        'MM',
        'MC',
        'CO',
        'CS',
        'CM',
        'CC',
      ],
    },
    {
      sci: 'Open.Close',
      validCoverageN: null,
      invalidCoverageN: 2,
      symbols: ['Open', 'Close'],
      validSequences: ['Open.Close'],
      invalidSequences: ['Open', 'Close', 'Close.Open'],
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

      describe('getInteractionSymbols()', () => {
        it(`should get symbols ${tp.symbols}`, () => {
          expect(instance.getInteractionSymbols()).toEqual(tp.symbols);
        });
      });

      describe(`generateValidSequences()`, () => {
        it(`should generate ${tp.validSequences.join(', ')}`, () => {
          expect(validSequences).toEqual(tp.validSequences);
        });

        if (validSequences.toString() !== '') {
          for (let value of validSequences) {
            const regex = new RegExp(tp.sci.replace(/\./g, '\\.'));
            it(`'${value}' should match ${regex}`, () => {
              expect(regex.test(value)).toBeTruthy();
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

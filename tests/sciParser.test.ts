import SciParser from '../source';

type TestParams = {
  sci: string;
  validCoverageN: number | null;
  invalidCoverageN: number | null;
  validSequences: string[];
  invalidSequences: string[];
};

describe('sci parser', () => {
  const testParams: TestParams[] = [
    {
      sci: 'O.C',
      validCoverageN: null,
      invalidCoverageN: 2,
      validSequences: ['OC'],
      invalidSequences: ['O', 'C', 'CO'],
    },
    {
      sci: 'S|M',
      validCoverageN: null,
      invalidCoverageN: 1,
      validSequences: ['S', 'M'],
      invalidSequences: [],
    },
    {
      sci: 'O.(S|M).C',
      validCoverageN: null,
      invalidCoverageN: 2,
      validSequences: ['OSC', 'OMC'],
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
      validSequences: ['OpenClose'],
      invalidSequences: ['Open', 'Close', 'CloseOpen'],
    },
    {
      sci: 'Select|Move',
      validCoverageN: null,
      invalidCoverageN: 1,
      validSequences: ['Select', 'Move'],
      invalidSequences: [],
    },
    {
      sci: 'Op.(Sel|Mov).Clo',
      validCoverageN: null,
      invalidCoverageN: 1,
      validSequences: ['OpSelClo', 'OpMovClo'],
      invalidSequences: ['Op', 'Sel', 'Mov', 'Clo'],
    },
  ];

  for (let tp of testParams) {
    describe(`${tp.sci}`, () => {
      const instance = SciParser(tp.sci);
      const validSequences = instance.generateValidSequences();

      describe(`generateValidSequences()`, () => {
        it(`should generate ${tp.validSequences.join(', ')}`, () => {
          expect(validSequences).toEqual(tp.validSequences);
        });

        if (validSequences.toString() !== '') {
          for (let value of validSequences) {
            const regex = new RegExp(tp.sci.replace(/\./g, ''));
            it(`'${value}' should match ${regex}`, () => {
              expect(regex.test(value)).toBeTruthy();
            });
          }
        }
      });

      describe.skip(`generateValidSequences()`, () => {
        // TODO test invalid sequences
      });
    });
  }
});

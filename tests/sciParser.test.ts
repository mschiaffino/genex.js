import SciParser from '../source';

describe('sci parser', () => {
  const scis = [
    {
      input: 'O.C',
      validSequences: ['OC'],
      invalidSequences: ['CO'],
    },
    {
      input: 'S|M',
      validSequences: ['S', 'M'],
      invalidSequences: [],
    },
    {
      input: 'O.(S|M).C',
      validSequences: ['OSC', 'OMC'],
      // TODO add invalid sequences
      invalidSequences: [],
    },
    {
      input: 'Open.Close',
      validSequences: ['OpenClose'],
      invalidSequences: ['CloseOpen'],
    },
    {
      input: 'Select|Move',
      validSequences: ['Select', 'Move'],
      invalidSequences: [],
    },
    {
      input: 'Op.(Sel|Mov).Clo',
      validSequences: ['OpSelClo', 'OpMovClo'],
      // TODO add invalid sequences
      invalidSequences: [],
    },
  ];

  for (let sci of scis) {
    describe(`${sci.input}`, () => {
      const instance = SciParser(sci.input);
      const validSequences = instance.generateValidSequences();

      describe(`generateValidSequences()`, () => {
        it(`should generate ${sci.validSequences.join(', ')}`, () => {
          expect(validSequences).toEqual(sci.validSequences);
        });

        if (validSequences.toString() !== '') {
          for (let value of validSequences) {
            const regex = new RegExp(sci.input.replace(/\./g, ''));
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

# sci-parser

Parser for strings representing Sequence Constraints on the Interactions.

## Install

```shell
npm i sci-parser --save
```

## Usage

```js
import { SciParser } from 'sci-parser';

// Examples with valid SCI string.
const sci = SciParser.parse('A.B.C+');
sci.interactionSymbols;
// => ['A', 'B', 'C']

sci.validSequences(1);
// => ['A.B.C', 'A.B.C.C']

sci.validSequences(2);
// => ['A.B.C', 'A.B.C.C', 'A.B.C.C.C']

sci.invalidSequences(1);
// => ['A', 'B', 'C']

sci.invalidSequences(2);
// => ['A', 'B', 'C', 'A.A', 'A.B', 'A.C', 'B.A', 'B.B', 'B.C', 'C.A', 'C.B', 'C.C']

// Examples with invalid SCI string.
SciParser.isValid('A(');
// => false

SciParser.syntaxErrorMessage('A(');
// => 'Invalid regular expression: /A(/: Unterminated group'
```

## License

MIT

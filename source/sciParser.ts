import ret from 'ret';
import { difference } from './helpers/difference';
import { distinct } from './helpers/distinct';
import { intersection } from './helpers/intersection';
import { Literal } from './iterators/Literal';
import { Option } from './iterators/Option';
import { Reference } from './iterators/Reference';
import { Repetition } from './iterators/Repetition';
import { Stack } from './iterators/Stack';

export class SciParser {
  readonly operators = ['.', '|', '+', '*', '(', ')'];
  readonly charset: number[];
  readonly rawSci: string = null;
  readonly sciRegex: RegExp = null;
  readonly sciRegexEscapedDots: RegExp = null;
  readonly interactionSymbols: string[] = [];
  readonly tokensValidSequences: ret.Root = null;
  readonly tokensInvalidSequences: ret.Root = null;

  constructor(sci: string) {
    this.rawSci = sci;
    this.sciRegex = new RegExp(this.removeDots(sci));
    this.sciRegexEscapedDots = new RegExp('^' + sci.replace(/\./g, '\\.?') + '$', 'g');
    this.interactionSymbols = this.extractInteractionSymbols();

    if (/[(][?]</.test(sci) === true) {
      throw new Error(`Unsupported lookbehind assertion.`);
    }

    this.charset = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
      .split('')
      .map((value) => value.charCodeAt(0));

    this.tokensValidSequences = ret(this.sciRegex.source);
    this.tokensInvalidSequences = ret(`(${this.interactionSymbols.join('|')})+`);
  }

  public sciIsValid(): boolean {
    // TODO implement validation
    return false;
  }

  public validSequences(coverageN: number = 0): string[] {
    const shortestValidSequence = this.generate(this.tokensValidSequences, 0)[0];
    const minValidSequenceLength: number = this.countInteractions(shortestValidSequence);
    const maxRepetitions = coverageN ? coverageN - minValidSequenceLength + 1 : coverageN;
    const maxValidSequenceLength = minValidSequenceLength + coverageN;

    return this.generate(this.tokensValidSequences, maxRepetitions)
      .filter((s) => this.countInteractions(s) <= maxValidSequenceLength)
      .sort(byInteractionsCountAndAlphabetically);
  }

  public invalidSequences(coverageN: number = 1): string[] {
    return this.generate(this.tokensInvalidSequences, coverageN)
      .filter((s) => !this.isValidSequence(s))
      .filter((s) => this.countInteractions(s) <= coverageN)
      .sort(byInteractionsCountAndAlphabetically);
  }

  public isValidSequence(sequence: string) {
    // RESET LAST INDEX WHEN TESTING WITH REUSED REGEX WITH GLOBAL FLAG
    this.sciRegexEscapedDots.lastIndex = 0;
    return this.sciRegexEscapedDots.test(sequence);
  }

  private generate(tokens: ret.Tokens, maxRepetitions = 0, callback?: (value: string) => boolean | void) {
    const groups: Stack[] = [];

    const generator = (tokens: ret.Tokens): Option | Reference | Literal | Stack => {
      if (tokens.type === ret.types.ROOT || tokens.type === ret.types.GROUP) {
        if (tokens.hasOwnProperty('options') !== true) {
          tokens.options = [tokens.stack];
        }

        let result = distinct<ret.Token[]>(
          tokens.options.map((stack) => {
            return stack.filter((value) => value.hasOwnProperty('notFollowedBy') !== true);
          })
        ).map((stack) => new Stack(stack.map((node) => generator(node))));

        if (result.length > 1) {
          result = [new Option(result)];
        }

        if (tokens.type === ret.types.GROUP && tokens.remember === true) {
          groups.push(result[0]);
        }

        return result.shift();
      } else if (tokens.type === ret.types.POSITION) {
        if (['B', '^', '$'].includes(tokens.value) === true) {
          return new Literal(['']);
        }
      } else if (tokens.type === ret.types.SET) {
        let set: number[] = [];

        for (let stack of tokens.set) {
          if (stack.type === ret.types.SET) {
            const data = [];

            for (let node of stack.set) {
              if (node.type === ret.types.RANGE) {
                for (let i = node.from; i <= node.to; ++i) {
                  data.push(i);
                }
              } else if (node.type === ret.types.CHAR) {
                data.push(node.value);
              }
            }

            set = set.concat(stack.not ? difference(this.charset, data) : intersection(this.charset, data));
          } else if (stack.type === ret.types.RANGE) {
            for (let i = stack.from; i <= stack.to; ++i) {
              set.push(i);
            }
          } else if (stack.type === ret.types.CHAR) {
            set.push(stack.value);
          }
        }

        set = tokens.not === true ? difference(this.charset, set) : intersection(this.charset, set);

        if (set.length === 0) {
          set = [];
        }

        return new Literal(set.map((value) => String.fromCharCode(value)));
      } else if (tokens.type === ret.types.REPETITION) {
        if (tokens.type === ret.types.REPETITION && tokens.min === 0 && tokens.max === 1) {
          if (tokens.value.type === ret.types.REPETITION) {
            tokens = tokens.value;
          }
        }

        return Repetition(generator(tokens.value), tokens.min, tokens.max || maxRepetitions);
      } else if (tokens.type === ret.types.REFERENCE) {
        if (groups.hasOwnProperty(tokens.value - 1) !== true) {
          throw new Error(`Reference to non-existent capture group.`);
        }

        return new Reference(groups[tokens.value - 1]);
      } else if (tokens.type === ret.types.CHAR) {
        return new Literal([String.fromCharCode(tokens.value)]);
      }

      return new Literal([]);
    };

    const values = generator(tokens) as Option | Stack;

    if (typeof callback === 'function') {
      for (let value of values) {
        if (callback(value) === false) {
          return null;
        }
      }
    }

    const result = [];

    for (let value of values) {
      result.push(this.addDots(value));
    }

    return result;
  }

  private extractInteractionSymbols(): string[] {
    const isNotEmptyString = (s: string) => s !== '';

    const joinedOperators = this.operators.map((o) => `\\${o}`).join('|');
    const regexToSplitByOps = new RegExp(joinedOperators);

    const hash: { [s: string]: boolean } = {};
    this.rawSci.split(regexToSplitByOps).forEach((s) => (hash[s] = true));

    const distinctSymbols: string[] = Object.keys(hash);

    return distinctSymbols.filter(isNotEmptyString).sort(byInteractionsCountAndAlphabetically);
  }

  private countInteractions(sequence: string) {
    return sequence.split('.').length;
  }

  private removeDots(sci: string): string {
    return sci.replace(/\./g, '');
  }

  private addDots(s: string) {
    return s.split(/(?=[A-Z])/).join('.');
  }
}

const byInteractionsCountAndAlphabetically = (a: string, b: string) =>
  a.split('.').length - b.split('.').length || a.localeCompare(b);

import { Sci } from './sci';

export class SciParser {
  static isValid(sci: string): boolean {
    try {
      // TODO Check that all operators belong to SCI specification
      // TODO Check that all symbols start with capital letter

      // Create Sci instance to return false
      // from catch block if the regex parsing throws
      new Sci(sci);
      return true;
    } catch (error) {
      return false;
    }
  }

  static syntaxErrorMessage(sci: string): string | null {
    try {
      // TODO Add message for each case that can make isValid() === false

      // Create Sci instance to to get return syntax error message
      // from catch block if the regex parsing throws
      new Sci(sci);
      return null;
    } catch (error) {
      return error.message;
    }
  }

  static parse(sci: string): Sci | null {
    try {
      return new Sci(sci);
    } catch (error) {
      return null;
    }
  }
}

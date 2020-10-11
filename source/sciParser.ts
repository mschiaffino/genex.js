import { Sci } from './sci';

export class SciParser {
  /**
   * Validate if a string is a valid Sequence Constraint on the Interactions.
   * @param {string} sci  SCI string to validate.
   * @returns {boolean} Whether the string is a valid SCI or not.
   */
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

  /**
   * Returns the syntax error message when the SCI is invalid.
   * @param sci The invalid SCI.
   * @returns The error message or null if the SCI is valid.
   */
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

  /**
   * Tries to parse the input to return a SCI instance.
   * @param sci SCI string to parse.
   * @returns The corresponding SCI instance or null if parsing failed.
   */
  static parse(sci: string): Sci | null {
    try {
      return new Sci(sci);
    } catch (error) {
      return null;
    }
  }
}

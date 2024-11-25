/** Helper object to format text. */
export class TextFormatter {
  // eslint-disable-next-line no-irregular-whitespace
  public static NoBreakSpaceRegex = / /g;

  public static MultipleWhitespaceRegex = /  +/g;

  public static ZeroWidthSpaceRegex = /[\u200B-\u200F]+/g;

  public static NoBreakSpace = ' ';

  public static stripWhitespaceInline(text: string): string {
    return text
      .replaceAll(TextFormatter.NoBreakSpaceRegex, ' ')
      .replaceAll(TextFormatter.MultipleWhitespaceRegex, ' ')
      .replaceAll(TextFormatter.ZeroWidthSpaceRegex, '')
      .replaceAll('\n', ' ')
      .replaceAll('  ', ' ')
      .trim();
  }
}

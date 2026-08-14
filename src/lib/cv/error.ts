export class CvParseError extends Error {
  constructor(file: string, line: number, message: string) {
    super(`${file}:${line} — ${message}`);
    this.name = "CvParseError";
  }
}

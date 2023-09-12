export class PenpotExportInternalError extends Error {
  constructor(message: string) {
    super(
      `${message}. This is an error in penpot-export code. Please contact their authors.`,
    )
  }
}

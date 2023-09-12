import { PenpotExportInternalError } from '../errors'

export class PenpotExportInvalidAssetsError extends PenpotExportInternalError {
  constructor() {
    super('Invalid penpot-export assets')
  }
}

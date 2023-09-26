// NOTE A Penpot file URL has these forms as of v1.19:
//  https://<origin>/#/workspace/<workspace-uuid>/<file-uuid>
//  https://<origin>/#/workspace/<workspace-uuid>/<file-uuid>?page-id=<page-uuid>
const PENPOT_FILE_URL_HASH_RE = /#\/workspace\/.{36}\/.{36}(?:\?page-id=.{36})?/

const UUID_RE =
  /^\p{Hex_Digit}{8}-\p{Hex_Digit}{4}-\p{Hex_Digit}{4}-\p{Hex_Digit}{4}-\p{Hex_Digit}{12}$/u

export function parsePenpotUrl(url: string) {
  const parsedUrl = new URL(url)

  if (!PENPOT_FILE_URL_HASH_RE.test(parsedUrl.hash)) {
    throw new TypeError('Invalid Penpot file URL')
  }

  const [workspaceId, fileId, pageId] = parsedUrl.hash
    .split(/[\/?=]/)
    .filter((match) => UUID_RE.test(match))

  return {
    instance: parsedUrl.origin + parsedUrl.pathname,
    workspaceId,
    fileId,
    pageId,
  }
}

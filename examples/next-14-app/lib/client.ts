import { HacoCmsClient } from 'hacocms-js-sdk'

// biome-ignore lint/style/noNonNullAssertion: PROJECT_ACCESS_TOKEN is a mandatory environment variable.
export const client = new HacoCmsClient(`https://${process.env.PROJECT_SUBDOMAIN}.hacocms.com`, process.env.PROJECT_ACCESS_TOKEN!)

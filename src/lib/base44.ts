import { createClient } from '@base44/sdk'

// App ID is a public identifier, not a secret. Override it per deployment if needed.
export const base44AppId = (import.meta.env.VITE_BASE44_APP_ID as string | undefined) || '6ae264e1908dafdc6991d163'
export const base44 = createClient({ appId: base44AppId })

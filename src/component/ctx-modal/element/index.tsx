import type { CmpCtxModal_State } from "#src/component/ctx-modal/type/state.js"
import * as r from "react"

export const CmpCtxModal = r.createContext<CmpCtxModal_State | null>(null)

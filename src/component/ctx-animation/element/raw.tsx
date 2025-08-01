import * as r from "react"
import type * as sc from "@qyu/signal-core"

export const CmpContextAnimationRaw = r.createContext<sc.OSignal<number> | null>(null)

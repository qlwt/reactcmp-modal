import type { LayerStack } from "#src/util/layerstack/new.js"
import * as r from "react"

export const CmpContextLayersRaw = r.createContext<LayerStack | null>(null)

import { CmpCtxLayers } from "#src/component/ctx-layers/element/index.js"
import type { LayerStack } from "#src/util/layerstack/new.js"
import * as r from "react"

export const useCtxLayers = function(): LayerStack {
    const layerlist = r.useContext(CmpCtxLayers)

    if (!layerlist) {
        throw new Error(`Using Modal Layers context outside of registered provider`)
    }

    return layerlist
}

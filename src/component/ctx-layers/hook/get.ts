import { CmpContextLayersRaw } from "#src/component/ctx-layers/element/raw.js"
import type { LayerStack } from "#src/util/layerstack/new.js"
import * as r from "react"

export const useContextLayersGet = function(): LayerStack {
    const layerlist = r.useContext(CmpContextLayersRaw)

    if (!layerlist) {
        throw new Error(`Using Modal Layers context outside of registered provider`)
    }

    return layerlist
}

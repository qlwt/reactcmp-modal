import { CmpCtxLayers } from "#src/component/ctx-layers/element/index.js"
import { layerstack_new } from "#src/util/layerstack/new.js"
import * as r from "react"

export type CmpCtxLayersAuto_Props = {
    readonly children?: r.ReactNode
}

export const CmpCtxLayersAuto: r.FC<CmpCtxLayersAuto_Props> = props => {
    const layerstack = r.useMemo(() => {
        return layerstack_new()
    }, [])

    return <CmpCtxLayers.Provider value={layerstack}>
        {props.children}
    </CmpCtxLayers.Provider>
}

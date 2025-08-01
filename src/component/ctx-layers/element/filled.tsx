import { CmpContextLayersRaw } from "#src/component/ctx-layers/element/raw.js"
import { layerstack_new } from "#src/util/layerstack/new.js"
import * as r from "react"

export type CmpContextLayersFilled_Props = Readonly<{
    children?: r.ReactNode
}>

export const CmpContextLayersFilled: r.FC<CmpContextLayersFilled_Props> = props => {
    const layerstack = r.useMemo(() => {
        return layerstack_new()
    }, [])

    return <CmpContextLayersRaw.Provider value={layerstack}>
        {props.children}
    </CmpContextLayersRaw.Provider>
}

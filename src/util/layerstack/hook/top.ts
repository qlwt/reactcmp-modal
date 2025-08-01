import { useContextLayersGet } from "#src/component/ctx-layers/hook/get.js"
import type { LayerStack_Controls } from "#src/util/layerstack/new.js"
import * as r from "react"

export type UseLayerStackTop_Params = {
    readonly z: number
    readonly active: boolean
    readonly exists: boolean
}

export const useLayerStackTop = function(params: UseLayerStackTop_Params): boolean {
    const layerlist = useContextLayersGet()
    const [top, top_set] = r.useState(false)
    const ref_controls = r.useRef<LayerStack_Controls | null>(null)

    // order not important
    r.useLayoutEffect(() => {
        if (ref_controls.current) {
            ref_controls.current.z_set(params.z)
        }
    }, [params.z])

    r.useLayoutEffect(() => {
        if (ref_controls.current) {
            ref_controls.current.active_set(params.active)
        }
    }, [params.active])

    // only updates on exists param change, intentional
    // recreates layerlist
    r.useLayoutEffect((): VoidFunction | void => {
        if (params.exists) {
            const controls = layerlist.push(params.z, params.active)

            ref_controls.current = controls

            const cleanup = controls.top_sub(now_top => {
                top_set(now_top)
            })

            {
                top_set(controls.top_get())
            }

            return () => {
                controls.delete()
                cleanup()

                ref_controls.current = null
            }
        } else {
            top_set(false)
        }
    }, [params.exists])

    return top
}

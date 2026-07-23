import type { UseLayer_Data } from "#src/util/layerstack/hook/top.js"
import type * as sc from "@qyu/signal-core"

export type CmpCtxModal_State = {
    readonly layer: UseLayer_Data
    readonly anim_tracker: sc.OSignal<number> | null
}

export interface CmpCtxModal_State_Animated extends CmpCtxModal_State {
    readonly anim_tracker: sc.OSignal<number>
}

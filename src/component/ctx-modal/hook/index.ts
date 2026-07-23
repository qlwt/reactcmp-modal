import { CmpCtxModal } from "#src/component/ctx-modal/element/index.js"
import type { CmpCtxModal_State } from "#src/component/ctx-modal/type/state.js"
import type * as sc from "@qyu/signal-core"
import * as r from "react"

export const useCtxModal = function (): CmpCtxModal_State {
    const ctx_modal = r.useContext(CmpCtxModal)

    if (!ctx_modal) {
        throw new Error(`Trying to use Modal Context outside of Modal Overlay`)
    }

    return ctx_modal
}

export const useCtxModalAnimTracker = function (): sc.OSignal<number> {
    const ctx_modal = useCtxModal()

    if (!ctx_modal.anim_tracker) {
        throw new Error(`Trying to use Modal Animation Tracker inside of an Instant Overlay`)
    }

    return ctx_modal.anim_tracker
}

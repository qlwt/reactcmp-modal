import { CmpContextAnimationRaw } from "#src/component/ctx-animation/element/raw.js"
import * as sc from "@qyu/signal-core"
import * as r from "react"

export const useContextAnimationGet = function (): sc.OSignal<number> {
    const animation = r.useContext(CmpContextAnimationRaw)

    if (!animation) {
        throw new Error(`Trying to use modal animation outside of context provider`)
    }

    return animation
}

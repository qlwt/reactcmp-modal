import { useCtxModalAnimTracker } from "#src/component/ctx-modal/hook/index.js"
import { CmpFG, type CmpFG_Props } from "#src/component/foreground/element/core.js"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import * as r from "react"

export type CmpFGAnimFade_Props = (
    & CmpFG_Props
    & {
        readonly anim_easing?: (state: number) => number
    }
)

export const CmpFGAnimFade = r.memo(r.forwardRef<HTMLElement, CmpFGAnimFade_Props>((props, fref) => {
    const ref_foreground = r.useRef<HTMLElement | null>(null)
    const anim_tracker = useCtxModalAnimTracker()

    sr.useDOMStyle(
        r.useCallback(() => ref_foreground.current, []),
        "opacity",
        r.useMemo(() => {
            return sc.osignal_new_pipe(anim_tracker, animation_o => {
                if (props.anim_easing) {
                    return `${props.anim_easing(animation_o)}`
                }

                return `${animation_o}`
            })
        }, [anim_tracker, props.anim_easing])
    )

    const ref = r.useCallback((element: HTMLElement | null) => {
        ref_foreground.current = element

        if (fref) {
            if (typeof fref === "object") {
                fref.current = element
            } else if (typeof fref === "function") {
                fref(element)
            }
        }
    }, [fref])

    return <CmpFG
        {...props}

        ref={ref}
    />
}))

export default CmpFGAnimFade

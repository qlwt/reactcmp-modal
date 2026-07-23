import { useCtxModalAnimTracker } from "#src/component/ctx-modal/hook/index.js"
import { CmpFG, type CmpFG_Props } from "#src/component/foreground/element/core.js"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import * as r from "react"

export type CmpFGAnimSlide_AnimDir = (
    | "fromtop"
    | "frombottom"
    | "fromleft"
    | "fromright"
)

export type CmpFGAnimSlide_Props = (
    & CmpFG_Props
    & {
        readonly anim_easing?: (state: number) => number
        readonly anim_dir: CmpFGAnimSlide_AnimDir
    }
)

export const CmpFGAnimSlide = r.memo(r.forwardRef<HTMLElement, CmpFGAnimSlide_Props>((props, fref) => {
    const ref_foreground = r.useRef<HTMLElement | null>(null)
    const anim_tracker = useCtxModalAnimTracker()

    sr.useDOMStyleMap(
        r.useCallback(() => ref_foreground.current, [ref_foreground]),
        r.useMemo(() => sc.osignal_new_pipe(anim_tracker, state => {
            const state_eased = props.anim_easing ? props.anim_easing(state) : state
            const translate = 100 - state_eased * 100

            switch (props.anim_dir) {
                case "fromtop":
                    return {
                        transform: `translateY(-${translate}%)`
                    }
                case "frombottom":
                    return {
                        transform: `translateY(${translate}%)`
                    }
                case "fromleft":
                    return {
                        transform: `translateX(-${translate}%)`
                    }
                case "fromright":
                    return {
                        transform: `translateX(${translate}%)`
                    }
            }
        }), [anim_tracker, props.anim_dir, props.anim_easing])
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

export default CmpFGAnimSlide

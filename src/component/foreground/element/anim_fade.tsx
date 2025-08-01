import { useContextAnimationGet } from "#src/component/ctx-animation/hook/get.js"
import { CmpFG, type CmpFG_Props } from "#src/component/foreground/element/core.js"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import * as r from "react"

export type CmpFGAnimFade_Props = (
    & CmpFG_Props
    & Readonly<{
        easing?: (state: number) => number
    }>
)

export const CmpFGAnimFade = r.memo(r.forwardRef<HTMLElement, CmpFGAnimFade_Props>((props, fref) => {
    const ref_foreground = r.useRef<HTMLElement | null>(null)
    const animation = useContextAnimationGet()

    sr.useDOMStyle(
        r.useCallback(() => ref_foreground.current, []),
        "opacity",
        r.useMemo(() => {
            return sc.osignal_new_pipe(animation, animation_o => {
                if (props.easing) {
                    return `${props.easing(animation_o)}`
                }

                return `${animation_o}`
            })
        }, [animation, props.easing])
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

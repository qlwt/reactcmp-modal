import { useContextAnimationGet } from "#src/component/ctx-animation/hook/get.js"
import { CmpFG, type CmpFG_Props } from "#src/component/foreground/element/core.js"
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import * as r from "react"

export type CmpFGAnimSlide_AnimationType = (
    | "fromtop"
    | "frombottom"
    | "fromleft"
    | "fromright"
)

export type CmpFGAnimSlide_Props = (
    & CmpFG_Props
    & Readonly<{
        easing?: (state: number) => number
        animation_type: CmpFGAnimSlide_AnimationType
    }>
)

export const CmpFGAnimSlide = r.memo(r.forwardRef<HTMLElement, CmpFGAnimSlide_Props>((props, fref) => {
    const ref_foreground = r.useRef<HTMLElement | null>(null)
    const animation = useContextAnimationGet()

    sr.useDOMStyleMap(
        r.useCallback(() => ref_foreground.current, [ref_foreground]),
        r.useMemo(() => sc.osignal_new_pipe(animation, state => {
            const translate_raw = 100 - state * 100
            const translate = props.easing ? props.easing(translate_raw) : translate_raw

            switch (props.animation_type) {
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
        }), [animation, props.animation_type, props.easing])
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

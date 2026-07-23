import { cl } from "#src/util/cl.js"
import { prop_clmap_def_fg, type PropClMap_DefFG } from "#src/util/prop/clmap/def/fg.js"
import { prop_clmap_new } from "#src/util/prop/clmap/new.js"
import * as r from "react"

export type CmpFG_Props = {
    readonly tabIndex?: number
    readonly className?: string
    readonly children?: r.ReactNode

    readonly clmap?: Partial<PropClMap_DefFG>
    readonly show_set?: (show: boolean) => void

    readonly closeev_esc_disabled?: boolean
    readonly closeev_press_disabled?: boolean
    readonly closeev_esc_unpreventable?: boolean

    readonly render?: (props: r.JSX.IntrinsicElements["div"]) => r.ReactNode
}

const dprop_render: NonNullable<CmpFG_Props["render"]> = props => {
    return <div {...props} />
}

export const CmpFG = r.memo(r.forwardRef<HTMLDivElement, CmpFG_Props>((props, fref) => {
    const nprop_closeev_press_disabled = props.closeev_press_disabled ?? false
    const nprop_closeev_esc_disabled = props.closeev_esc_disabled ?? false
    const nprop_closeev_esc_unpreventable = props.closeev_esc_unpreventable ?? false
    const nprop_render = props.render ?? dprop_render

    const nprop_focus_tabindex = props.tabIndex ?? undefined

    const nprop_clmap = r.useMemo(() => prop_clmap_new(props.clmap, prop_clmap_def_fg), [props.clmap])

    const lref = r.useRef<HTMLDivElement | null>()

    const event_click = r.useCallback((event: r.MouseEvent) => {
        if (!nprop_closeev_press_disabled && event.currentTarget === event.target) {
            props.show_set?.(false)
        }
    }, [nprop_closeev_press_disabled, props.show_set])

    const event_keydown = r.useCallback((event: r.KeyboardEvent) => {
        if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
            return
        }

        switch (event.key.toLowerCase()) {
            case "space":
            case "enter": {
                if (!nprop_closeev_press_disabled) {
                    if (event.target === event.currentTarget) {
                        event.preventDefault()

                        props.show_set?.(false)
                    }
                }

                break
            }
            case "escape": {
                if (!nprop_closeev_esc_disabled && (nprop_closeev_esc_unpreventable || !event.defaultPrevented)) {
                    event.preventDefault()

                    props.show_set?.(false)
                }

                break
            }
        }
    }, [nprop_closeev_press_disabled, nprop_closeev_esc_disabled, nprop_closeev_esc_unpreventable, props.show_set])

    const ref = r.useCallback((element: HTMLDivElement | null) => {
        lref.current = element

        if (fref) {
            if (typeof fref === "object") {
                fref.current = element
            } else {
                fref(element)
            }
        }
    }, [lref, fref])

    return nprop_render({
        ref,
        onClick: event_click,
        onKeyDown: event_keydown,
        children: props.children,
        tabIndex: nprop_focus_tabindex,

        className: cl(
            props.className,
            nprop_clmap.__qyumdl,
            nprop_clmap.fg,
        ),
    })
}))

export default CmpFG

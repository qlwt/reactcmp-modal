import { useFocusCapture } from "#src/util/focus/hook/capture.js"
import { focus_onkey } from "#src/util/focus/onkey.js"
import { useLayerStackTop } from "#src/util/layerstack/hook/top.js"
import * as r from "react"
import * as rdom from "react-dom"

export type CmpOverlayInstant_Styles = Readonly<{
    body_inactive?: string
    overlay?: string
    overlay_hidden?: string
    overlay_inactive?: string
}>

export type CmpOverlayInstant_Props = Readonly<{
    show: boolean

    layer_z?: number
    layer_active?: boolean

    children?: r.ReactNode
    styles?: CmpOverlayInstant_Styles
    root?: HTMLElement | null | undefined
}>

export const CmpOverlayInstant: r.FC<CmpOverlayInstant_Props> = r.memo(props => {
    const ref_modal = r.useRef<HTMLDivElement | null>(null)

    const istop = useLayerStackTop({
        exists: props.show,
        z: props.layer_z ?? 0,
        active: props.layer_active ?? true,
    })

    r.useLayoutEffect((): VoidFunction | void => {
        if (istop) {
            const classname = props.styles?.body_inactive ?? "__modal_body_inactive"

            document.body.classList.add(classname)

            return () => {
                document.body.classList.remove(classname)
            }
        }
    }, [istop, props.styles?.body_inactive])

    r.useEffect((): VoidFunction | void => {
        if (istop) {
            const controller = new AbortController()

            document.body.addEventListener("keydown", event => {
                focus_onkey(event, ref_modal.current)
            }, { signal: controller.signal })

            return controller.abort.bind(controller)
        }
    }, [istop])

    useFocusCapture({
        active: istop,
        target_new: r.useCallback(() => ref_modal.current, [ref_modal]),
    })

    const root = props.root ?? document.getElementById("modal-root")

    if (!root) {
        return null
    }

    return rdom.createPortal(
        props.show ? (
            <div
                ref={ref_modal}
                aria-hidden={!istop}

                style={{
                    zIndex: 10 + (props.layer_z ?? 0)
                }}

                className={
                    `${props.styles?.overlay ?? "__modal_overlay"}`
                    + `${istop ? "" : props.styles?.overlay_hidden ?? " __modal_overlay_hidden"}`
                    + `${(props.layer_active ?? true) ? "" : props.styles?.overlay_inactive ?? " __modal_overlay_inactive"}`
                }
            >
                {props.children}
            </div>
        ) : null,
        root,
    )
})

export default CmpOverlayInstant 

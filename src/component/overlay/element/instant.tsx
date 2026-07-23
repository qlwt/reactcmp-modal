import { CmpCtxModal } from "#src/component/ctx-modal/element/index.js"
import type { CmpCtxModal_State } from "#src/component/ctx-modal/type/state.js"
import { cl } from "#src/util/cl.js"
import { focus_find_first } from "#src/util/focus/find/first.js"
import { focus_find_last } from "#src/util/focus/find/last.js"
import { useFocusCapture } from "#src/util/focus/hook/capture.js"
import { useLayer, type UseLayer_Data } from "#src/util/layerstack/hook/top.js"
import { prop_clmap_def_overlay, type PropClMap_DefOverlay } from "#src/util/prop/clmap/def/overlay.js"
import { prop_clmap_new } from "#src/util/prop/clmap/new.js"
import { prop_portal_new } from "#src/util/prop/portal/new.js"
import type { Prop_Portal_Raw } from "#src/util/prop/portal/type/prop.js"
import type * as sc from "@qyu/signal-core"
import * as r from "react"
import * as rdom from "react-dom"

export type CmpOverlayInstant_FocusGuard_Props = {
    readonly direction: "start" | "end"
}

export type CmpOverlayInstant_Props = {
    readonly show: boolean

    readonly children?: r.ReactNode
    readonly portal?: Prop_Portal_Raw
    readonly clmap?: Partial<PropClMap_DefOverlay>
    readonly anim_tracker?: sc.OSignal<number> | null

    readonly layer_z?: number
    readonly layer_active?: boolean
    readonly layer_custom?: UseLayer_Data

    readonly focus_disabled?: boolean
    readonly focus_config?: FocusOptions
    readonly focus_guard_disabled?: boolean
    readonly focus_target_oref?: () => HTMLElement | null
    readonly focus_guard_render?: (props: CmpOverlayInstant_FocusGuard_Props) => r.ReactNode

    readonly render?: (props: r.JSX.IntrinsicElements["div"]) => r.ReactNode
}

const dprop_focus_config: NonNullable<CmpOverlayInstant_Props["focus_config"]> = {
    preventScroll: true,
}

const dprop_render: NonNullable<CmpOverlayInstant_Props["render"]> = props => {
    return <div {...props} />
}

const dprop_focus_guard_render: NonNullable<CmpOverlayInstant_Props["focus_guard_render"]> = props => {
    return <div
        tabIndex={0}
        aria-hidden={`true`}
        data-qyu-reactcmp-modal-focusguard="true"
        data-qyu-reactcmp-modal-focusguard-dir={props.direction}
    />
}

export const CmpOverlayInstant = r.memo(
    r.forwardRef<HTMLDivElement, CmpOverlayInstant_Props>((props, fref) => {
        const nprop_render = props.render ?? dprop_render
        const nprop_portal = prop_portal_new(props.portal ?? "modal-root")

        const nprop_layer_z = props.layer_z ?? 0
        const nprop_layer_active = props.layer_active ?? true

        const nprop_focus_disabled = props.focus_disabled ?? false
        const nprop_focus_config = props.focus_config ?? dprop_focus_config
        const nprop_focus_guard_disabled = props.focus_guard_disabled ?? false
        const nprop_focus_guard_render = props.focus_guard_render ?? dprop_focus_guard_render

        const nprop_clmap = r.useMemo(() => prop_clmap_new(props.clmap, prop_clmap_def_overlay), [props.clmap])

        const lref = r.useRef<HTMLDivElement | null>(null)

        const layer_l = useLayer({
            exists: props.layer_custom ? false : props.show,

            z: nprop_layer_z,
            active: nprop_layer_active,
        })

        const layer = layer_l ?? props.layer_custom

        const ctx_state = r.useMemo<CmpCtxModal_State>(() => {
            return {
                layer,
                anim_tracker: props.anim_tracker ?? null,
            }
        }, [props.anim_tracker, layer])

        r.useLayoutEffect((): VoidFunction | void => {
            const clname = nprop_clmap.__qyumdl_body_inactive

            if (layer.status_top && clname) {
                document.body.classList.add(clname)

                return () => {
                    document.body.classList.remove(clname)
                }
            }
        }, [layer.status_top, nprop_clmap.__qyumdl_body_inactive])

        r.useEffect((): VoidFunction | void => {
            const modal = lref.current

            if (nprop_focus_disabled || !layer.status_top || !modal) { return }

            const controller = new AbortController()

            document.addEventListener("focusin", ev => {
                if (ev.target instanceof Element) {
                    const path = ev.composedPath()

                    if (ev.target.hasAttribute("data-qyu-reactcmp-modal-focusguard")) {
                        if (!path.includes(modal)) {
                            switch (ev.target.getAttribute("data-qyu-reactcmp-modal-focusguard-dir")) {
                                case "start": {
                                    focus_find_last(modal)?.focus()

                                    break
                                }
                                case "end": {
                                    focus_find_first(modal)?.focus()

                                    break
                                }
                            }
                        }
                    }
                }
            }, { signal: controller.signal })

            return () => { controller.abort() }
        }, [layer.status_top])

        useFocusCapture({
            layer_active: layer.status_top,
            screen_oref: r.useCallback(() => lref.current, [lref]),

            focus_config: nprop_focus_config,
            focus_disabled: nprop_focus_disabled,
            focus_target_oref: props.focus_target_oref,
        })

        const ref = r.useCallback((element: HTMLDivElement | null) => {
            lref.current = element

            if (fref) {
                if (typeof fref === "object") {
                    fref.current = element
                } else {
                    fref(element)
                }
            }
        }, [fref, lref])

        if (!nprop_portal) {
            return null
        }

        const view_focusguard_enabled = !(nprop_focus_disabled || nprop_focus_guard_disabled)

        return rdom.createPortal(
            props.show ? (
                <CmpCtxModal.Provider value={ctx_state}>
                    {(view_focusguard_enabled
                        ? nprop_focus_guard_render({ direction: "start", })
                        : null
                    )}

                    {nprop_render({
                        ref,
                        role: "dialog",
                        children: props.children,
                        "aria-hidden": !layer.status_top,

                        style: {
                            [`--qyumdl-overlay-layer_z-diff` as any]: nprop_layer_z,
                        },

                        className: cl(
                            nprop_clmap.__qyumdl,
                            nprop_clmap.overlay,
                            !layer.status_top && nprop_clmap._hidden,
                            !nprop_layer_active && nprop_clmap._inactive,
                        ),
                    })}

                    {(view_focusguard_enabled
                        ? nprop_focus_guard_render({ direction: "end", })
                        : null
                    )}
                </CmpCtxModal.Provider>
            ) : null,
            nprop_portal,
        )
    })
)

export default CmpOverlayInstant 

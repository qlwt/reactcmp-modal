import CmpOverlayInstant, { type CmpOverlayInstant_Props } from "#src/component/overlay/element/instant.js"
import * as ac from "@qyu/anim-core"
import * as ar from "@qyu/anim-react"
import * as sc from "@qyu/signal-core"
import * as r from "react"

export type CmpOverlayAnimated_Props = (
    & Omit<CmpOverlayInstant_Props, "anim_tracker">
    & {
        readonly anim_velocity?: number

        readonly on_didhide?: VoidFunction
        readonly on_willhide?: VoidFunction
        readonly on_didshow?: VoidFunction
        readonly on_willshow?: VoidFunction
    }
)

const fscheduler = ac.fscheduler_new_frame(performance, requestAnimationFrame, cancelAnimationFrame)

export const CmpOverlayAnimated = r.memo(
    r.forwardRef<HTMLDivElement, CmpOverlayAnimated_Props>((props, fref) => {
        const anim_tracker = r.useMemo(() => sc.signal_new_value(Number(props.show)), [])

        const [visible, visible_set] = r.useState(props.show)

        ar.useRunAnimInterval({
            scheduler: fscheduler,

            src: ar.useAnimLine({
                init: ar.useInputConstant({
                    state: Number(props.show)
                }),

                config: ar.useInputDynamicSet(r.useMemo(() => ({
                    target: Number(props.show),
                    velocity: props.anim_velocity ?? 3e-3,

                    effect: state => {
                        // for events
                        const old_animation_show_o = anim_tracker.output()

                        anim_tracker.input(state)

                        visible_set(state > 0)

                        // side effects
                        if (state >= 1) {
                            if (old_animation_show_o < 1) {
                                props.on_didshow?.()
                            }
                        } else if (state > 0) {
                            if (old_animation_show_o <= 0) {
                                props.on_willshow?.()
                            } else if (old_animation_show_o >= 1) {
                                props.on_willhide?.()
                            }
                        } else if (state <= 0) {
                            if (old_animation_show_o > 0) {
                                props.on_didhide?.()
                            }
                        }
                    },
                }), [
                    props.show,
                    anim_tracker,
                    props.anim_velocity,
                    props.on_didhide,
                    props.on_didshow,
                    props.on_willhide,
                    props.on_willshow,
                ]))
            })
        })

        return <CmpOverlayInstant
            {...props}

            ref={fref}
            show={visible}
            anim_tracker={anim_tracker}
        />
    })
)

export default CmpOverlayAnimated

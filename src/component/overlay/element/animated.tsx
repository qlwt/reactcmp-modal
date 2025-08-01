import { CmpContextAnimationRaw } from "#src/component/ctx-animation/element/raw.js"
import CmpOverlayInstant, { type CmpOverlayInstant_Props } from "#src/component/overlay/element/instant.js"
import * as ac from "@qyu/anim-core"
import * as ar from "@qyu/anim-react"
import * as sc from "@qyu/signal-core"
import * as r from "react"

export type CmpOverlayAnimated_Props = (
    & CmpOverlayInstant_Props
    & {
        animation_velocity?: number

        on_didhide?: VoidFunction
        on_willhide?: VoidFunction
        on_didshow?: VoidFunction
        on_willshow?: VoidFunction
    }
)

const fscheduler = ac.fscheduler_new_frame(performance, requestAnimationFrame, cancelAnimationFrame)

export const CmpOverlayAnimated: r.FC<CmpOverlayAnimated_Props> = r.memo(props => {
    const [visible, visible_set] = r.useState(props.show)
    const animation_show = r.useMemo(() => sc.signal_new_value(Number(props.show)), [])

    ar.useRunAnimInterval({
        scheduler: fscheduler,

        src: ar.useAnimLine({
            init: ar.useInputConstant({
                state: Number(props.show)
            }),

            config: ar.useInputDynamicSet({
                target: Number(props.show),
                velocity: props.animation_velocity ?? 3e-3,

                effect: state => {
                    // for events
                    const old_animation_show_o = animation_show.output()

                    animation_show.input(state)

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
            })
        })
    })

    return <CmpContextAnimationRaw.Provider value={animation_show}>
        <CmpOverlayInstant
            {...props}

            show={visible}
        />
    </CmpContextAnimationRaw.Provider>
})

export default CmpOverlayAnimated

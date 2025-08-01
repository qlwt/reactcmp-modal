// import styles with your bundler or copy them by hand and reference in your html
import "@qyu/reactcmp-modal/style/index.global"

import * as sr from "@qyu/signal-react"
import * as sc from "@qyu/signal-core"
import { CmpContextLayersFilled } from "#src/component/ctx-layers/element/filled.js"
import CmpFG from "#src/component/foreground/element/core.js"
import CmpOverlayInstant from "#src/component/overlay/element/instant.js"
import { useFocusCapture } from "#src/util/focus/hook/capture.js"
import { useLayerStackTop } from "#src/util/layerstack/hook/top.js"
import * as r from "react"
import CmpOverlayAnimated from "#src/component/overlay/element/animated.js"
import CmpFGAnimFade from "#src/component/foreground/element/anim_fade.js"
import { CmpContextAnimationRaw } from "#src/component/ctx-animation/element/raw.js"
import { useContextAnimationGet } from "#src/component/ctx-animation/hook/get.js"

// append modal root
const modalroot = document.createElement("div")

// modal-root is default id for modal target, if you choose that id it will be used as default for portal targets
modalroot.setAttribute("id", "modal-root")

document.body.append(modalroot)

function App() {
    // register layers context - required, will throw if not done
    return <CmpContextLayersFilled>
        <Page />
    </CmpContextLayersFilled>
}

function Page() {
    // register page as a layer - used to add accesibility, styles and control focus
    // z = -1 as page is always lower than any modal
    // active - shows if page is visible (eg. display: none), exists - shows if page is rendered at all
    // istop represents if layer is top layer or not
    const istop = useLayerStackTop({ z: -1, active: true, exists: true })
    // used to control focus
    const ref_root = r.useRef<HTMLDivElement | null>(null)

    // focus controller will save focus when istop is changed to false and restore it back when istop is changed back
    useFocusCapture({
        active: istop,
        target_new: r.useCallback(() => ref_root.current, [])
    })

    // apply layer order based customisations
    return <div ref={ref_root} aria-hidden={!istop}>
        <Button />
    </div>
}

function Button() {
    // modal show controlled declaratively
    const [show, show_set] = r.useState(false)

    return <>
        <button onClick={() => show_set(true)}>
            Hello World
        </button>

        {/* overlay is required wrapper for any modal - it registers layers, manages focus etc */}
        <CmpOverlayInstant
            show={show}

            // optional, this represents existing z index, but does not affect anything in styles or render order
            layer_z={1}
            // optional, toggle if modal goes to not displayed. It will apply overlay_inactive styles (by default just make display: none)
            layer_active={false}
            // optional, target for modal portal, in this case optional as we have element with modal-root id that will be used by default
            root={document.getElementById("modal-root")}
            // optional, custom styles
            styles={{
                overlay: "myclassname"
                // ...
            }}
        >
            <CmpFG
                // optional, required for custom modal close events to work
                show_set={show_set}

                // optional, custom styles
                styles={{
                    foreground: "myclassname",
                    // ...
                }}

                // close events conditions, all optional, here represented with their default values
                // close on foreground press
                close_onpress={true}
                // close on escape press
                close_onescape={true}
                // close on escape press event if event target is not directly foreground
                close_onescape_global={true}
            >
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translateX(-50%) translateY(-50%);",
                    background: "white",
                    width: "200px",
                    height: "200px"
                }}>
                    Foreground is focused. Press on it or press enter/space/escape to close
                </div>
            </CmpFG>
        </CmpOverlayInstant>
    </>
}

function ToggleAnimFade() {
    // modal show controlled declaratively
    const [show, show_set] = r.useState(false)

    return <>
        <button onClick={() => show_set(true)}>
            Hello World
        </button>

        {/* Animated Overlay required for any animation */}
        {/* Extends instant overlay properties so optional ones will be omited to not repeat */}
        <CmpOverlayAnimated
            show={show}

            // animation moves from 0 to 1 linear. Velocity represents movement per ms
            // optional, this animation will last 1/3 seconds. This is also default value
            animation_velocity={3e-3}

            // events, all optional
            on_didhide={() => console.log("didhide")}
            on_didshow={() => console.log("didshow")}
            on_willshow={() => console.log("willshow")}
            on_willhide={() => console.log("willhide")}
        >
            {/* Also extends all FG properties they also will be omited */}
            {/* Opacty based fade animation */}
            <CmpFGAnimFade easing={state => state * state}>
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translateX(-50%) translateY(-50%);",
                    background: "white",
                    width: "200px",
                    height: "200px"
                }}>
                    Foreground is focused. Press on it or press enter/space/escape to close
                </div>
            </CmpFGAnimFade>
        </CmpOverlayAnimated>
    </>
}

function FGAnimCustom(props: { children?: r.ReactNode }) {
    const ref = r.useRef<HTMLDivElement | null>(null)
    const animstate = useContextAnimationGet()

    sr.useDOMStyleMap(
        r.useCallback(() => ref.current, []),
        r.useMemo(() => {
            return sc.osignal_new_pipe(animstate, state => {
                return {
                    opacity: `${state}`
                }
            })
        }, [animstate])
    )

    return <CmpFG ref={ref}>
        {props.children}
    </CmpFG>
}

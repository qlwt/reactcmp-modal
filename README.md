# @qyu/reactcmp-modal

React Component to Render Modal Dialogs

## Quick Start

### Import Styles

```tsx
import "@qyu/reactcmp-modal/style/index.css"
```

### Create Portal Root

- Container with `id === "modal-root"` is auto-detected
- Alternatively you can use `.portal` prop on component, it accepts either id `string` or `HTMLElement`

```tsx
const modal_root = document.createElement("div")

{
    modal_root.setAttribute("id", "modal-root")

    document.body.appendChild(modal_root)
}
```

### Render Modal Context

```tsx
import * as rmdl from "@qyu/reactcmp-modal"

function Root() {
    return <rmdl.CmpCtxLayersAuto>
        ...
    </rmdl.CmpCtxLayersAuto>
}
```

### Render App Root as Layer

- `aria-hidden` and `focus capture` is not handled automatically
- To apply them correctly, you need to register App as a `Layer`, so it could track self-position in relation to `Modals`
- `useLayer` allows you to know wether current layer is on top in comparison to other layers
- `useLayer` shall only be called once per layer, as it registeres new layer every time
- `useFocusCapture` does not do focus-trap, it just manages autofocus and focus restoration

```tsx
import * as rmdl from "@qyu/reactcmp-modal"

function App() {
    const ref = r.useRef<HTMLDivElement | null>()

    const { status_top } = rmdl.useLayer({
        // app should logically be behind the modals
        // it does not affect styles - just an internal representation
        z: -1,
        // is the content displayed? false when display: none
        active: true,
        // is layer registered? making false is the same as not using the hook at all
        exists: true,
    })

    rmdl.useFocusCapture({
        layer_active: status_top,
        screen_oref: r.useCallback(() => ref.current, [])

        // prevent from focusing first element in the screen initially
        focus_nomove: true,
    })

    // stays hidden when that screen is not on top
    return <div ref={ref} aria-hidden={!status_top}>
        
    </div>
}
```

### Render Modal

- Modal is divided into `Overlay` and `Foreground` Components
- `Overlay` is a static invisible layer that covers your screen
- `Foreground` is optional, but common visual representation of Modal's base

```tsx
import * as rmdl from "@qyu/reactcmp-modal"

function ImportantButton() {
    const [status_modal, status_modal_set] = r.useState(false)

    return <>
        <button onClick={() => status_modal_set(true)}>
            Do Important Thing
        </button>

        {/* Instant overlay is not animated and will be shown immediately */}
        <rmdl.CmpOverlayInstant show={status_modal}>
            <rmdl.CmpFg
                // Foreground handles modal closing on click or escape press
                show_set={status_modal_set}
            >
                <div style={{
                    top: "50%",
                    left: "50%",
                    padding: "30px",
                    borderRadius: "4px"
                    backgroundColor: "white",
                    transform: "translateX(-50%) translateY(-50%)", 
                }}>
                    <div>
                        Are you sure you want to proceede
                    </div>

                    <button 
                        onClick={() => {
                            // do your thing

                            status_modal_set(false)
                        }}
                    >
                        Yes I am
                    </button>
                </div>
            </rmdl.CmpFG>
        </rmdl.CmpOverlayInstant>
    </>
}
```

## Using Animated Modals

- Use `CmpOverlayAnimated` to create animated overlay, it will hold modal shown while animation going
- Use `CmpFGAnimFade` or `CmpFGAnimSlide` for animated foregrounds (or make your own animation)

```tsx
import * as rmdl from "@qyu/reactcmp-modal"

type Props = {
    show: boolean,
    show_set: (value: boolean) => void 
}

function Animated(props: Props) {
    return <rmdl.CmpOverlayAnimated 
        show={props.show}

        // animation is going between 0<->1, speed is per ms
        anim_velocity={1e-3}
    >
        <rmdl.CmpFGAnimFade 
            show_set={props.show_set} 

            // to change the pace of animation
            // you would probably want to use cubic bezier here
            anim_easing={s => Math.sqrt(s)}

            // events
            on_didhide={() => {}}
            on_willhide={() => {}}
            on_willshow={() => {}}
            on_didshow={() => {}}
        >
            Content
        </rmdl.CmpFGAnimFade>

        <rmdl.CmpFGAnimSlide
            show_set={props.show_set} 

            // fromright | fromleft | frombottom | fromtop
            anim_dir={"fromright"}
        >
            Content
        </rmdl.CmpFGAnimSlide>
    </rmdl.CmpOverlayAnimated>
}
```

## Managing Focus

- Implemented Focus Trap only handles basic cases when modal has natural tab-order
- For other cases like `tabIndex >= 1`, `focus-groups`, `shadow-trees` etc., disable focus management and use external library

```tsx
import * as rmdl from "@qyu/reactcmp-modal"

function FGCustom() {
    return <rmdl.CmpOverlayInstant focus_disabled>
        <MyFocusTrap>
            Content
        </MyFocusTrap>
    </rmdl.CmpOverlayInstant>
}
```

## Custom Styles

- Library comes with baseline styles, in some cases you would want to override them
- Components that have baseline custom styles come with `.clmap` prop to override them
- If you want to use library's styles as cssmodule - you can import them and pass to clmap instead of using global import

```tsx
import rmdl_st from "@qyu/reactcmp-modal/style/index.css"
import * as rmdl from "@qyu/reactcmp-modal"

function FGCustom() {
    return <rmdl.CmpFGAnimSlide
        className={"fg_custom"}

        clmap={{
            // use cssmodules instead of global css
            ...rmdl_st,
            // disable foreground class
            fg: null,
        }}
    />
}
```

## Custom Animations

- `CmpOverlayAnimated` exposes `Signal` tracking the animation state, use it to sync foreground's styles

```tsx
import * as sc from "@qyu/signal-core"
import * as sr from "@qyu/signal-react"
import * as rmdl from "@qyu/reactcmp-modal"

function CustomFG(props: rmdl.CmpFG_Props) {
    const ref_foreground = r.useRef<HTMLElement | null>(null)
    const anim_tracker = rmdl.useCtxModalAnimTracker()

    sr.useDOMStyle(
        r.useCallback(() => ref_foreground.current, []),
        "opacity",
        r.useMemo(() => {
            return sc.osignal_new_pipe(anim_tracker, anim_state => {
                // anim_state is a number between 0 and 1
                return `${anim_state}`
            })
        }, [anim_tracker])
    )

    return <CmpFG {...props} ref={ref_foreground} />
}
```

## Default Style Variables

```css
:root {
    /* default bgc for foreground */
    --qyumdl-fg-bgc: rgba(0, 0, 0, 0.5);
    /* when foreground is focused */
    --qyumdl-fg-bgc_focus: rgba(0, 0, 0, 0.65);
    /* foreground bgc trtime */
    --qyumdl-fg-bgc-trtime: .25s;
    /* baseline z-index used by all modal windows */
    --qyumdl-overlay-layer_z-base: 10;
}
```

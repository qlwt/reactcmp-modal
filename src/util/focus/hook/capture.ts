import { focus_find_first } from "#src/util/focus/find/first.js"
import * as r from "react"

export type UseFocusCapture_Params = {
    readonly layer_active: boolean

    readonly focus_nomove?: boolean
    readonly focus_disabled?: boolean
    readonly focus_config?: FocusOptions
    readonly focus_target_oref?: () => HTMLElement | null

    readonly screen_oref: () => HTMLElement | null
}

const dprop_focus_config: NonNullable<UseFocusCapture_Params["focus_config"]> = {
    preventScroll: true,
}

export const useFocusCapture = function(params: UseFocusCapture_Params): void {
    const ref_lastfocus = r.useRef<HTMLElement | null>(null)

    const nprop_focus_nomove = params.focus_nomove ?? false
    const nprop_focus_disabled = params.focus_disabled ?? false
    const nprop_focus_target_oref = params.focus_target_oref ?? null
    const nprop_focus_config = params.focus_config ?? dprop_focus_config

    r.useLayoutEffect(() => {
        const screen = params.screen_oref()

        if (nprop_focus_disabled || !screen) { return }

        if (!params.layer_active) {
            const active = document.activeElement

            if (screen && active instanceof HTMLElement && screen.contains(active)) {
                ref_lastfocus.current = active
            }
        }
    }, [params.layer_active])

    r.useEffect(() => {
        const screen = params.screen_oref()

        if (nprop_focus_disabled || !screen) { return }

        if (params.layer_active) {
            if (ref_lastfocus.current) {
                ref_lastfocus.current.focus(nprop_focus_config)

                ref_lastfocus.current = null
            } else if (!nprop_focus_nomove) {
                const target = nprop_focus_target_oref?.()

                if (target) {
                    target.focus(nprop_focus_config)
                } else {
                    focus_find_first(screen)?.focus(nprop_focus_config)
                }
            }
        }
    }, [params.layer_active])
}

import { focus_order_new } from "#src/util/focus/order/new/index.js"
import * as r from "react"

export type UseFocusCapture_Params = Readonly<{
    active: boolean
    target_new: () => HTMLElement | null
}>

export const useFocusCapture = function(params: UseFocusCapture_Params): void {
    const ref_lastfocus = r.useRef<HTMLElement | null>(null)

    r.useLayoutEffect(() => {
        if (!params.active) {
            const modal = params.target_new()
            const active = document.activeElement

            if (modal && active instanceof HTMLElement && modal.contains(active)) {
                ref_lastfocus.current = active
            }
        }
    }, [params.active, params.target_new])

    r.useEffect(() => {
        if (params.active) {
            if (ref_lastfocus.current) {
                ref_lastfocus.current.focus()

                ref_lastfocus.current = null
            } else {
                const taborder = focus_order_new(params.target_new())

                if (taborder.length >= 1) {
                    taborder[0]!.focus()
                } else {
                    if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur()
                    }
                }
            }
        }
    }, [params.active, params.target_new])
}

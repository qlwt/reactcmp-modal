import * as r from "react"

export type CmpFG_Styles = Readonly<{
    foreground?: string
}>

export type CmpFG_Props = Readonly<{
    styles?: CmpFG_Styles
    children?: r.ReactNode
    show_set?: (show: boolean) => void

    close_onpress?: boolean
    close_onescape?: boolean
    close_onescape_global?: boolean
}>

export const CmpFG = r.memo(r.forwardRef<HTMLDivElement, CmpFG_Props>((props, fref) => {
    const event_click = r.useCallback((event: r.MouseEvent) => {
        if ((props.close_onpress ?? true) && event.currentTarget === event.target) {
            props.show_set?.(false)
        }
    }, [])

    const event_keydown = r.useCallback((event: r.KeyboardEvent) => {
        if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
            return
        }

        switch (event.key.toLowerCase()) {
            case "space":
            case "enter": {
                if (props.close_onpress ?? true) {
                    event.preventDefault()

                    if (event.target === event.currentTarget) {
                        props.show_set?.(false)
                    }
                }

                break
            }
            case "escape": {
                if (props.close_onescape ?? true) {
                    event.preventDefault()

                    if ((props.close_onescape_global ?? true) || event.target === event.currentTarget) {
                        props.show_set?.(false)
                    }
                }

                break
            }
        }
    }, [])

    return <div
        ref={fref}
        tabIndex={1}
        className={props.styles?.foreground ?? "__modal_foreground"}

        onClick={event_click}
        onKeyDown={event_keydown}
    >
        {props.children}
    </div>
}))

export default CmpFG

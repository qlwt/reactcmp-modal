import { focus_order_new } from "#src/util/focus/order/new/index.js"

// get tab direction
const direction_new = function(event: KeyboardEvent): number {
    if (event.shiftKey) {
        return -1
    }

    return 1
}

export const focus_onkey = function(event: KeyboardEvent, target: EventTarget | null = event.currentTarget): void {
    if (event.altKey || event.ctrlKey || event.metaKey) {
        return
    }

    if (event.key.toLowerCase() === "tab") {
        event.preventDefault()

        const taborder = focus_order_new(target)
        const direction = direction_new(event)

        if (taborder.length >= 1) {
            if (document.activeElement instanceof HTMLElement) {
                const active_index = taborder.indexOf(document.activeElement)

                if (active_index === -1) {
                    taborder[0]!.focus()
                } else {
                    taborder.at((active_index + direction) % taborder.length)!.focus()
                }
            } else {
                taborder[0]!.focus()
            }
        }
    }
}

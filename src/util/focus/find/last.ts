import { focus_query } from "#src/util/focus/query.js"

export const focus_find_last = function(root: HTMLElement): HTMLElement | null {
    const query = root.querySelectorAll(focus_query)

    for (let i = query.length - 1; i >= 0; --i) {
        const node = query[i]!

        if (node instanceof HTMLElement && !node.closest(`[inert]`) && node.checkVisibility()) {
            return node
        }
    }

    return null
}

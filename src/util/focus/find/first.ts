import { focus_query } from "#src/util/focus/query.js"

export const focus_find_first = function(root: HTMLElement): HTMLElement | null {
    const query = root.querySelectorAll(focus_query)

    for (let i = 0; i < query.length; ++i) {
        const node = query[i]!

        if (node instanceof HTMLElement && !node.closest(`[inert]`) && node.checkVisibility()) {
            return node
        }
    }

    return null
}

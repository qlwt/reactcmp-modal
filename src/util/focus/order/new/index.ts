// get all nested children of element including element in unsorted tab order
const element_children = function*(target: EventTarget | null): IterableIterator<HTMLElement> {
    if (target) {
        if (target instanceof HTMLElement) {
            yield target
        }

        if (target instanceof Element) {
            for (let i = 0; i < target.children.length; ++i) {
                yield* element_children(target.children.item(i))
            }
        }
    }
}

// get all nested children of element including element in sorted tab order
export const focus_order_new = function(container: EventTarget | null): HTMLElement[] {
    const taborder: HTMLElement[] = []

    for (const target of element_children(container)) {
        if (target.tabIndex === -1) {
            continue
        }

        if (target.tabIndex === 0) {
            taborder.push(target)

            continue
        }

        let bi_low = 0
        let bi_high = taborder.length

        while (bi_high > bi_low) {
            const bi_mid = (bi_high + bi_low) >>> 1
            const bi_el = taborder[bi_mid]!

            if (bi_el.tabIndex === 0 || bi_el.tabIndex > target.tabIndex) {
                bi_high = bi_mid
            } else {
                bi_low = bi_mid + 1
            }
        }

        taborder.splice(bi_low, 0, target)
    }

    return taborder
}

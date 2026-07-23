import type { PropClMap } from "#src/util/prop/clmap/type/prop.js"

export type PropClMap_DefOverlay = PropClMap<keyof typeof prop_clmap_def_overlay>

export const prop_clmap_def_overlay = {
    __qyumdl: "__qyumdl",
    __qyumdl_body_inactive: "__qyumdl_body_inactive",

    overlay: "overlay",
    _hidden: "_hidden",
    _inactive: "_inactive",

    focusguard: "focusguard",
} as const

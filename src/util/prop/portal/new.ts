import type { Prop_Portal, Prop_Portal_Raw } from "#src/util/prop/portal/type/prop.js";

export const prop_portal_new = function (raw: Prop_Portal_Raw): Prop_Portal {
    if (typeof raw === "string") {
        return document.getElementById(raw)
    }

    if (raw) {
        return raw
    }

    return null
}

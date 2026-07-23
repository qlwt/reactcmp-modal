import type { PropClMap, PropClMap_Raw } from "#src/util/prop/clmap/type/prop.js"

export const prop_clmap_new = function <Def extends Readonly<Record<string, string>>>(
    stylemap: PropClMap_Raw<keyof Def>, def: Def
): PropClMap<keyof Def> {
    if (!stylemap) {
        return def
    }

    const result: Partial<PropClMap<keyof Def>> = {}

    for (const clname of Object.keys(def)) {
        const remaped = stylemap[clname]

        if (remaped !== undefined) {
            result[clname as keyof Def] = remaped

            continue
        }

        {
            result[clname as keyof Def] = clname
        }
    }

    return result as PropClMap<keyof Def>
}

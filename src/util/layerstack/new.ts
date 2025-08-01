type Subscription<T> = (
    (value: T) => void
)

type LayerData = {
    z: number
    active: boolean

    readonly top_subs: Set<Subscription<boolean>>
}

const layer_compare = function(a: LayerData, b: LayerData | null): boolean {
    if (!a.active) {
        return false
    }

    if (b === null || !b.active) {
        return true
    }

    return a.z >= b.z
}

const layer_emit_top = function(layer: LayerData, value: boolean): void {
    for (const sub of layer.top_subs) {
        sub(value)
    }
}

const layers_findtop = function(layers: readonly LayerData[]): LayerData | null {
    let top: null | LayerData = null

    for (let i = 0; i < layers.length; ++i) {
        const layer = layers[i]!

        if (layer_compare(layer, top)) {
            top = layer
        }
    }

    return top
}

export type LayerStack_Controls = {
    readonly delete: VoidFunction

    readonly z_get: () => number
    readonly z_set: (z: number) => void

    readonly active_get: () => boolean
    readonly active_set: (active: boolean) => void

    readonly top_get: () => boolean
    readonly top_sub: (sub: Subscription<boolean>) => VoidFunction
}

export type LayerStack = {
    push: (z: number, active: boolean) => LayerStack_Controls
}

export const layerstack_new = function(): LayerStack {
    const layers: LayerData[] = []

    let cache_top: LayerData | null = null

    return {
        push: (z, active) => {
            const layer: LayerData = {
                z,
                active,

                top_subs: new Set(),
            }

            // init
            {
                layers.push(layer)

                if (layer_compare(layer, cache_top)) {
                    const old_cache_top = cache_top

                    {
                        cache_top = layer
                    }

                    if (old_cache_top) {
                        layer_emit_top(old_cache_top, false)
                    }

                    layer_emit_top(layer, true)
                }
            }

            return {
                top_get: () => {
                    return cache_top === layer
                },

                top_sub: (sub) => {
                    layer.top_subs.add(sub)

                    return () => {
                        layer.top_subs.delete(sub)
                    }
                },

                delete: () => {
                    const self_index = layers.indexOf(layer)

                    if (self_index !== -1) {
                        {
                            layers.splice(self_index, 1)
                        }

                        if (cache_top === layer) {
                            const now_cache_top = layers_findtop(layers)

                            {
                                cache_top = now_cache_top
                            }

                            layer_emit_top(layer, false)

                            if (now_cache_top) {
                                layer_emit_top(now_cache_top, true)
                            }
                        }
                    }
                },

                z_get: () => {
                    return layer.z
                },

                z_set: z => {
                    const old_z = layer.z

                    {
                        layer.z = z
                    }

                    if (cache_top === layer) {
                        if (z < old_z) {
                            const now_cache_top = layers_findtop(layers)

                            {
                                cache_top = now_cache_top
                            }

                            if (now_cache_top !== layer) {
                                layer_emit_top(layer, false)

                                if (now_cache_top) {
                                    layer_emit_top(now_cache_top, true)
                                }
                            }
                        }
                    } else if (z > old_z && layer.active) {
                        const now_cache_top = layers_findtop(layers)
                        const old_cache_top = cache_top

                        if (now_cache_top === layer) {
                            {
                                cache_top = now_cache_top
                            }

                            if (old_cache_top) {
                                layer_emit_top(old_cache_top, false)
                            }

                            layer_emit_top(now_cache_top, true)
                        }
                    }
                },

                active_get: () => {
                    return layer.active
                },

                active_set: active => {
                    const old_active = layer.active

                    {
                        layer.active = active
                    }

                    if (old_active === true && active === false && cache_top === layer) {
                        const old_cache_top = cache_top
                        const now_cache_top = layers_findtop(layers)

                        {
                            cache_top = now_cache_top
                        }

                        layer_emit_top(old_cache_top, false)

                        if (now_cache_top) {
                            layer_emit_top(now_cache_top, true)
                        }
                    } else if (old_active === false && active === true) {
                        const old_cache_top = cache_top
                        const now_cache_top = layers_findtop(layers)

                        if (now_cache_top === layer) {
                            {
                                cache_top = now_cache_top
                            }

                            if (old_cache_top) {
                                layer_emit_top(old_cache_top, false)
                            }

                            layer_emit_top(now_cache_top, true)
                        }
                    }
                },
            }
        }
    }
}

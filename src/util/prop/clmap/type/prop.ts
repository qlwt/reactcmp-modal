export type PropClMap<ClName extends keyof any> = {
    [K in ClName]: string | null
}

export type PropClMap_Raw<ClName extends keyof any> = (
    | Partial<PropClMap<ClName>>
    | undefined
    | null
)

export const cl = function (...names: (string | false | null | undefined)[]): string | undefined {
    const result = names.filter(n => typeof n === "string")

    if (result.length === 0) {
        return undefined
    }

    return result.join(" ")
}

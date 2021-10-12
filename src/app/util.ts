export function fromZeroTo(to: number): number[] {
    // TODO: return the iterator keys() without expanding it [... ]
    return [...Array(to + 1).keys()]
}

export function fromTo(from: number, to: number): number[] {
    if (to < from) {
        return []
    } else {
        return [...Array(to - from + 1).keys()].map((_, i) => i + from)
    }
}
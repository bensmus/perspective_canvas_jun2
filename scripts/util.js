export function frac(x) {
    return x % 1
}

export function quantize(val, inc) {
    return Math.round(val / inc) * inc
}

export function mix(a, b, w) {
    return a + (b - a) * w    
}

export function rand_range(min, max) {
    return mix(min, max, Math.random())
}

// Oscillates between 0 and 1 with a period of 1.
export function triangle_wave(x) {
    return Math.abs(2 * frac(x) - 1)
}

export function scale_rgb(rgb, factor) {
    return {r: rgb.r * factor, g: rgb.g * factor, b: rgb.b * factor}
}

export function close(a, b, diff) {
    return Math.abs(a - b) < diff 
}

// Cube coordinates are between -1 and 1 so that transformations are easier.
// Make between 0 and 1.
export function normcube(cube_coor) {
    return (cube_coor + 1) / 2
}

export const max_distance = Math.sqrt(3)

export function vector_distance(x, y, z) {
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2)
}

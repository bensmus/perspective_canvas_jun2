function frac(x) {
    return x % 1
}

function quantize(val, inc) {
    return Math.round(val / inc) * inc
}

function mix(a, b, w) {
    return a + (b - a) * w    
}

function rand_range(min, max) {
    return mix(min, max, Math.random())
}

// Oscillates between 0 and 1 with a period of 1.
function triangle_wave(x) {
    return Math.abs(2 * frac(x) - 1)
}

function scale_rgb(rgb, factor) {
    return {r: rgb.r * factor, g: rgb.g * factor, b: rgb.b * factor}
}

function close(a, b, diff) {
    return Math.abs(a - b) < diff 
}

// Cube coordinates are between -1 and 1 so that transformations are easier.
// Make between 0 and 1.
function normcube(cube_coor) {
    return (cube_coor + 1) / 2
}

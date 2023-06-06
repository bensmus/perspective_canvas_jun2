// -------- all huefuncs  ---------- //
const huefuncs = [colorshift, onlyred]

function colorshift(x, y, z, t) {
    const dist_frac = vector_distance(x, y, z) / max_distance
    return ((triangle_wave(t / 30000) + dist_frac) / 2) ** 2
}

function onlyred(x, y, z, t) {
    return 0
}
// --------------------------------- //

let huefuncs_index = 0
const max_distance = Math.sqrt(3)

function huefuncs_get() {
    return huefuncs[huefuncs_index]
}

function huefuncs_next() {
    if (huefuncs_index == huefuncs.length - 1) {
        huefuncs_index = 0
    } else {
        huefuncs_index++   
    }
}

function frac(x) {
    return x - Math.floor(x)
}

function triangle_wave(x) {
    return Math.abs(2 * frac(x) - 1)
}

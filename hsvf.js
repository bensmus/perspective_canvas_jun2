// -------- all hsvf (hsv functions) ---------- //
const hsvfs = [colorshift, layerrunner]

function colorshift(x, y, z, t) {
    const dist_frac = vector_distance(x, y, z) / max_distance
    return {h: ((triangle_wave(t / 30000) + dist_frac) / 2) ** 2, s: 1, v: 1}
}

// a layer 'goes away' and then 'comes towards'
function layerrunner(x, y, z, t) {
    const shift = triangle_wave(t / 3000) * 2 - 1
    const v = -Math.abs(z - shift) + 1
    const vclamped = Math.max(0.4, v)
    const currentlayer = Math.floor(((z + 1) / 2) / 11) // todo
    return {h:0, s: 1, v: vclamped}
}

// ------------------------------------------- //

let hsvfs_index = 0
const max_distance = Math.sqrt(3)

function hsvf() {
    return hsvfs[hsvfs_index]
}

function hsvf_next() {
    if (hsvfs_index == hsvfs.length - 1) {
        hsvfs_index = 0
    } else {
        hsvfs_index++   
    }
}

function frac(x) {
    return x - Math.floor(x)
}

// oscillates between 0 and 1 with a period of 1
function triangle_wave(x) {
    return Math.abs(2 * frac(x) - 1)
}

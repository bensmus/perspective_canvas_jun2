// -------- all hsvf (hsv functions) ---------- //
const hsvfs = [colorshift, layerrunner]

function colorshift(x, y, z, t) {
    const dist_frac = vector_distance(x, y, z) / max_distance
    return {h: ((triangle_wave(t / 30000) + dist_frac) / 2) ** 2, s: 1, v: 1}
}

function quantize(val, inc) {
    return Math.round(val / inc) * inc
}

// a layer 'goes away' and then 'comes towards'
function layerrunner(x, y, z, t) {
    const runperiod = 2000 // how long to get from first layer to last layer in ms
    const layerfrac = triangle_wave(t / runperiod) 
    const layerz = quantize(
        layerfrac * 2 - 1, 
        1 / (grid_res.z - 1)
    )
    
    let h;
    const close = (val1, val2) => Math.abs(val1 - val2) < 1e-3 // ignore floating point errors
    if (close(z, layerz)) {
        h = 0.7
    } else {
        h = 0
    }
    return {h: h, s: 1, v: 1}
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

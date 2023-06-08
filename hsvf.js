// -------- all hsvf (hsv functions) ---------- //
const hsvfs = [colorshift, layerrunner, pulse]

function colorshift(x, y, z, t) {
    const distfrac = vector_distance(x, y, z) / max_distance
    return {h: ((triangle_wave(t / 30000) + distfrac) / 2) ** 2, s: 1, v: 1}
}

// a layer 'goes away' and then 'comes towards'
function layerrunner(x, y, z, t) {
    const period = 2000 // how long to get from first layer to last layer in ms
    const layerfrac = triangle_wave(t / period) 
    const layerz = layerfrac * 2 - 1
    
    // --- hue setting --- //
    const layerz_quantized = quantize( // the centered vectors are in rows, quantized
        layerz, 
        1 / (grid_res.z - 1)
    )
    
    let h;
    if (close(z, layerz_quantized, 1e-3)) { // ignore floating point errors
        h = 0.7
    } else {
        h = 0
    }

    // --- value setting --- //
    const value_function = (z) => Math.max(0.4, 1 / Math.abs(z - layerz)) 

    return {h: h, s: 1, v: value_function(z)}
}

// center pulses and the rest respond
function pulse(x, y, z, t) {
    const period = 1000
    const animparam = (Math.sin(t / period) + 1) / 2
    const distfrac = vector_distance(x, y, z) / max_distance
    return {h: 0, s: 0, v: 1 / (mix(1, 10, animparam) * distfrac)}
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

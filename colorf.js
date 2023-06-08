// -------- all colorf  ---------- //
const colorfs = [colorshift, layerrunner, pulse]

function colorshift(x, y, z, t) {
    const f = (x, p) => Math.abs(x - triangle_wave(t / p))
    rgb = scale_rgb({r: f(normcube(x), 4000), g: f(normcube(y), 6000), b: f(normcube(z), 10000)}, 255)
    return rgb
}

// a layer 'goes away' and then 'comes towards'
function layerrunner(x, y, z, t) {
    const period = 2000 // how long to get from first layer to last layer in ms
    const layerfrac = triangle_wave(t / period) 
    const layerz = layerfrac * 2 - 1
    
    const layerz_quantized = quantize( // the centered vectors are in rows, quantized
        layerz, 
        1 / (grid_res.z - 1)
    )
    
    let rgb;
    if (close(z, layerz_quantized, 1e-3)) { // ignore floating point errors
        rgb = {r: 0, g: 0, b: 255}
    } else {
        rgb = {r: 255, g: 0, b: 0}
    }

    const bright_factor = Math.max(0.4, 1 / Math.abs(z - layerz)) 
    return scale_rgb(rgb, bright_factor)
}

function pulse(x, y, z, t) {
    const period = 1000
    const distance = triangle_wave(t / period) * max_distance
    const distfrac = (vector_distance(x, y, z) - distance) / max_distance
    return scale_rgb({r: 255, g: 255, b: 255}, 1 / distfrac)
}

// ----------------------------- //
let colorfs_index = 0
const max_distance = Math.sqrt(3)

function colorf() {
    return colorfs[colorfs_index]
}

function colorf_next() {
    if (colorfs_index == colorfs.length - 1) {
        colorfs_index = 0
    } else {
        colorfs_index++   
    }
}

import * as util from './util.js'
import config from './config.js'

// -------- all colorf  ---------- //
const colorfs = [colorshift, layerrunner, pulse]

function colorshift(x, y, z, t) {
    const f = (x, p) => Math.abs(x - util.triangle_wave(t / p))
    const rgb = util.scale_rgb({r: f(util.normcube(x), 4000), g: f(util.normcube(y), 6000), b: f(util.normcube(z), 10000)}, 255)
    return rgb
}

// a layer 'goes away' and then 'comes towards'
function layerrunner(x, y, z, t) {
    const period = 2000 // how long to get from first layer to last layer in ms
    const layerfrac = util.triangle_wave(t / period) 
    const layerz = layerfrac * 2 - 1
    
    const layerz_quantized = util.quantize( // the centered vectors are in rows, quantized
        layerz, 
        1 / (config.grid_res.z - 1)
    )
    
    let rgb;
    if (util.close(z, layerz_quantized, 1e-3)) { // ignore floating point errors
        rgb = {r: 0, g: 0, b: 255}
    } else {
        rgb = {r: 255, g: 0, b: 0}
    }

    const bright_factor = Math.max(0.4, 1 / Math.abs(z - layerz)) 
    return util.scale_rgb(rgb, bright_factor)
}

function pulse(x, y, z, t) {
    const period = 1000
    const distance = util.triangle_wave(t / period) * util.max_distance
    const distfrac = (util.vector_distance(x, y, z) - distance) / util.max_distance
    return util.scale_rgb({r: 255, g: 255, b: 255}, 1 / distfrac)
}

// ----------------------------- //
let colorfs_counter = 0

export function colorf() {
    return colorfs[colorfs_counter % colorfs.length]
}

export function colorf_next() {
    colorfs_counter++
}

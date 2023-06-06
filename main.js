// --------- Keep track of what keys are pressed ------------ //
const keyboard_pressed = new Map([['w', false], ['s', false], ['d', false], ['a', false], ['e', false], ['q', false]])

document.addEventListener('keydown', (ev) => {
    if (keyboard_pressed.has(ev.key)) {
        keyboard_pressed.set(ev.key, true)
    }
})

document.addEventListener('keyup', (ev) => {
    if (keyboard_pressed.has(ev.key)) {
        keyboard_pressed.set(ev.key, false)
    }
})

document.addEventListener('keydown', (ev) => {
    if (ev.key == 'f' && !ev.repeat) {
        hsvf_next()
    }
})

// ---------------------------------------------------------- //

function mix(a, b, w) {
    return a + (b - a) * w    
}

function rand_range(min, max) {
    return mix(min, max, Math.random())
}

// spawn vectors from which poles eminate
function vector_grid({x: xcount, y: ycount, z: zcount}) {
    const vectors = Array(xcount * ycount )
    const xinc = 2 / (xcount - 1)
    const yinc = 2 / (ycount - 1)
    const zinc = 2 / (zcount - 1)
    for (let i = 0; i < xcount; i++) {
        for (let j = 0; j < ycount; j++) {
            for (let k = 0; k < zcount; k++) {
                vectors[k * ycount * xcount + (ycount * j + i)] = {
                    x: -1 + xinc * i, 
                    y: -1 + yinc * j, 
                    z: -1 + zinc * k
                }
            }
        }
    }
    return vectors
}

const rect_height = 0.04
const rect_width = 0.04
const fog_amount = 0.4

const initial_angle = Math.PI / 5
const intial_offset_x = -1.7
const intial_offset_z = 2.8

const grid_res = {x: 11, y: 11, z: 11} // good value 11, 11, 11
const centered_vectors = vector_grid(grid_res) // cube of vectors centered around origin
Object.freeze(centered_vectors)

 // cube of vectors that will be updated every time user moves world
let transformed_vectors = vector_grid(grid_res).map(
    ({x: x, y: y, z: z}) => ({x: x + intial_offset_x, y: y, z: z + intial_offset_z})
).map(
    ({x: x, y: y, z: z}) => ({x: x * Math.cos(initial_angle) + z * Math.sin(initial_angle), y: y, z: x * -Math.sin(initial_angle) + z * Math.cos(initial_angle)})
)

// return rect object from 3d vector
// rect object coordinates are not canvas-size-specific
function get_rect(vector) {
    if (vector.z > 0) {
        const rect_x = vector.x / vector.z
        const rect_y = vector.y / vector.z
        const rect_x_right = (vector.x + rect_width) / vector.z
        const rect_y_bottom = (vector.y + rect_height) / vector.z
        return {
            left: rect_x, 
            top: rect_y, 
            width: rect_x_right - rect_x,
            height: rect_y_bottom - rect_y,
            z: vector.z, // used by z-buffer
        }
    }
    return null
}

function vector_distance(x, y, z) {
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2)
}

// how bright should the rect at vector be?
// based on distance to rect midpoint
function distancedimmer(tx, ty, tz) {
    const distance = vector_distance(tx, ty + rect_height, tz)
    return mix(1, 1 - distance / max_distance, fog_amount)
}

const offset_mag_x = 0.001
const offset_mag_z = 0.002
const angle_mag = 0.003

let time = 0
const tick = 10

setInterval(() => {
    let offset_x = 0
    let offset_z = 0
    let angle = 0

    if (keyboard_pressed.get('w')) {
        offset_z -= offset_mag_z
    } 
    if (keyboard_pressed.get('s')) {
        offset_z += offset_mag_z
    }
    if (keyboard_pressed.get('d')) {
        offset_x -= offset_mag_x
    }
    if (keyboard_pressed.get('a')) {
        offset_x += offset_mag_x
    }
    if (keyboard_pressed.get('q')) {
        angle += angle_mag
    }
    if (keyboard_pressed.get('e')) {
        angle -= angle_mag
    }
    
    // transformations
    transformed_vectors = transformed_vectors.map(vector => ({
        // rotation
        x: vector.x * Math.cos(angle) + vector.z * Math.sin(angle),
        y: vector.y, 
        z: vector.x * -Math.sin(angle) + vector.z * Math.cos(angle)
    })).map(vector => ({
        // translation
        x: vector.x + offset_x, 
        y: vector.y, 
        z: vector.z + offset_z
    }))

    canvas_clear()
    transformed_vectors.forEach((vector, i) => {
        const {x: tx, y: ty, z: tz} = transformed_vectors[i]
        const {x: cx, y: cy, z: cz} = centered_vectors[i]
        const hsv = hsvf()(cx, cy, cz, time)
        const hsv_dimmed = {...hsv, v: hsv.v * distancedimmer(tx, ty, tz)}
        const hsv_dimmed_huescaled = {...hsv_dimmed, h: hsv_dimmed.h * 360}
        rect = get_rect(vector)
        if (rect) {
            canvas_drawrect({...rect, rgb: hsv2rgb(hsv_dimmed_huescaled)})
        }
    })
    canvas_update()
    time += tick;
}, tick)

// copied from: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately/54024653#54024653 (Kamil Kiełczewski)
// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,255]
function hsv2rgb({h: h, s: s, v: v}) {                              
    let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
    return {r: 255 * f(5), g: 255 * f(3), b: 255 * f(1)};       
}   

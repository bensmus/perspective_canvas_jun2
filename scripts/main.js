/*
Draws a bunch of squares spaced out on a 3D grid, which make up the shape of a cube.
Pressing keyboard moves the squares around (transforms the 3D grid).
*/

import config from "./config.js";
import { canvas_drawsquare, canvas_update, canvas_clear } from "./canvas.js";
import { colorf, colorf_next } from "./colorf.js";
import * as util from "./util.js"

// --------- keep track of what keys are pressed ------------ //

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
        colorf_next()
    }
})

// ---------------------------------------------------------- //

// spawn vectors from which squares eminate
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

const centered_vectors = vector_grid(config.grid_res) // cube of vectors centered around origin
Object.freeze(centered_vectors)

 // cube of vectors that will be updated every time user moves world
let transformed_vectors = vector_grid(config.grid_res).map(
    ({x: x, y: y, z: z}) => ({x: x + config.init_offset_x, y: y, z: z + config.init_offset_z})
).map(
    ({x: x, y: y, z: z}) => ({x: x * Math.cos(config.init_angle) + z * Math.sin(config.init_angle), y: y, z: x * -Math.sin(config.init_angle) + z * Math.cos(config.init_angle)})
)

// return square object from 3d vector
// square object coordinates are not canvas-size-specific
function get_square(vector) {
    if (vector.z > 0) {
        const square_x = vector.x / vector.z
        const square_y = vector.y / vector.z
        return {
            left: square_x, 
            top: square_y, 
            edge: config.square_edge / vector.z,
            z: vector.z, // used by z-buffer
        }
    }
    return null
}

// how bright should the square at vector be?
// based on distance to square midpoint
function distdim(tx, ty, tz) {
    const distance = util.vector_distance(tx, ty + config.square_edge, tz)
    return util.mix(1, 1 - distance / util.max_distance, config.fog_amount)
}

const offset_mag_x = 0.001
const offset_mag_z = 0.002
const angle_mag = 0.003

let time = 0
const tick = 10

// update square positions and draw them
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
        const rgb = colorf()(cx, cy, cz, time)
        const distdim_factor = distdim(tx, ty, tz)
        const rgb_dimmed = util.scale_rgb(rgb, distdim_factor)
        const square = get_square(vector)
        if (square) {
            canvas_drawsquare({...square, rgb: rgb_dimmed})
        }
    })
    canvas_update()
    time += tick;
}, tick)

function mix(a, b, w) {
    return a + (b - a) * w    
}

function rand_range(min, max) {
    return mix(min, max, Math.random())
}

// spawn vectors from which poles eminate
function vector_grid(xcount, ycount, zcount) {
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
                    z: -1 + zinc * k + 2.2} // poles ahead of camera
            }
        }
    }
    return vectors
}

// let vectors = Array(100).fill(0).map(e => {
//     const x = rand_range(-1, 1)
//     const y = rand_range(-1, 1)
//     const z = rand_range(-1, 1)
//     return {x: x, y: y, z: z}
// })


const pole_height = 0.05
const fog_amount = 0.4

let vectors = vector_grid(6, 6, 6)

// return pole object from 3d vector
function get_pole(v) {
    if (v.z > 0) {
        const pole_x = v.x / v.z
        const pole_y = v.y / v.z
        const pole_y_bottom = (v.y + pole_height) / v.z
        return {x: pole_x, y: pole_y, h: pole_y - pole_y_bottom, b: get_brightness(v)}
    }
    return null
}

// how bright should the pole at v be?
// based on distance to pole midpoint
function get_brightness(v) {
    const distance = Math.sqrt(v.x ** 2 + (v.y + pole_height / 2) ** 2 + v.z ** 2)
    const max_distance = Math.sqrt(3)
    return mix(1, 1-distance / max_distance, fog_amount)
}

const offset_delta_mag_x = 0.0007
const offset_delta_mag_z = 0.0012
const angle_delta_mag = 0.0025

const keyboard_pressed = new Map([['w', false], ['s', false], ['d', false], ['a', false], ['e', false], ['q', false]])
let keyboard_flag = false

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

setInterval(() => {
    let offset_delta_x = 0
    let offset_delta_z = 0
    let angle_delta = 0
    
    if (keyboard_pressed.get('w')) {
        offset_delta_z -= offset_delta_mag_z
    } 
    if (keyboard_pressed.get('s')) {
        offset_delta_z += offset_delta_mag_z
    }
    if (keyboard_pressed.get('d')) {
        offset_delta_x -= offset_delta_mag_x
    }
    if (keyboard_pressed.get('a')) {
        offset_delta_x += offset_delta_mag_x
    }
    if (keyboard_pressed.get('q')) {
        angle_delta += angle_delta_mag
    }
    if (keyboard_pressed.get('e')) {
        angle_delta -= angle_delta_mag
    }
    
    // transformations
    vectors = vectors.map(v => ({
        // translation
        x: v.x + offset_delta_x, 
        y: v.y, 
        z: v.z + offset_delta_z
    }))
    vectors = vectors.map(v => ({
        // rotation
        x: v.x * Math.cos(angle_delta) + v.z * Math.sin(angle_delta),
        y: v.y, 
        z: v.x * -Math.sin(angle_delta) + v.z * Math.cos(angle_delta)
    }))

    canvas_blackscreen()
    vectors.forEach(v => {
        pole = get_pole(v)
        if (pole) {
            canvas_drawpole(pole)
        }
    })
}, 10)

function rand_range(min, max) {
    return Math.random() * (max - min) + min
}

let vectors = Array(100).fill(0).map(e => {
    const x = rand_range(-1, 1)
    const y = rand_range(-1, 1)
    const z = rand_range(-1, 1)
    return {x: x, y: y, z: z}
})

const pole_height = 0.5

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
    return distance / max_distance
}

let world_offset = 0
let world_angle = 0
const offset_delta = 0.001
const angle_delta = 0.002

document.addEventListener('keypress', (ev) => {
    if (ev.key == 'w') {
        vectors = vectors.map(v => ({
            // translation along z axis
            x: v.x, 
            y: v.y, 
            z: v.z - offset_delta
        }))
    }
    if (ev.key == 's') {
        vectors = vectors.map(v => ({
            // translation along z axis
            x: v.x, 
            y: v.y, 
            z: v.z + offset_delta
        }))
    }
    if (ev.key == 'd') {
        vectors = vectors.map(v => ({
            // translation along z axis
            x: v.x - offset_delta, 
            y: v.y, 
            z: v.z
        }))
    }
    if (ev.key == 'a') {
        vectors = vectors.map(v => ({
            // translation along z axis
            x: v.x + offset_delta, 
            y: v.y, 
            z: v.z
        }))
    }
    if (ev.key == 'e') {
        vectors = vectors.map(v => ({
            // translation along z axis
            x: v.x * Math.cos(-angle_delta) + v.z * Math.sin(-angle_delta),
            y: v.y, 
            z: v.x * -Math.sin(-angle_delta) + v.z * Math.cos(-angle_delta)
        }))
    }
    if (ev.key == 'q') {
        vectors = vectors.map(v => ({
            // translation along z axis
            x: v.x * Math.cos(angle_delta) + v.z * Math.sin(angle_delta),
            y: v.y, 
            z: v.x * -Math.sin(angle_delta) + v.z * Math.cos(angle_delta)
        }))
    }
    canvas_whitescreen()
    vectors.forEach(v => {
        pole = get_pole(v)
        if (pole) {
            canvas_drawpole(pole)
        }
    })
})

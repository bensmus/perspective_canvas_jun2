function rand_range(min, max) {
    return Math.random() * (max - min) + min
}

const initial_vectors = Array(100).fill(0).map(e => {
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
const angle_delta = 0.001

document.addEventListener('keypress', (ev) => {
    if (ev.key == 'w') {
        world_offset -= offset_delta
    }
    else if (ev.key == 's') {
        world_offset += offset_delta
    }
    else if (ev.key == 'd') {
        world_angle -= angle_delta
    }
    else if (ev.key == 'a') {
        world_angle += angle_delta
    }
    const transformed_vectors = initial_vectors.map(v => ({
        // translation along z axis
        x: v.x, 
        y: v.y, 
        z: v.z + world_offset
    })).map(v => ({
        // rotation about y axis
        x: v.x * Math.cos(world_angle) + v.z * Math.sin(world_angle),
        y: v.y,
        z: v.x * -Math.sin(world_angle) + v.z * Math.cos(world_angle)
    }))
    canvas_whitescreen()
    transformed_vectors.forEach(v => {
        pole = get_pole(v)
        if (pole) {
            canvas_drawpole(pole)
        }
    })
})

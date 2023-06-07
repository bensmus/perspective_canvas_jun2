function frac(x) {
    return x - Math.floor(x)
}

function quantize(val, inc) {
    return Math.round(val / inc) * inc
}

function mix(a, b, w) {
    return a + (b - a) * w    
}

function rand_range(min, max) {
    return mix(min, max, Math.random())
}

// oscillates between 0 and 1 with a period of 1
function triangle_wave(x) {
    return Math.abs(2 * frac(x) - 1)
}

// copied from: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately/54024653#54024653 (Kamil Kiełczewski)
// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,255]
function hsv2rgb({h: h, s: s, v: v}) {                              
    let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
    return {r: 255 * f(5), g: 255 * f(3), b: 255 * f(1)};       
}

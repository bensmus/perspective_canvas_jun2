const info_open = document.getElementById('info_open')
const info_close = document.getElementById('info_close')
const info_text = document.getElementById('info_text')

info_close.addEventListener('click', () => {
    console.log('closing')
    info_close.style.display = 'none'
    info_text.style.display = 'none'
    info_open.style.display = 'block'
})

info_open.addEventListener('click', () => {
    console.log('opening')
    info_open.style.display = 'none'
    info_close.style.display = 'block'
    info_text.style.display = 'block'
})

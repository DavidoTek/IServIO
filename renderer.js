var submitbutton = document.getElementById('submitbutton')
var iservurltext = document.getElementById('iservurltext')
var darkmodeenable = document.getElementById('enabledarkmode')

submitbutton.addEventListener('click', () => {
    window.configset([iservurltext.value, darkmodeenable.checked])
})
var submitbutton = document.getElementById('submitbutton')
var iservurltext = document.getElementById('iservurltext')

submitbutton.addEventListener('click', () => {
    window.configset(iservurltext.value)
})
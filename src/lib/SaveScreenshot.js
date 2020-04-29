// demo the save screenshot feature
export function addScreenshotButton(webgl) {
    const screenshotButton = document.createElement('div')

    // normally the styles would be in style.css
    screenshotButton.style.position = 'fixed'
    screenshotButton.style.bottom = 0
    screenshotButton.style.right = 0
    screenshotButton.style.background = 'tomato'
    screenshotButton.style.cursor = 'pointer'
    screenshotButton.style.padding = '8px 16px'
    screenshotButton.style.color = 'white'
    screenshotButton.style.fontSize = '24px'

    screenshotButton.textContent = 'Save screenshot'
    document.body.appendChild(screenshotButton)
    screenshotButton.addEventListener('click', webgl.saveScreenshot)
}

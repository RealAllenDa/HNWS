class SVGToPNG {
  static download = function(src, fileName, download = true) {
    const img = new Image()

    img.onload = function() {
      const canvas = SVGToPNG.#convertImageToCanvas(img)
      const pngImage = SVGToPNG.#convertCanvasToImage(canvas)

      if (download) {
        const anchor = document.createElement('a')
        anchor.setAttribute('href', pngImage.src)
        anchor.setAttribute('download', fileName)
        anchor.click()
      } else {
        setTimeout(() => {
          window.dataURL = pngImage.src
        }, 2000)
      }
    }

    img.src = src
  }

  static #convertImageToCanvas = function(image) {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    canvas.getContext('2d').drawImage(image, 0, 0)
    return canvas
  }

  static #convertCanvasToImage = function(canvas) {
    const image = new Image()
    image.src = canvas.toDataURL('image/png')
    return image
  }
}

export default SVGToPNG

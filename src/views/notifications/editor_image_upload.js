import store from '@/store/index.js'

export default class UploadAdapter {
  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          const data = new FormData()

          data.append('picture', file)
          data.append('image_path', 'newstemp')
          store
            .dispatch('UPLOAD_IMAGE', data)
            .then(response => {
              resolve({
                default: response.data.url
              })
            })
            .catch(error => {
              reject(error)
            })
        })
    )
  }
}

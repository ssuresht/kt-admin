import axios from 'axios'

export default class UploadAdapter {
  constructor(loader) {
    this.loader = loader
  }

  upload() {
    return this.loader.file.then(uploadedFile => {
      return new Promise((resolve, reject) => {
        const data = new FormData()
        data.append('image', uploadedFile)

        axios({
          url: '',
          method: 'post',
          data,
          headers: {
            'Content-Type': 'multipart/form-data;'
          },
          withCredentials: false
        })
          .then(response => {
            if (response.status === 200) {
              resolve({
                default: response.data.data.image
              })
            } else {
              reject(response.data.message)
            }
          })
          .catch(response => {
            reject('Upload failed')
          })
      })
    })
  }

  abort() {}
}

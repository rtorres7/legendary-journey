import { ref } from 'vue'

export default function () {
  const files = ref([])

  const fileExists = (otherId) => {
    return files.value.some(({ id }) => id === otherId)
  }

  const removeFile = (file) => {
    const index = files.value.indexOf(file)
    if (index > -1) {
      files.value.splice(index, 1)
    }
  }

  const addFiles = (newFiles) => {
    let newUploadableFiles = [...newFiles].map((file) => new UploadableFile(file)).filter((file) => !fileExists(file.id))
    files.value = files.value.concat(newUploadableFiles)
  }

  return { files, addFiles, removeFile }
}

class UploadableFile {
  constructor(file) {
    this.file = file
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`
    this.url = URL.createObjectURL(file)
    this.status = null
  }
}

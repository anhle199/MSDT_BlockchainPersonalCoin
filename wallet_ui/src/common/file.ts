export const exportFileFromData = (content: any, filename: string) => {
  const fileData = JSON.stringify(content)
  const blob = new Blob([fileData], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
}

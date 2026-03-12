export function getFileExtension(filename = '') {
  const index = filename.lastIndexOf('.')
  return index > -1 ? filename.slice(index + 1).toUpperCase() : 'FILE'
}
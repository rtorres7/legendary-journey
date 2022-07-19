export const delay = (fn) => {
  console.log('Delay Function: ', fn)
  return setTimeout(fn, 3000)
}

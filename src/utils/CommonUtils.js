export function nestedArrayDeepCopy (array) {
    let newArray = []
    array.forEach(function (elem) {
      newArray.push(Object.assign({}, elem))
    })
    return array
}
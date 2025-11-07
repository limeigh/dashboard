let head = document.createElement('head')
  let suffix = `0.0.0-dataease`


  const getPrefix = () => {
    let prefix = ''
    Array.from(document.querySelector('head').children).some(ele => {
      if (['SCRIPT', 'LINK'].includes(ele.nodeName)) {
        let url = ''
        if (ele.nodeName === 'LINK') {
          url = ele.href
        } else if (ele.nodeName === 'SCRIPT') {
          url = ele.src
        }
        if (url.includes(suffix)) {
          prefix = new URL(url).origin
          const index = url.indexOf(`/js/div_import_0.0.0-dataease`)
          if (index > 0) {
            prefix = url.substring(0, index)
          }
          return true
        }
      }
    })
    return prefix
  }

  const eleArrStr = [{"name":"script","attributes":{"type":"module","crossorigin":"","src":"./js/panel-0.0.0-dataease.js"}},{"name":"link","attributes":{"rel":"stylesheet","href":"./assets/css/style-0.0.0-dataease.css"}}]
  const eleArr = eleArrStr
  const preUrl = getPrefix()
  
  function produceTag(obj, name) {
    let element = document.createElement(name)
    Object.entries(obj).forEach(([key, value]) => {
      if (['href', 'src'].includes(key)) {
        const relativeVal = value.startsWith('./') ? value.substr(1) : value
        element[key] = `${preUrl}${relativeVal}`
      } else {
        element.setAttribute(key, value || '')
      }
    })
    element.setAttribute('crossorigin', '')
    head.appendChild(element)
  }
  
  eleArr.forEach((ele) => {
    produceTag(ele.attributes, ele.name)
  })
  document.documentElement.insertBefore(head, document.querySelector('body'))
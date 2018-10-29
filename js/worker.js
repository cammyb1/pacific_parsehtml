window.onload = () => loadPage()

var base_model = {
  translations:{
    es:{
      reading:{}
    },
    en:{},
    fr:{},
    ge:{}
  }
}

function loadPage(){
  let div = document.getElementById('result')
  window.counter = 0

  w1.send.addEventListener("click", (e) => {
    e.preventDefault()
    handleValue(w1.texto.value, div)
  }, false)
}

function stripTags(value){
  let div = document.createElement("div")
  div.innerHTML = value
  return div.textContent || div.innerText
}

function insertInto(a, b, position){
  return [a.slice(0, position), b, a.slice(position)].join('');
}

function envolveByTag(tag, value){
  return "<"+tag+">"+value+"</"+tag+">"
}

function countWordsOf(value){
  var regex = /\s+/gi;
  return value.trim().replace(regex, ' ').split(' ').length;
}

function stripRedValues(value, tag){
  let div = document.createElement("div")
  div.innerHTML = value

  let tagElements = div.getElementsByTagName(tag)

  for(let ind of tagElements){
    if(ind.style.color=="rgb(255, 0, 0)") {
      console.log(ind.innerHTML)
      ind.remove()
    }
  }

  return div.innerHTML
}

function checkForIcon(line){
  let data = null
  ICON_NAMES.map((icon, index) => {
    if(line.includes(icon)){
      data={
        striped:line.replace(icon, ICONS[index])
      }
    }
  })

  return data
}

function handleValue(value, result){
  window.counter++

  let lines = value.split("\n")
  let filtered = lines.filter(line => line!== "")
  let includeGreen = false
  let includeRed = false

  for (let ind= 0 ; ind < filtered.length; ind++){

    //hasIcon
    let icon = checkForIcon(filtered[ind])
    if (icon){
      filtered[ind] = icon.striped
    }

    //REMOVE RED WORDS
    includeRed = filtered[ind].includes("color: #ff0000")

    if (includeRed){
      filtered[ind] = stripRedValues(filtered[ind], "span")
    }

    POSIBLE_GREENS.map(green => {
      includeGreen = filtered[ind].includes("color: "+green)
    })

    if(includeGreen){
      filtered[ind] = stripTags(filtered[ind])
      filtered[ind] = envolveByTag("p", filtered[ind])
    }

  }

  let data = filtered.slice(1, lines.length).join("")

  base_model.translations.es.reading["reading"+window.counter] = {
    title: stripTags(lines[0]),
    description: data,
    pdfUrl:"",
    words: countWordsOf(data).toString(),
  }
  result.innerHTML = JSON.stringify(base_model, null, 4)
}

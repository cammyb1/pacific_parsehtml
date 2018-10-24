window.onload = () => loadPage()

var base_model = {
  translations:{
    es:{
      reading:{}
    },
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
  return value.replace(/(<([^>]+)>)/ig,"")
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

function textBetweenTags(value){
  var regex = /(<([^>]+)>)(.*?)(<([^>]+)>)/g

  return value.replace(regex, '/')
}

function handleValue(value, result){
  window.counter++

  let lines = value.split("\n")
  let filtered = lines.filter(line => line!== "")

  for (let ind= 0 ; ind < filtered.length; ind++){

    //CITA
    if (filtered[ind].includes("<p>&ldquo;")){
      let icon = "<pacific-icon-cita></pacific-icon-cita>"
      filtered[ind] = insertInto(filtered[ind], icon, 3)
    }

    //REMOVE RED WORDS
    if (filtered[ind].includes("color: #ff0000")){
      let badWords = textBetweenTags(filtered[ind]).split("/").filter(l =>{
        return l!=="" && filtered[ind].includes("color: #ff0000;\">"+l)
      })

      filtered[ind] = stripTags(filtered[ind])
      badWords.map(word => filtered[ind] = filtered[ind].replace(word, ''))

      filtered[ind] = envolveByTag("p", filtered[ind])
    }

    if(filtered[ind].includes("color: #00b050")){
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

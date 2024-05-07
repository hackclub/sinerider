const LANGUAGE = localStorage.getItem('language') ?? 'en';

function tn(spec) {
  if (spec[LANGUAGE] == undefined) {
    return spec.en
  }
  return spec[LANGUAGE]
}

const translations = {
  'veil-feedback': {
    es: '¿Ideas? ¿Comentario? ¿Asuntos? Envíalos a '
  },
  'puzzles-text': {
    es: 'Nuevos rompecabezas publicados diariamente en'
  },
  'github-link': {
    es: 'Construido y mantenido por adolescentes. Versión 1.0'
  }
}

function getTextNode(elem) {
  for (const node of elem.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== ''){
      return node
    }
  }
}

function tnHTML(id) {
  getTextNode(document.getElementById(id)).nodeValue = tn(translations[id])
}

if (LANGUAGE !== "en") {
  const elems = document.body.querySelectorAll("*[data-tn]");

  for (const elem of elems) {
    tnHTML(elem.id)
  }
}

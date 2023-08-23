const LANGUAGE = 'en'

function tn(spec) {
  if (spec[LANGUAGE] == undefined) {
    return spec.en
  }
  return spec[LANGUAGE]
}
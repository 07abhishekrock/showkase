const fs = require('fs')
const XmlTemplateParser = require('./node_modules/xml-template-to-editor/build/main/converter').XmlTemplateParser

const xmlTemplateParser = new XmlTemplateParser()

const fileContent = fs.readFileSync('./xml-sources/appbar.xml', {encoding: 'utf-8'})

xmlTemplateParser.parseXML(fileContent)
fs.writeFileSync("./final.json", JSON.stringify(xmlTemplateParser.findAllTemplates()), {encoding: 'utf-8'})
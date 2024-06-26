import { ArrayTemplate, ComponentChildTemplate, ComponentTemplate, DummyTemplate, HardCodedTemplate, NumberTemplate, ObjectPropertyTemplate, ObjectTemplate, OptionsTemplate, ReferentialTemplate, StringTemplate } from "./types";
import {
     parse
} from 'node-html-parser'

const STRING_INJECT = "[string]";
const NUMBER_INJECT = "[number]";


export class XmlTemplateParser {

     xmlDom: HTMLElement

     parseXML = (xml: string): void => {
          //@ts-expect-error
          this.xmlDom = parse(xml)
     }

     getAttributeRecordForComponentTemplate = (template: Element): Record<string, string> => {
          return Array.from(Object.entries(template.attributes))
               .filter(s => {
                    return (s[0] != "type") && (!s[0].startsWith('showkase:'))
               })
               .reduce((pObj, [p, pV]) => {
                    pObj[p] = pV
                    return pObj
               }, {})
     }

     findAllChildTemplates = (element: Element): ComponentChildTemplate[] => {
          const children = element.childNodes

          return Array.from(children)
          // remove the text node, not needed.
          .map<ComponentChildTemplate | undefined>(cTemplate => {

               if(1 !== cTemplate.nodeType && cTemplate.textContent.trim().length != 0){
                    return {
                         type: 'component-child-text'
                    }
               }

               else if(1 == cTemplate.nodeType){

                    return {
                         type: 'component-child' as const,
                         name: (cTemplate as HTMLElement).getAttribute('showkase:name'),
                         children: (cTemplate as HTMLElement).childNodes.length > 0 ? this.findAllChildTemplates(cTemplate as HTMLElement) : [],
                         props: this.parseAllTemplateProps(this.getAttributeRecordForComponentTemplate(cTemplate as HTMLElement))
                    }
               }

               return undefined
          }).filter(s=>s)
     }

     findAllTemplates = (): ComponentTemplate[] => {

          const templates = this.xmlDom.querySelectorAll('[type="template"]')

          return Array.from(templates)
               .filter(temp=>temp.hasAttribute('showkase:name'))
               .map<ComponentTemplate>((template, templateIndx) => {

                    console.log({template: template.childNodes})

                    return {
                         type: 'component' as const,
                         name: template.getAttribute('showkase:name'),
                         id: template.getAttribute('showkase:id'),
                         children: this.findAllChildTemplates(template),
                         props: this.parseAllTemplateProps(this.getAttributeRecordForComponentTemplate(template))
                    }

               })

     }

     createHardCodedTextTemplate = (hardCodedValue: string): HardCodedTemplate => {
          return {
               type: 'hard-coded',
               value: hardCodedValue
          }
     }

     createStringTemplate = (defaultValue?: string): StringTemplate => {
          return {
               type: 'string',
               defaultValue: defaultValue ?? ''
          }
     }

     createNumberTemplate = (defaultValue?: number): NumberTemplate => {
          return {
               type: 'number',
               defaultValue: defaultValue ?? 0
          }
     }

     createArrayTemplate = (refName: string): ArrayTemplate => {

          const itemNodes = Array.from(this.xmlDom.querySelectorAll(`${refName} > item`))

          const items = itemNodes.map<ArrayTemplate['items'][0]>((itemN) => {

               if (itemN.hasAttribute('ref')) {
                    return this.createRefTemplate(itemN.getAttribute('ref'))
               }

               const innerTextContent = itemN.innerHTML

               if (innerTextContent == STRING_INJECT) {
                    return this.createStringTemplate('')
               }

               if (innerTextContent == NUMBER_INJECT) {
                    return this.createNumberTemplate(0)
               }

               return this.createHardCodedTextTemplate(innerTextContent)

          })

          return {
               type: 'array',
               items,
               ref: refName
          }

     }

     createOptionsTemplate = (refName: string): OptionsTemplate => {

          const optionNodes = Array.from(this.xmlDom.querySelectorAll(`${refName} > option`))

          //@ts-expect-error
          const options = optionNodes.map<OptionsTemplate['options'][0]>((optionN) => {

               if (optionN.hasAttribute('ref')) {
                    return this.createRefTemplate(optionN.getAttribute('ref'))
               }

               const innerTextContent = optionN.innerHTML

               if (innerTextContent == STRING_INJECT) {
                    return this.createStringTemplate('')
               }

               if (innerTextContent == NUMBER_INJECT) {
                    return this.createNumberTemplate(0)
               }

               return this.createHardCodedTextTemplate(innerTextContent)

          })

          return {
               type: 'options',
               options,
               ref: refName
          }

     }

     createRefTemplate = (refName: string): ReferentialTemplate => {

          const refNode = this.xmlDom.querySelector(refName)

          const refType = refNode.getAttribute('type')

          switch (refType) {
               case 'object': return this.createObjectTemplate(refName)
               case 'dummy': return this.createDummyTemplate(refName, refNode.innerHTML)
               case 'array': return this.createArrayTemplate(refName)
               case 'options': return this.createOptionsTemplate(refName)
               default: throw new Error(`This type is not supported ${refType}`)
          }


     }

     createDummyTemplate = (ref: string, value: string): DummyTemplate => {
          return {
               type: 'dummy',
               ref,
               valueToPut: value
          }
     }

     readAllProps = (refName: string): Record<string, ObjectPropertyTemplate> => {

          const propNodes = Array.from(this.xmlDom.querySelectorAll(`${refName} > prop`))

          const props = propNodes.map<ObjectPropertyTemplate>((propNode) => {

               if (propNode.hasChildNodes) {

                    let firstChildNode = propNode.children[0]

                    if (firstChildNode.textContent === STRING_INJECT) {
                         return {
                              name: propNode.getAttribute('name'),
                              type: 'object-property',
                              value: this.createStringTemplate('')
                         }
                    }

                    else if (firstChildNode.textContent === NUMBER_INJECT) {
                         return {
                              name: propNode.getAttribute('name'),
                              type: 'object-property',
                              value: this.createNumberTemplate(0)
                         }
                    }

                    return {
                         name: propNode.getAttribute('name'),
                         type: 'object-property',
                         value: this.createStringTemplate('')
                    }

               }
               else if (propNode.getAttribute('ref')) {
                    return {
                         name: propNode.getAttribute('name'),
                         type: 'object-property',
                         value: this.createRefTemplate(propNode.getAttribute('ref'))
                    }
               }
               return {
                    name: propNode.getAttribute('name'),
                    type: 'object-property',
                    value: this.createStringTemplate('')
               }

          })

          return props.reduce((record, prop) => {
               record[prop.name] = prop
               return record
          }, {})
     }

     createObjectTemplate = (ref: string): ObjectTemplate => {

          return {
               type: 'object',
               ref,
               props: this.readAllProps(ref)
          }

     }

     parseAllTemplateProps = (props: Record<string, string>): ComponentTemplate['props'] => {

          return Object.entries(props)
               .reduce((finalProps, [key, value]) => {
                    if (value === STRING_INJECT) {
                         finalProps[key] = this.createStringTemplate('')
                    }

                    else if (value === NUMBER_INJECT) {
                         finalProps[key] = this.createNumberTemplate(0)
                    }

                    else if (value.startsWith('$')) {
                         finalProps[key] = this.createRefTemplate(value.slice(1))
                    }

                    else {
                         finalProps[key] = this.createHardCodedTextTemplate(value)
                    }

                    return finalProps

               }, {})
     }

}
import { ComponentTemplate, NumberTemplate, ObjectTemplate, ReferentialTemplate, StringTemplate } from "./types";

const STRING_INJECT = "[string]";
const NUMBER_INJECT = "[number]";

const parseXML(xml: string){
     const xmlDom = (new DOMParser().parseFromString(xml, 'text/xml'))
}

const findAllTemplates = (dom: Document): ComponentTemplate[] => {

     const templates = dom.querySelectorAll('[type="template"]')

     return Array.from(templates)
     .map<ComponentTemplate>(template=>{

          return {
               props: 
          }

     })

}

const createStringTemplate = (defaultValue?: string): StringTemplate => {
     return {
          type: 'string',
          value: defaultValue ?? ''
     }
}

const createNumberTemplate = (defaultValue?: number): NumberTemplate => {
     return {
          type: 'number',
          value: defaultValue ?? 0
     }
}

const createRefTemplate = (refName: string): ReferentialTemplate => {
     let xmlDom: Document;

     const refNode = xmlDom.querySelector(refName)

     switch(refNode.getAttribute('type')) {
          case 'object': return createObjectTemplate()
     }


}

const createObjectTemplate = (ref: string): ObjectTemplate=>{

     return {
          type: 'object', 
          ref,
          props: readAllProps()
     }

}

const parseAllTemplateProps = (props: Record<string, string>): ComponentTemplate['props']=>{

     return Object.entries(props)
     .reduce((finalProps, [key, value])=>{
          if(value === STRING_INJECT) {
               finalProps[key] = createStringTemplate('')
          }
          
          else if(value === NUMBER_INJECT) {
               finalProps[key] = createNumberTemplate(0)
          }

          else if(value.startsWith('$')) {
               finalProps[key] = createRefTemplate()
          }

     }, {})
}
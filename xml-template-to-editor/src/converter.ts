import { ComponentTemplate, NumberTemplate, ObjectPropertyTemplate, ObjectTemplate, ReferentialTemplate, StringTemplate } from "./types";

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

const createDummyTemplate = ()=>{

}

const readAllProps = (childNodes: Element[]): ObjectPropertyTemplate[]=>{
     return childNodes.map<ObjectPropertyTemplate>((childNode)=>{

          if(childNode.hasChildNodes){

               let firstChildNode = childNode.children[0]

               if(firstChildNode.textContent === STRING_INJECT){
                    return {
                         name: childNode.getAttribute('name'),
                         type: 'object-property',
                         value: createStringTemplate('')
                    }
               }

               else if(firstChildNode.textContent === NUMBER_INJECT) {
                    return {
                         name: childNode.getAttribute('name'),
                         type: 'object-property',
                         value: createNumberTemplate(0)
                    }
               }

               return {
                    name: childNode.getAttribute('name'),
                    type: 'object-property',
                    value: createStringTemplate('')
               }

          }
          else if(childNode.getAttribute('ref')){
               return {
                    name: childNode.getAttribute('name'),
                    type: 'object-property',
                    value: createRefTemplate(childNode.getAttribute('ref'))
               }
          }
          return {
               name: childNode.getAttribute('name'),
               type: 'object-property',
               value: 
          }

     })
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
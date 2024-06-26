// read all xml source files

// feed them into editor

export type ArrayTemplate = {
     type: 'array';
     ref: string;
     items: Template[];
}

export type DummyTemplate = {
     type: 'dummy';
     ref: string;
     valueToPut: string
}

export type OptionsTemplate = {
     type: 'options';
     ref: string;
     options: SingleOptionTemplate[]
}

export type Template = 
StringTemplate |
NumberTemplate | 
ReferentialTemplate

export type ReferentialTemplate = 
ObjectTemplate | 
ArrayTemplate | 
OptionsTemplate |
DummyTemplate |
HardCodedTemplate

export type HardCodedTemplate = {
     type: 'hard-coded',
     value: string
}

export type SingleOptionTemplate = {
     type: 'single-option';
     value: Template
}

export type NumberTemplate = {
     type: 'number'; 
     defaultValue: number;
}

export type StringTemplate = {
     type: 'string';
     defaultValue: string;
}

export type ObjectTemplate = {
     type: 'object';
     ref: string;
     props: Record<string, ObjectPropertyTemplate>;
}

export type ComponentTemplate = {
     type: 'component';
     props: Record<string, Template>;
     name: string;
     id: string;
     children: ComponentChildTemplate[]
}

export type ObjectPropertyTemplate = {
     type: 'object-property';
     name: string;
     value: Template;
}

export type ComponentChildTemplate = {
     type: 'component-child';
     props: Record<string, Template>;
     name: string;
     children: ComponentChildTemplate[]
} | {
     type: 'component-child-text',
}
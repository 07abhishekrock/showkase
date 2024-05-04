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
     name: string;
     options: SingleOptionTemplate[]
}

export type Template = 
StringTemplate |
ObjectTemplate |
ArrayTemplate |
NumberTemplate | 
OptionsTemplate

export type ReferentialTemplate = 
ObjectTemplate | 
ArrayTemplate | 
OptionsTemplate

export type SingleOptionTemplate = {
     type: 'single-option';
     value: Template
}

export type NumberTemplate = {
     type: 'number'; 
     value: number;
}

export type StringTemplate = {
     type: 'string';
     value: string;
}

export type ObjectTemplate = {
     type: 'object';
     ref: string;
     props: Record<string, Template>;
}

export type ComponentTemplate = {
     type: 'component';
     props: Record<string, Template>;
}

import SXIdentified from './SXIdentified'

import { Types, Predicates, Specifiers } from 'bioterms'
import SBOLXGraph from "../SBOLXGraph";

import * as triple from '../triple'

export default class SXModel extends SXIdentified {

    constructor(graph:SBOLXGraph, uri:string) {

        super(graph, uri)
    }

    get facadeType():string {
        return Types.SBOLX.Model
    }

    get framework(): string|undefined {
        return this.getUriProperty(Predicates.SBOLX.framework)
    }

    set framework(framework: string|undefined) {
        this.setUriProperty(Predicates.SBOLX.framework, framework)
    }

    get language():string|undefined {
        return this.getUriProperty(Predicates.SBOLX.language)
    }

    set language(language:string|undefined) {
        this.setUriProperty(Predicates.SBOLX.language, language)
    }

    get source():string|undefined {
        return this.getUriProperty(Predicates.SBOLX.source)
    }

    set source(source:string|undefined) {
        this.setUriProperty(Predicates.SBOLX.source, source)
    }

}


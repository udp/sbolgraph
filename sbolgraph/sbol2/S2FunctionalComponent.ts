import SBOL2GraphView from '../SBOL2GraphView';

import S2Identified from './S2Identified'
import S2ComponentDefinition from './S2ComponentDefinition'
import S2ModuleDefinition from './S2ModuleDefinition'
import S2MapsTo from './S2MapsTo'
import S2Participation from './S2Participation'

import { triple, node } from 'rdfoo'
import { Types, Predicates, Specifiers, Prefixes } from 'bioterms'
import S2Interaction from "./S2Interaction";
import S2IdentifiedFactory from './S2IdentifiedFactory';
import S2ComponentInstance from './S2ComponentInstance';
import S2Measure from './S2Measure';

export default class S2FunctionalComponent extends S2Identified {

    constructor(view:SBOL2GraphView, uri:string) {

        super(view, uri)

        this.direction = Specifiers.SBOL2.Direction.InputAndOutput
        this.access = Specifiers.SBOL2.Access.PublicAccess
    }

    get facadeType():string {
        return Types.SBOL2.FunctionalComponent
    }


    get access():string|undefined {
        return this.getUriProperty(Predicates.SBOL2.access)
    }

    set access(access:string|undefined) {

        if(access === undefined) {
            this.deleteProperty(Predicates.SBOL2.access)
        } else {
            this.setUriProperty(Predicates.SBOL2.access, access)
        }
    }

    get direction():string|undefined {
        return this.getUriProperty(Prefixes.sbol2 + 'direction')
    }

    set direction(direction:string|undefined) {

        if(direction === undefined) {
            this.deleteProperty(Prefixes.sbol2 + 'direction')
        } else {
            this.setUriProperty(Prefixes.sbol2 + 'direction', direction)
        }
    }


    get displayName():string {

        const name = this.name

        if(name)
            return name

        const def = this.definition

        const defName = def.name
        
        if(defName)
            return defName

        return this.displayId || ''
    }

    get definition():S2ComponentDefinition {

        const uri = this.getUriProperty(Predicates.SBOL2.definition)

        if(!uri) {
            throw new Error('fc ' + this.uri + ' has no def?')
        }

        return new S2ComponentDefinition(this.view, uri)
    }
    
    set definition(definition:S2ComponentDefinition) {
        this.setUriProperty(Prefixes.sbol2 + 'definition', definition.uri)
    }

    get mappings():Array<S2MapsTo> {

        return this.view.graph.match(null, Predicates.SBOL2.local, this.uri).map(triple.subjectUri)
                .concat(
                    this.view.graph.match(null, Predicates.SBOL2.remote, this.uri).map(triple.subjectUri)
                )
                .filter((el) => !!el)
                .map((mapsToUri) => new S2MapsTo(this.view, mapsToUri as string))
    }

    createMapping(local:S2FunctionalComponent, remote:S2ComponentInstance, refinement:string):S2MapsTo {
 
        let id = local.displayId + '_mapsto_' + remote.displayId

        let identified = S2IdentifiedFactory.createChild(this.view, Types.SBOL2.MapsTo, this, id, id, this.version)

        let mapsTo = new S2MapsTo(this.view, identified.uri)

        mapsTo.local = local
        mapsTo.remote = remote
        mapsTo.refinement =refinement

        return mapsTo
    }

    get containingModuleDefinition():S2ModuleDefinition {

        const uri = triple.subjectUri(
            this.view.graph.matchOne(null, Predicates.SBOL2.functionalComponent, this.uri)
        )

        if(!uri) {
            throw new Error('FC ' + this.uri + ' not contained by a MD?')
        }

        return new S2ModuleDefinition(this.view, uri)
    }



    get participations():Array<S2Participation> {

        return this.view.graph.match(null, Predicates.SBOL2.participant, this.uri)
                   .map(triple.subjectUri)
                   .map((uri) => uri ? new S2Participation(this.view, uri): undefined)
                   .filter((el) => !!el) as Array<S2Participation>
    }

    get interactions():Array<S2Interaction> {

        return this.participations.map((participation) => participation.interaction).filter((el) => !!el) as Array<S2Interaction>
    }

    get containingObject():S2Identified|undefined {

        return this.containingModuleDefinition

    }

    get measure():S2Measure|undefined {
        let measure = this.getUriProperty(Predicates.SBOL2.measure)

        if(measure === undefined)
            return
        
        return new S2Measure(this.view, measure)
    }

    set measure(measure:S2Measure|undefined) {

        if(measure === undefined)
            this.deleteProperty(Predicates.SBOL2.measure)
        else
            this.setUriProperty(Predicates.SBOL2.measure, measure.uri)

    }

}



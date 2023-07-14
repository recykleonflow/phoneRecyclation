import {PhoneQuery} from '../../../../../libs/shared_models/model/phone-query.model';

function filterByQuery(phoneQuery: PhoneQuery): string {
    if (phoneQuery.query !== 'null') {
        return `FILTER (
                  REGEX(?model, "${phoneQuery.query}", "i") || 
                  REGEX(?imei, "${phoneQuery.query}", "i") ||
                  REGEX(?state, "${phoneQuery.query}", "i") ||
                  REGEX(?visualCondition, "${phoneQuery.query}", "i")
                )`
    } else {
        return ''
    }
}

export const getByState = (stateId: string) => `
    PREFIX schema: <http://schema.org/>
        CONSTRUCT { ?s ?p ?o }
        WHERE {
            {
                GRAPH <assertion:${stateId}>
                { ?s ?p ?o . }
            }
        }
`

export const getTotalCountGroups = (phoneQuery: PhoneQuery) => `
    PREFIX mp: <http://recykle.rocks/mobilephone/>
    PREFIX schema: <http://schema.org/>
    
    SELECT (COUNT(?phone) as ?total)
            WHERE {
              ?phone mp:owner ?owner .
              {?phone mp:model ?model .}
              OPTIONAL {?phone mp:createdAt ?createdAt .}
              ?phone mp:imei ?imei .
              OPTIONAL {?phone mp:batteryExtracted ?batteryExtracted .}
              OPTIONAL { ?phone mp:materialsExtracted ?materialsExtracted . }
              {?phone mp:state ?state .}
              {?phone mp:visualCondition ?visualCondition .}
              OPTIONAL {?phone mp:disposal ?disposal .}
              ${filterByQuery(phoneQuery)}
            }
`
//FILTER regex(?ownerEmail, "${query.query}", "i") .
export const phoneByUserId = (userId) => `
        PREFIX mp: <http://recykle.rocks/mobilephone/>
        prefix schema: <http://schema.org/>

        SELECT DISTINCT ?phone ?phoneIpfs ?backgroundIpfs ?compositeIpfs ?metadataIpfs ?model ?imei ?batteryExtracted ?materialsExtracted ?state ?disposal ?createdAt ?visualCondition
            WHERE {
              ?phone mp:owner "${userId}" .
              {?phone mp:model ?model .}
              ?phone mp:imei ?imei .
              OPTIONAL {?phone mp:createdAt ?createdAt .}
              OPTIONAL {?phone mp:batteryExtracted ?batteryExtracted .}
              OPTIONAL { ?phone mp:materialsExtracted ?materialsExtracted . }
              ?phone mp:phoneIpfs ?phoneIpfs .
              ?phone mp:backgroundIpfs ?backgroundIpfs .
              ?phone mp:compositeIpfs ?compositeIpfs .
              ?phone mp:metadataIpfs ?metadataIpfs .
              {?phone mp:state ?state .}
              {?phone mp:visualCondition ?visualCondition .}
              OPTIONAL {?phone mp:disposal ?disposal .}
            }`
//OPTIONAL {?disposal mp:method ?method .} -- this was causing multiple results

export const phoneByDisposalEmailQuery = (email) => `
        PREFIX mp: <http://recykle.rocks/mobilephone/>
        prefix schema: <http://schema.org/>
       
        SELECT DISTINCT ?phone ?model ?imei ?state ?method ?materialsExtracted ?batteryExtracted
            WHERE {
              ?phone mp:disposal ?disposal .
              ?disposal mp:email "${email}" .
              OPTIONAL {?phone mp:model ?model .}
              OPTIONAL {?phone mp:batteryExtracted ?batteryExtracted .}
              OPTIONAL { ?phone mp:materialsExtracted ?materialsExtracted . }
              ?phone mp:imei ?imei .
              OPTIONAL {?phone mp:state ?state .}
              OPTIONAL {?phone mp:disposal ?disposal .}
              OPTIONAL {?disposal mp:method ?method .}
            }`

export const phoneById = (id) => `
PREFIX mp: <http://recykle.rocks/mobilephone/>
SELECT ?phone ?model ?imei
WHERE {
  <${id}> schema:productID ?productID .
  ?phone schema:productID ?productID .
  ?phone mp:imei ?imei .
  ?phone mp:model ?model .
  {?phone mp:state ?state .}
  OPTIONAL {?phone mp:createdAt ?createdAt .}
  ?phone a schema:Product ;
}
`

export const phoneByImei = (imei) => `
PREFIX mp: <http://recykle.rocks/mobilephone/>
        prefix schema: <http://schema.org/>
       
        SELECT ?phone ?model ?imei ?batteryExtracted ?materialsExtracted ?state ?brand ?createdAt ?owner ?visualCondition ?locationName ?locationLatitude ?locationLongitude ?factory ?technicalSpecifications ?handoverDate ?handoverEmail ?handoverCompany ?disposal
WHERE {
  ?phone mp:imei "${imei}" .
  OPTIONAL {?phone mp:model ?model .}
  OPTIONAL {?phone mp:state ?state .}
  OPTIONAL {?phone mp:brand ?brand .}
  OPTIONAL {?phone mp:owner ?owner .}
  OPTIONAL {?phone mp:imei ?imei .}
  OPTIONAL {?phone mp:createdAt ?createdAt .}
  OPTIONAL {?phone mp:batteryExtracted ?batteryExtracted .}
  OPTIONAL { ?phone mp:materialsExtracted ?materialsExtracted . }
  OPTIONAL {?phone mp:visualCondition ?visualCondition .}
  OPTIONAL {
    ?phone mp:location ?location .
    ?location mp:name ?locationName .
    ?location mp:geo ?geo .
    ?geo mp:latitude ?locationLatitude .
    ?geo mp:longitude ?locationLongitude .
  }
  OPTIONAL {?phone mp:factory ?factory .}
  OPTIONAL {
    ?phone mp:handover ?handover .
    ?handover mp:date ?handoverDate .
    ?handover mp:email ?handoverEmail .
    ?handover mp:company ?handoverCompany .
  }
  OPTIONAL {?phone mp:disposal ?disposal .}
}`

export const phoneByQuery = (phoneQuery: PhoneQuery) => `
        PREFIX mp: <http://recykle.rocks/mobilephone/>
        prefix schema: <http://schema.org/>

        SELECT DISTINCT ?phone ?owner ?model ?imei ?materialsExtracted ?batteryExtracted ?state ?disposal ?visualCondition ?handedOverAt ?formattedDate ?phoneNumber ?createdAt
            WHERE {
              {?phone mp:handover ?handover .}
              {?handover mp:date ?handedOverAt .}
              ?phone mp:owner ?owner .
              {?phone mp:model ?model .}
              {?phone mp:imei ?imei .}
              {?phone mp:createdAt ?createdAt .}
              OPTIONAL {?phone mp:batteryExtracted ?batteryExtracted .}
              OPTIONAL { ?phone mp:materialsExtracted ?materialsExtracted . }
              {?phone mp:state ?state .}
              {?phone mp:visualCondition ?visualCondition .}
              OPTIONAL {?phone mp:disposal ?disposal .}
              BIND(COALESCE(xsd:dateTime(?handedOverAt), "1970-01-01T00:00:00Z"^^xsd:dateTime) as ?formattedDate)
              BIND(COALESCE(xsd:dateTime(?createdAt), "1970-01-01T00:00:00Z"^^xsd:dateTime) as ?createdAtDate)
              ${filterByQuery(phoneQuery)}
            }
            ORDER BY DESC(?createdAt)
            OFFSET ${phoneQuery.pageSize * phoneQuery.pageIndex}
            LIMIT ${phoneQuery.pageSize}`


export const getCountsByState = () => `
   PREFIX mp: <http://recykle.rocks/mobilephone/>
  PREFIX schema: <http://schema.org/>

  SELECT ?state (COUNT(?phone) AS ?count)
  WHERE {
    ?phone mp:state ?state .
  }
  GROUP BY ?state
`;

export const getCountsByBrand = () => `
   PREFIX mp: <http://recykle.rocks/mobilephone/>
    PREFIX schema: <http://schema.org/>
    

SELECT ?brand (COUNT(?phone) AS ?count)
WHERE {
  ?phone mp:brand ?brand ;
}
GROUP BY ?brand
`;

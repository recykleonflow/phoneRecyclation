import {RecycleState} from '../enum/recycleState';
import {VisualAppeal} from '../enum/visual-state.enum';
import {OtPhoneParametersModel} from './ot-phone-parameters.model';
import {DisposableMethod} from '../enum/disposable-method.enum';
import { v4 as uuid } from 'uuid';
import {ID_PREFIX} from '../../../apps/server/src/origin-trail/service/const';
import {OtHelper} from '../../../apps/server/src/origin-trail/ot-helper';

export class OtPhoneJson {
    "@context": any[];
    "@type": "Product";
    "@id": string;
        // `http://recykle.rocks/mobilephone/${uuid()}`;
    "mp:phoneIpfs": string;
    "mp:backgroundIpfs": string;
    "mp:compositeIpfs": string;
    "mp:createdAt": string;
    "mp:imei": string;
    "mp:brand": string;
    "mp:model": string;
    "mp:owner": string;
    "mp:visualCondition": VisualAppeal;
    "mp:location": {
        "@type": "Place";
        "mp:name": string;
        "mp:geo": {
            "@type": "GeoCoordinates";
            "mp:latitude": string;
            "mp:longitude": string;
        }
    };
    "mp:state": RecycleState;
    "mp:factory": string;
    "mp:technicalSpecifications": {
        "@type": "mp:TechnicalSpecifications";
        "mp:processor": string;
        "mp:RAM": number;
        "mp:storage": string;
    };
    "mp:handover": {
        "@type": "mp:Handover",
        "mp:date": string,
        "mp:email": string;
        "mp:company": string;
    };
    "mp:disposal"?: {
        "@type": "mp:Disposal",
        "mp:name": string,
        "mp:method": DisposableMethod,
        "mp:geo": {
            "@type": "GeoCoordinates",
            "mp:latitude": string,
            "mp:longitude": string
        }
    }

    constructor(phoneParameters: OtPhoneParametersModel) {
        this['@context'] = [
            {
                "@vocab": "http://schema.org/"
            },
            {
                "mp": "http://recykle.rocks/mobilephone/",
                "xsd": "http://www.w3.org/2001/XMLSchema#"
            }
        ];
        this['@type'] = 'Product';
        this['@id'] = phoneParameters.id || ID_PREFIX+uuid();
        this['mp:createdAt'] = OtHelper.generateOtDate();
        this['mp:phoneIpfs'] = phoneParameters.phoneIpfs;
        this['mp:backgroundIpfs'] = phoneParameters.backgroundIpfs;
        this['mp:compositeIpfs'] = phoneParameters.compositeIpfs;
        this['mp:metadataIpfs'] = phoneParameters.metadataIpfs;
        this['mp:batteryExtracted'] = phoneParameters.batteryExtracted ?? false;
        this['mp:materialsExtracted'] = phoneParameters.materialsExtracted ?? false;
        this['mp:imei'] = phoneParameters.imei;
        this['mp:brand'] = phoneParameters.brand;
        this['mp:model'] = phoneParameters.model;
        this['mp:visualCondition'] = phoneParameters.visualCondition;
        this['mp:owner'] = phoneParameters.owner;

        if(phoneParameters.location) {
            this['mp:location'] = {
                "@type": "Place",
                "mp:name": phoneParameters.location.name,
                "mp:geo": {
                    "@type": "GeoCoordinates",
                    "mp:latitude": phoneParameters.location.latitude,
                    "mp:longitude": phoneParameters.location.longitude
                }
            }
        }

        this['mp:state'] = phoneParameters.state;
        this['mp:factory'] = "South Korea";
        this["mp:technicalSpecifications"] = {
            "@type": "mp:TechnicalSpecifications",
                "mp:processor": "Snapdragon 888",
                "mp:RAM": phoneParameters.technicalSpecification.ram,
                "mp:storage": "128 GB"
        };
        this["mp:handover"] = {
            "@type": "mp:Handover",
                "mp:date": phoneParameters.handover.date,
                "mp:email": phoneParameters.handover.email,
                "mp:company": phoneParameters.handover.company
        }
        if (phoneParameters.disposal) {
            this["mp:disposal"] = {
                "@type": "mp:Disposal",
                "mp:name": "Ecological Destruction Site",
                "mp:method": phoneParameters.disposal.method,
                "mp:geo": {
                    "@type": "GeoCoordinates",
                    "mp:latitude": "40.7128° N",
                    "mp:longitude": "74.0060° W"
                }
            }
        }
    }
}

import {RecycleState} from '../shared_models/enum/recycleState';
import {OtPhoneParametersModel} from '../shared_models/model/ot-phone-parameters.model';
import * as moment from 'moment/moment';
import {OtHelper} from '../../apps/server/src/origin-trail/ot-helper';

export class UalPhoneMapperUtil {
    static mapUalToPhone(ualObject: any): OtPhoneParametersModel | null {
        // const product = ualObject.assertion.find(((x: { [x: string]: string; }) => x['@id'][0].indexOf('http://recykle.rocks/mobilephone') > -1));
        if (ualObject.assertion) {
            const contact = ualObject.assertion.find(((x: { [x: string]: string; }) => x['@type']?.[0] === "http://schema.org/ContactPoint"));
            const product = ualObject.assertion.find(((x: { [x: string]: string; }) => x['@type']?.[0] === "http://schema.org/Product"));
            const place = ualObject.assertion.find(((x: { [x: string]: string; }) => x['@type']?.[0] === "http://schema.org/Place"));
            const getCoordinates = ualObject.assertion.find(((x: { [x: string]: string; }) => x['@type']?.[0] === "http://schema.org/GeoCoordinates"));
            const technicalSpecifications = ualObject.assertion.find(((x: { [x: string]: string; }) => x['@type']?.[0] === "http://recykle.rocks/mobilephone/TechnicalSpecifications"));
            const handover = ualObject.assertion.find(((x: { [x: string]: string; }) => x['@type']?.[0] === "http://recykle.rocks/mobilephone/Handover"));


            const imei = product["http://recykle.rocks/mobilephone/imei"]?.[0]["@value"];
            const materialsExtracted = product["http://recykle.rocks/mobilephone/materialsExtracted"]?.[0]["@value"];
            const batteryExtracted = product["http://recykle.rocks/mobilephone/batteryExtracted"]?.[0]["@value"];
            const model = product["http://recykle.rocks/mobilephone/model"]?.[0]["@value"];
            const condition = product["http://recykle.rocks/mobilephone/visualCondition"]?.[0]["@value"];
            const owner = product["http://recykle.rocks/mobilephone/owner"]?.[0]["@value"];
            const handoverDate = handover["http://recykle.rocks/mobilephone/date"]?.[0]?.["@value"];
            const handoverEmail = handover["http://recykle.rocks/mobilephone/email"]?.[0]?.["@value"];
            const handoverCompany = handover["http://recykle.rocks/mobilephone/company"]?.[0]?.["@value"];

            const processor = technicalSpecifications["http://recykle.rocks/mobilephone/processor"]?.[0]?.["@value"];
            const ram = technicalSpecifications["http://recykle.rocks/mobilephone/ram"]?.[0]?.["@value"];
            const storage = technicalSpecifications["http://recykle.rocks/mobilephone/storage"]?.[0]?.["@value"];
            const placeCoordinates = place["http://recykle.rocks/mobilephone/geo"]?.[0]?.["@value"];
            const createdAt = product["http://recykle.rocks/mobilephone/createdAt"]?.[0]["@value"];
            return {
                imei,
                createdAt,
                id: product["@id"],
                materialsExtracted,
                batteryExtracted,
                phoneIpfs: product["http://recykle.rocks/mobilephone/phoneIpfs"]?.[0]?.["@value"],
                backgroundIpfs: product["http://recykle.rocks/mobilephone/backgroundIpfs"]?.[0]?.["@value"],
                compositeIpfs: product["http://recykle.rocks/mobilephone/compositeIpfs"]?.[0]?.["@value"],
                metadataIpfs: product["http://recykle.rocks/mobilephone/metadataIpfs"]?.[0]?.["@value"],
                brand: product["http://recykle.rocks/mobilephone/brand"]?.[0]?.["@value"],
                model,
                owner,
                visualCondition: condition,
                location: {
                    latitude: placeCoordinates?.["http://recykle.rocks/mobilephone/latitude"]?.[0]?.["@value"],
                    longitude: placeCoordinates?.["http://recykle.rocks/mobilephone/longitude"]?.[0]?.["@value"],
                    name: place["http://recykle.rocks/mobilephone/name"]?.[0]?.["@value"],
                },
                state: product["http://recykle.rocks/mobilephone/state"]?.[0]?.["@value"],
                factory: product["http://recykle.rocks/mobilephone/factory"]?.[0]?.["@value"],
                technicalSpecification: {
                    storage,
                    processor,
                    ram
                },
                handover: {
                    date: handoverDate,
                    email: handoverEmail,
                    company: handoverCompany
                }
            }
        }
        return null;
    }
}

import moment from 'moment';

type RDFObject = {
    status: 'COMPLETED';
    data: string;
};

type RDFTriple = {
    subject: string;
    predicate: string;
    object: string;
};

export class RdfTripletHelper {
    public static parseRDFData(data: string): any {
        type RDFMapper = { [predicate: string]: string };

        const triples: RDFTriple[] = [];
        const lines = data.split("\n");
        let obj = {};

        for (const line of lines) {
            if (line.trim() === "") {
                continue;
            }

            // Matching blank node in subject or object as well
            const match = line.match(/(<([^>]*)>|_:b\w+)\s*<([^>]*)>\s*(<([^>]*)>|".*"|_:b\w+)\s*\./);
            if (!match) {
                continue;
                // throw new Error(`Failed to parse line: ${line}`);
            }

            const [, , subject, predicate, , object] = match;
            triples.push({
                subject: subject ?? match[1],
                predicate,
                object: object ? object.replace(/^"|"$/g, '') : match[4]
            });
            const predicatedSplit = predicate.split('/');
            const attribute = predicatedSplit[predicatedSplit.length - 1];

            obj = {
                ...obj,
                [attribute]: object ? object.replace(/^"|"$/g, '') : match[4]
            }
        }

        return obj;
    }

    public static parseRDFObjects(objects: RDFObject[]): RDFTriple[] {
        let triples: RDFTriple[] = [];
        let states = [];

        for (const object of objects) {
            states.push(RdfTripletHelper.parseRDFData(object.data))
            // triples = triples.concat(RdfTripletHelper.parseRDFData(object.data));
        }

        return states;
    }

}

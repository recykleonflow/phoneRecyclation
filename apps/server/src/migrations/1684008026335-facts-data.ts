import { MigrationInterface, QueryRunner } from "typeorm"

export class FactsData1684008026335 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Sweden',
            'Sweden is so good at recycling that it has run out of rubbish and imports garbage from other countries to keep its recycling plants going. Less than 1% of Swedish household waste was sent to landfill last year or any year since 2011.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Germany',
            'Germany has the highest recycling rate in the world. According to the Organisation for Economic Co-operation and Development (OECD), Germany recycles or composts over 65% of its total waste, the most of any country.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Japan',
            'In Japan, the town of Kamikatsu is known for its rigorous recycling program. The town aims for "zero waste", and residents sort their trash into 45 different categories.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'United States',
            'In the U.S., about 50% of the paper is recycled, making it one of the most recycled materials in the country. However, the U.S. recycling rate is around 34.7%, significantly lower than several other countries.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Australia',
            'Australians are one of the highest producers of waste per head in the world. In an effort to reduce waste, South Australia implemented a "Container Deposit Scheme" that offers a 10 cent refund on beverage containers.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Switzerland',
            'Swiss law mandates that people who do not recycle properly be fined. This country has a recycling rate of around 52%.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Brazil',
            'Brazil is the worlds leader in recycling aluminum cans. In 2019, the country recycled 97.6% of the cans it produced.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'India',
            'In India, there is an informal sector of waste pickers who manually sort through waste and pick out recyclable materials. This process contributes to Indias recycling efforts, but it often lacks the formal recognition it deserves.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'South Korea',
            'South Korea has implemented a rigorous program to reduce food waste, by charging households and businesses for the amount of food waste they produce.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Nigeria',
            'In Nigeria, there is a growing trend of using discarded plastic bottles to build houses. This method not only recycles waste but also results in homes that are both eco-friendly and affordable.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Belgium',
            'Belgium has one of the highest waste recycling rates in Europe. The country recycles approximately 80% of packaging waste and 87% of specific household waste.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Wales',
            ' In the United Kingdom, Wales leads in recycling and is second in the world after Germany. They recycle, compost, or reuse about 63.8% of their waste.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Netherlands',
            'The Dutch have a high regard for recycling. They have one of the highest percentages of waste that is used as an energy source, at 98%.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Austria',
            'Austria has a strong focus on waste management and recycling. It ranks among the top countries in the world for recycling rates, recycling 63% of its waste.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Canada',
            'The City of Toronto in Canada has a long-term goal to divert 70% of waste from landfill. As of now, they divert over 52% of residential waste from landfill.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'China',
            'China used to import a significant amount of the worlds recyclable waste. However, with its "National Sword" policy implemented in 2018, China has banned 24 types of waste and has drastically reduced the import of others.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Singapore',
            'Singapore has an ambitious plan to become a "Zero Waste Nation". They have a comprehensive recycling program and have recently focused on food waste.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Denmark',
            'Denmark is a leader in utilizing waste to generate energy. They import waste from other countries to run their waste-to-energy plants.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Italy',
            ' Italy has made significant progress in its recycling efforts. It recycles about 76.9% of paper and cardboard and about 55% of all waste materials.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Taiwan',
            'Taiwan has one of the top recycling rates in the world, thanks to its efficient and comprehensive recycling system. The country recycles more than half of its waste.');`)

        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Norway',
            ' Norway has a highly efficient system of returning bottles. The country has a deposit system for plastic bottles and cans, which results in a return rate of over 95%.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'France',
            'France has an ambitious goal to recycle 100% of its plastic by 2025. To achieve this, they have introduced initiatives such as penalties on landfilling and bonuses for recycling operations.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Finland',
            'Finland has a high recycling rate and has implemented a unique method to motivate its citizens to recycle: they have installed machines at supermarkets that offer money in return for recyclable cans and bottles.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'South Africa',
            'South Africa has a successful recycling program for their plastic bottles, with a bottle recycling rate of about 63%.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'New Zeland',
            ' In New Zealand, each person produces an average of 3.68kg of waste per day, one of the highest rates in the developed world. The country is working to improve its recycling and waste management strategies.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Argentina',
            'In Buenos Aires, Argentina, there is a community of waste pickers known as "cartoneros" who sort through garbage to find recyclable materials. This informal sector plays a significant role in the citys waste management system.');`)

        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Israel',
            'In Israel, there is a park - Ariel Sharon Park - that was built on top of a massive landfill. It is an example of how a country can reclaim and recycle even its waste spaces.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Spain',
            'Spain has made significant strides in recycling in recent years. In particular, the city of San Sebastian recycles more than 50% of its waste.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Chile',
            'Chile has a national recycling policy aimed at managing waste and reducing the amount of waste that goes to landfill. The country recycles about 10% of its waste.');`)
        await queryRunner.query(`INSERT INTO public.recyclation_fact_entity (id, country, text)
        VALUES (DEFAULT, 'Greece',
            'In Greece, the recycling rate is one of the lowest in the EU, but efforts are being made to improve this. The Hellenic Recovery Recycling Corporation has set up a blue bin network for packaging waste in various municipalities across the country.');`)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

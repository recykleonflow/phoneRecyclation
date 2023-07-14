import { MigrationInterface, QueryRunner } from "typeorm"

export class RewardsRows1684080964874 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO public.rewards_entity (id, name, cost, description, "shortName", "pictureUrl")
VALUES (DEFAULT, 'Next phone purchase - 5% discount', 50,
        'Get a 5% discount on your next phone purchase at any Phone store.', '5% Discount',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8')`);

        await queryRunner.query(`INSERT INTO public.rewards_entity (id, name, cost, description, "shortName", "pictureUrl")
VALUES (DEFAULT, 'Free 1GB of data', 150,
        'Enjoy an additional 1GB of data on your existing plan for one month.', 'Free 1GB',
        'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg')`);

        await queryRunner.query(`INSERT INTO public.rewards_entity (id, name, cost, description, "shortName", "pictureUrl")
VALUES (DEFAULT, '10% discount on accessories', 200,
        'Save 10% on phone accessories when you shop at Phone stores.', '10% Discount',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8')`);

        await queryRunner.query(`INSERT INTO public.rewards_entity (id, name, cost, description, "shortName", "pictureUrl")
VALUES (DEFAULT, 'Upgrade your plan with a 15% discount', 250,
        'Upgrade to a higher-tier plan and receive a 10% discount on your monthly fee for the first 6 months.', '15% Discount',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8')`);

        await queryRunner.query(`INSERT INTO public.rewards_entity (id, name, cost, description, "shortName", "pictureUrl")
VALUES (DEFAULT, '20% off on your next screen protector', 40,
        'Protect your phone screen and save 20% on your next screen protector purchase.', '20% Discount',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8')`);

        await queryRunner.query(`INSERT INTO public.rewards_entity (id, name, cost, description, "shortName", "pictureUrl")
VALUES (DEFAULT, 'Free month of premium streaming service', 60,
        'Enjoy a free month of our premium music or video streaming service.', 'Free 1 month',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8')`);

        await queryRunner.query(`INSERT INTO public.rewards_entity (id, name, cost, description, "shortName", "pictureUrl")
VALUES (DEFAULT, 'One-time device insurance discount', 50,
        'Get a 10% discount on a one-time device insurance plan for your phone.', '10% discount',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8')`);

        await queryRunner.query(`INSERT INTO public.rewards_entity (id, name, cost, description, "shortName", "pictureUrl")
VALUES (DEFAULT, 'Refer a friend and get a 10€ credit', 50,
        'Refer a friend to Recykle, and both you and your friend will receive a $10 credit on your accounts.', '10€ credit',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8')`);

        await queryRunner.query(`INSERT INTO public.configuration_entity (id, "maxPointsPerPhone", "minPointsPerPhone")
VALUES (DEFAULT, 10, 5);`)

    }


    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

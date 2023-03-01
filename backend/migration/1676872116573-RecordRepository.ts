import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBackendTestSchema1645338258628 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createSchema("backendtest");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropSchema("backendtest");
    }
}

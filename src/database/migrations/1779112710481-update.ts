import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1779112710481 implements MigrationInterface {
    name = 'Update1779112710481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`student\` ADD \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`student\` ADD UNIQUE INDEX \`IDX_0cc43638ebcf41dfab27e62dc0\` (\`user_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_0cc43638ebcf41dfab27e62dc0\` ON \`student\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`student\` ADD CONSTRAINT \`FK_0cc43638ebcf41dfab27e62dc09\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`student\` DROP FOREIGN KEY \`FK_0cc43638ebcf41dfab27e62dc09\``);
        await queryRunner.query(`DROP INDEX \`REL_0cc43638ebcf41dfab27e62dc0\` ON \`student\``);
        await queryRunner.query(`ALTER TABLE \`student\` DROP INDEX \`IDX_0cc43638ebcf41dfab27e62dc0\``);
        await queryRunner.query(`ALTER TABLE \`student\` DROP COLUMN \`user_id\``);
    }

}

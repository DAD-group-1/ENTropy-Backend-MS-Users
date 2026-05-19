import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1779117304473 implements MigrationInterface {
    name = 'Update1779117304473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_0cc43638ebcf41dfab27e62dc0\` ON \`student\``);
        await queryRunner.query(`CREATE TABLE \`instructor\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`birthday\` date NOT NULL, \`campus_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`department_id\` int NOT NULL, \`status\` varchar(255) NOT NULL, \`hire_date\` datetime NOT NULL, \`specialization_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`instructor\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_0cc43638ebcf41dfab27e62dc0\` ON \`student\` (\`user_id\`)`);
    }

}

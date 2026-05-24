import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1779618127268 implements MigrationInterface {
    name = 'Update1779618127268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "birthday" date NOT NULL, "campus_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "instructor" ("user_id" integer NOT NULL, "department_id" integer NOT NULL, "status" character varying NOT NULL, "hire_date" TIMESTAMP NOT NULL, "specialization_id" integer NOT NULL, CONSTRAINT "PK_017e5f8348ae0b4f877c6339dff" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "student" ("user_id" integer NOT NULL, "program_id" integer NOT NULL, "enrollment_year" integer NOT NULL, "status" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "zip_code" character varying NOT NULL, "emergency_contact" character varying NOT NULL, "emergency_phone" character varying NOT NULL, CONSTRAINT "PK_0cc43638ebcf41dfab27e62dc09" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "instructor" ADD CONSTRAINT "FK_017e5f8348ae0b4f877c6339dff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09"`);
        await queryRunner.query(`ALTER TABLE "instructor" DROP CONSTRAINT "FK_017e5f8348ae0b4f877c6339dff"`);
        await queryRunner.query(`DROP TABLE "student"`);
        await queryRunner.query(`DROP TABLE "instructor"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

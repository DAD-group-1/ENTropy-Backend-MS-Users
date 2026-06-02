import * as bcrypt from 'bcrypt';
import dataSource from './data-source';
import { User } from '../core/users/entities/user.entity';
import { Student } from '../core/students/entities/student.entity';
import { Instructor } from '../core/instructors/entities/instructor.entity';
import { Role } from '../core/authorization/entities/role.entity';
import { UserRole } from '../core/authorization/entities/user-role.entity';
import { StudentStatus, InstructorStatus } from '@dad-group-1/backend-common';

async function seed() {
  await dataSource.initialize();
  console.log('Database connected');

  const userRepository = dataSource.getRepository(User);
  const studentRepository = dataSource.getRepository(Student);
  const instructorRepository = dataSource.getRepository(Instructor);
  const roleRepository = dataSource.getRepository(Role);
  const userRoleRepository = dataSource.getRepository(UserRole);

  // Seed Roles
  const roleDefinitions = [
    { name: 'Student',    description: 'Enrolled student' },
    { name: 'Instructor', description: 'Course instructor' },
    { name: 'Manager',    description: 'Campus manager' },
    { name: 'Admin',      description: 'System administrator' },
  ];

  const roles: Record<string, Role> = {};
  for (const def of roleDefinitions) {
    let role = await roleRepository.findOne({ where: { name: def.name } });
    if (!role) {
      role = roleRepository.create(def);
      role = await roleRepository.save(role);
    }
    roles[def.name] = role;
  }
  console.log('Roles seeded:', Object.keys(roles).join(', '));

  // Hash password
  const password = await bcrypt.hash('password123', 10);

  // Seed Student
  const studentUser = new User();
  studentUser.first_name = 'Jane';
  studentUser.last_name = 'Doe';
  studentUser.email = 'student@example.com';
  studentUser.password = password;
  studentUser.phone = '1234567890';
  studentUser.birthday = new Date('2000-01-01');
  studentUser.campus_id = 1;
  studentUser.is_active = true;

  const savedStudentUser = await userRepository.save(studentUser);

  const student = new Student();
  student.user_id = savedStudentUser.id;
  student.program_id = 1;
  student.enrollment_year = new Date().getFullYear();
  student.status = StudentStatus.ACTIVE;
  student.address = '123 Student St';
  student.city = 'Student City';
  student.zip_code = '12345';
  student.emergency_contact = 'Jane Doe';
  student.emergency_phone = '0987654321';
  // set the relation
  student.user = savedStudentUser;

  await studentRepository.save(student);
  console.log(`Student created: ${student.user.email} / password123`);

  // Assign Student role
  const studentUserRole = userRoleRepository.create({
    user_id: savedStudentUser.id,
    role_id: roles['Student'].id,
    user: savedStudentUser,
    role: roles['Student'],
  });
  await userRoleRepository.save(studentUserRole);
  console.log(`Role 'Student' assigned to ${savedStudentUser.email}`);

  // Seed Instructor
  const instructorUser = new User();
  instructorUser.first_name = 'Jane';
  instructorUser.last_name = 'Smith';
  instructorUser.email = 'instructor@example.com';
  instructorUser.password = password;
  instructorUser.phone = '0987654321';
  instructorUser.birthday = new Date('1980-01-01');
  instructorUser.campus_id = 1;
  instructorUser.is_active = true;

  const savedInstructorUser = await userRepository.save(instructorUser);

  const instructor = new Instructor();
  instructor.user_id = savedInstructorUser.id;
  instructor.department_id = 1;
  instructor.status = InstructorStatus.ACTIVE;
  instructor.hire_date = new Date('2020-01-01');
  instructor.specialization_id = 1;
  // set the relation
  instructor.user = savedInstructorUser;

  await instructorRepository.save(instructor);
  console.log(`Instructor created: ${instructor.user.email} / password123`);

  // Assign Instructor role
  const instructorUserRole = userRoleRepository.create({
    user_id: savedInstructorUser.id,
    role_id: roles['Instructor'].id,
    user: savedInstructorUser,
    role: roles['Instructor'],
  });
  await userRoleRepository.save(instructorUserRole);
  console.log(`Role 'Instructor' assigned to ${savedInstructorUser.email}`);

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});

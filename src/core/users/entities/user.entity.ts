import { Entity } from 'typeorm';
import { InternalUser } from '@dad-group-1/backend-common';

@Entity()
export class User extends InternalUser {}

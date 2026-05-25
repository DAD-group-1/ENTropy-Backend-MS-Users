import { config } from 'dotenv';
import { createDatabase } from '@dad-group-1/backend-common';

config(); // Load variables from your .env file

export default createDatabase();

# ENTropy-Backend-MS-Users

Service managing users for the ENTropy architecture.

## Setup & Dependencies

This service relies on a custom common package (`@dad-group-1/backend-common`) hosted via GitHub Packages.

To install dependencies properly, you must authenticate with GitHub:

1. **Create a GitHub Token (PAT):** Go to GitHub Developer Settings and create a Personal Access Token with the `read:packages` scope.
2. **Setup `.npmrc`:** Create a `.npmrc` file at the root of this service (`ENTropy-Backend-MS-Users/.npmrc`) with the following content:
   ```ini
   @dad-group-1:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```
   _(Make sure `.npmrc` is added to your `.gitignore` to prevent leaking your token)._
3. **Install:** Run `npm install` as usual.

_(For detailed instructions on the common package, refer to the `ENTropy-Backend-Common/README.md` file)._

## Running the application

```bash
# development
$ npm run start:dev

# watch mode + update from common package
$ npm run start:update:dev

# production mode
$ npm run start:prod
```

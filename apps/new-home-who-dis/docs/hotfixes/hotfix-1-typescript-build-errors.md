Looks like there's an issue with the deployment. Below is the log from railway

```
> new-home-who-dis@0.0.1 build /app/apps/new-home-who-dis
> astro check && astro build
11:30:47 [types] Generated 102ms
11:30:47 [check] Getting diagnostics for Astro files in /app/apps/new-home-who-dis...
scripts/seed-local.ts:120:27 - error ts(7006): Parameter 'user' implicitly has an 'any' type.
120     insertedUsers.forEach(user => {
                              ~~~~
scripts/seed-local.ts:5:43 - error ts(2835): Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../src/db/schema.js'?
5 import { users, gifts, commitments } from "../src/db/schema"
                                            ~~~~~~~~~~~~~~~~~~
scripts/seed-local.ts:4:20 - error ts(2835): Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../src/db/index.js'?
4 import { db } from "../src/db/index"
                     ~~~~~~~~~~~~~~~~~
scripts/seed-production.ts:6:31 - error ts(2835): Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../src/db/schema.js'?
6 import { gifts, config } from "../src/db/schema"
                                ~~~~~~~~~~~~~~~~~~
scripts/test-validation.ts:226:12 - error ts(18046): 'error' is of type 'unknown'.
226     assert(error.length === 3, 'Should have three errors')
               ~~~~~
scripts/test-validation.ts:212:12 - error ts(18046): 'error' is of type 'unknown'.
212     assert(error[0] instanceof ValidationError, 'Should be ValidationError')
               ~~~~~
scripts/test-validation.ts:211:12 - error ts(18046): 'error' is of type 'unknown'.
211     assert(error.length > 0, 'Should have at least one error')
               ~~~~~
scripts/test-validation.ts:18:8 - error ts(2835): Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../src/lib/validation.js'?
18 } from '../src/lib/validation'
          ~~~~~~~~~~~~~~~~~~~~~~~
scripts/verify-production-tables.ts:89:44 - error ts(2532): Object is possibly 'undefined'.
89     console.log(`\n🎁 Gifts in database: ${giftCount[0].count}`)
                                              ~~~~~~~~~~~~
src/db/index.ts:3:25 - error ts(2835): Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './schema.js'?
3 import * as schema from "./schema"
                          ~~~~~~~~~~
src/lib/auth.ts:20:12 - warning ts(6133): 'username' is declared but its value is never read.
20     const [username, password] = credentials.split(':')
              ~~~~~~~~
src/pages/test-db.astro:6:26 - warning ts(6133): 'createUnauthorizedResponse' is declared but its value is never read.
6 import { checkBasicAuth, createUnauthorizedResponse } from "../lib/auth"
                           ~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/api/gifts.ts:50:14 - error ts(18046): 'error' is of type 'unknown'.
50           ...error.toJSON(),
                ~~~~~
src/pages/api/gifts.ts:5:54 - error ts(2835): Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../../lib/validation.js'?
5 import { isValidWishlistType, ValidationError } from "../../lib/validation"
                                                       ~~~~~~~~~~~~~~~~~~~~~~
src/pages/api/gifts.ts:3:23 - error ts(2835): Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../../db/schema.js'?
3 import { gifts } from "../../db/schema"
                        ~~~~~~~~~~~~~~~~~
src/pages/api/gifts.ts:2:20 - error ts(2835): Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../../db/index.js'?
2 import { db } from "../../db/index"
                     ~~~~~~~~~~~~~~~~
Result (27 files):
- 14 errors
- 0 warnings
- 2 hints
/app/apps/new-home-who-dis:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  new-home-who-dis@0.0.1 build: `astro check && astro build`
Exit status 1
ERROR: failed to build: failed to solve: process "sh -c pnpm --filter new-home-who-dis build" did not complete successfully: exit code: 1
```

Diagnose the issue, explain it and apply a fix. We will make a hotfix commit direcly into the `master` branch

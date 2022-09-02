# compose V2 migration
Series of scripts to make migration to compose v2 easier.

In each script:
* Configure your Contentful, spaceID, environmentID and CMA token 
* Set up the correct contentTypesID (if needed).

```javascript
/**
 * 1.- Set your credentials
 */
const spaceID = "****";
const envID = "****";
const accessToken = "***";
```

## Installation

Required [contentful-management.js](https://contentful.github.io/contentful-management.js/contentful-management/10.12.1/)

## Usage

```bash
$ node 1-updateContentType.js

...

$ node 2-copycontent.js

...

$ node 3-disableComposeV1.js
```

## Steps of migrations
The migration to composeV2 follows the DB pattern of [expand&contract](https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern) adjusted to content models, where fields are added, content is copied and the old fields are disabled.

### Recommendation on how to migrate 

#### 1.- Exapand
Former 'compose:page' fields Title, Slug, and Seo need to be copied to each one of the new compose pages.

Besides adding the new fields, each new 'root' or 'start' compose v2 page, needs to be set up as a root page and the reference fields set up as composable entries (flat view on compose UX).
For that we assign:

* Assign the Contentful:AggregateRoot annotation to the content type itself

* Assign the Contentful:AggregateComponent annotation to the reference field sections

more information [here](https://www.contentful.com/developers/docs/references/content-management-api/#assigning-annotations)

#### 2.- Migrate content
Former 'compose:page' content for fields Title, Slug, and Seo needs to be copied to each one of the new compose pages entries.
These new compose page entries are found by looking at the 'compose:page' field 'content', each reference entry under 'content' will become a 'root' or 'start' entry on compose V2.

#### 3.- Cleanup

Once new pages are marked as root, the legacy 'compose:page' content type is no longer required, we can now archive and later remove 'compose:page' entries and content Type.

#### References
For a detailed explanation and descriptions on steps, consult [Contentful guide](https://www.contentful.com/developers/docs/compose/upgrade-to-customizable-compose-content-model/)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
# compose V2 migration
Series of scripts to make migration to compose v2 easier.


## Installation

Required [contentful-management.js](https://contentful.github.io/contentful-management.js/contentful-management/10.12.1/)

### Configuration security

Rename the config.template.js to config.js and setup the corresponding, spaceID, environmentID and CMA token.


```javascript
/**
 * 1.- Set your credentials on config.js
 */
exports.config = function () {
  return {
    spaceID: "YOUR_SPACE_ID_HERE",
    envID: "YOUR_ENVIRONMENT_ID_HERE",
    accessToken: "YOUR_CMA_TOKEN_HERE",
  };
};
```

* On each file, Set up the correct contentTypesID to update, SEO, or compose:page ID (if needed).

"1-updateContentType.js"
```javascript
/**
 * 2.- Define your SEO ContentTypeId, default is former compose 'seo'
 */
const ComposeSeoTypeID = "seo"

/**
 * 3.- Add compose root or start pages to update. except "compose:page"
 */
const cTypesToUpdate = ["page_help_center_article","page_landing"];
```

"2-copycontent.js"
```javascript
/**
 *  2.- Set former compose contentType Id, from where the fields Title,Slug and Seo will be copied.
 */
const ComposePageID = "page";

/**
 *  3.- Set new compose root or start contentType Id, to where the fields Title,Slug and Seo (from former compose) will be copied.
 */
const ComposePagesTypeToUpdate = ["page_help_center_article", "page_landing"];
```

"3-disableComposeV1.js"
```javascript
/**
 *  2.- Set former compose contentType Id, from where the fields Title,Slug and Seo will be copied.
 */
const composePageID = "page";
```

## Usage

note: if you are in a hurry to migrate perhaps a "quick and dirty" migration will help you as a start. jump to this [section](#quick-and-dirty)

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

# Quick and Dirty
I recommend doing this "quick and dirty" migration if you are in a hurry to change to compose version V2, or as a first step and temporary solution while proper migrations are scheduled, scoped and evaluated.

This migrations focus on make "landing pages" or "compose pages" content types as compose root/start pages, and add the original "compose:page" content type as a reference entry, in this way no frontend changes are needed and the editorial team will still be able to keep working on compose.


## Usage

navigate to subfolder "quickAdirty"


```bash
$ cd quickAdirty


$ node 1.- addComposeField.js

...

$ node 2.- addComposeReference.js

...
```

### 1.- addComposeField.js
This script will set up the selected landing pages as "Contentful:AggregateRoot", making them visible in compose v2 as the root pages.
Also, a new field will be added per landing page, this new field is a reference field to a "compose:page" entry and will be marked as "Contentful:AggregateComponent"

```javascript
/**
 * 2.- Add compose root or start pages to update. except "compose:page"
 */
const cTypesToUpdate = ["page_help_center_article", "landingpage"];
const ComposePageID = "page";
```

### 2.- addComposeReference.js
This script will, for each landing page, add a reference to the corresponding "compose:page" entry, a bottom-top reference. this will make the original "compose:page" entry fields visible as a flat composable component in the compose v2 editor.

```javascript
/**
 * 2.- Add compose root or start pages to update. except "compose:page"
 */
const cTypesToUpdate = ["page_help_center_article"];
const ComposePageID = "page";
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
# compose V2 migration (Quick and Dirty)

Series of scripts to make migration to compose v2 easier, by making a quick change to start working with the version2 and have time to plan a long-term migration.


## Installation

Required [contentful-management.js](https://contentful.github.io/contentful-management.js/contentful-management/10.12.1/)

I recommend doing this "quick and dirty" migration if you are in a hurry to change to compose version V2, or as a first step and temporary solution while proper migrations are scheduled, scoped and evaluated.

This migrations focus on make "landing pages" or "compose pages" content types as compose root/start pages, and add the original "compose:page" content type as a reference entry, in this way no frontend changes are needed and the editorial team will still be able to keep working on compose.

After running these scripts the plan is to have the next structure, where a back refernce to the original compose:page entry added.

![Compose V2 Quick & Dirty](/../composeV2Migrations/img/composeQD.jpg "Q&D")

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
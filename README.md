# compose V2 migration
Series of scripts to make migration to compose v2 easier.

In each script:
* Configure your Contentful, spaceID, environmentID and CMA token 
* Set up the correct contentTypesID (if needed).


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

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
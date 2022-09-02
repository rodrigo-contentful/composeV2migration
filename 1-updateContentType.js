/**
 * based on expand and contract
 * https://github.com/contentful/cx-ps-cms-as-code-demo/blob/main/1-expand.js
 * Step 1.- Update pages with compose required fields and aggregations
 */

const mgnt = require("contentful-management");

/**
 * 1.- Set your credentials
 */
const spaceID = "****";
const envID = "****";
const accessToken = "***";

/**
 * 2.- Define your SEO ContentTypeId, default is former compose 'seo'
 */
const ComposeSeoTypeID = "seo"

/**
 * 3.- Add compose root or start pages to update. except "compose:page"
 */
const cTypesToUpdate = ["page_help_center_article","page_landing"];

async function main() {
  // Boilerplate for connecting to Contentful
  const cma = mgnt.createClient({ accessToken });
  const space = await cma.getSpace(spaceID);
  const env = await space.getEnvironment(envID);

  
  // Grab all contenttypes.
  const contentTypesCollection = await env.getContentTypes();

  // find the selected ones, PAGES from compose
  contentTypesCollection.items.forEach(async (currentCT) => {
    // on ech, add new compose fields (EXPAND)
    if (cTypesToUpdate.includes(currentCT.sys.id)) {
      console.log("converting: '"+currentCT.sys.id+"'")
      
      /**
       * 4.- Make sure the next three fields IDs are correct as needed.
       * This 3 fields are former compose: Title, Slug and Seo (reference field)
       */
      currentCT.fields.push({
        id: "compose_title",
        name: "Compose Page title",
        type: "Symbol",
        localized: true,
        required: true,
        validations: [],
        disabled: false,
        omitted: false,
      });

      currentCT.fields.push({
        id: "compose_slug",
        name: "Compose Slug",
        type: "Symbol",
        localized: true,
        required: true,
        validations: [
          {
            unique: true,
          },
          {
            regexp: {
              pattern:
                "^((\\/)|(([\\/\\w\\-\\._~:!$&'\\(\\)*+,;@]|(%\\d+))+))$",
            },
          },
        ],
        disabled: false,
        omitted: false,
      });

      currentCT.fields.push({
        id: "compose_seo",
        name: "Compose SEO metadata",
        type: "Link",
        localized: false,
        required: false,
        validations: [
          {
            "linkContentType": [
              ComposeSeoTypeID
            ]
          }
        ],
        disabled: false,
        omitted: false,
        linkType: "Entry",
      });


      // add new composite content annotations
      // this annotations are needed for:
      // Contentful:AggregateRoot - Defines this contenType as a new root or start compose Page
      // Contentful:AggregateComponent - Defines the field as a Compose component, will activate the flat view of compose on this reference
      let ContentTypeMetadata = {
        annotations: {
          ContentTypeField: {
            compose_seo: [
              {
                sys: {
                  id: "Contentful:AggregateComponent",
                  type: "Link",
                  linkType: "Annotation",
                },
              },
            ],
          },
          ContentType: [
            {
              sys: {
                id: "Contentful:AggregateRoot",
                type: "Link",
                linkType: "Annotation",
              },
            },
          ],
        },
      };

      currentCT.metadata = ContentTypeMetadata;

      console.log("saving changes for: '"+currentCT.sys.id+"'")
      // Updated the content type.
      currentCT = await currentCT.update();

      console.log("publishing changes for for: '"+currentCT.sys.id+"'")
      // Publish the content type.
      currentCT = await currentCT.publish();

      console.log("...done: '"+currentCT.sys.id+"'")
      console.log(" ")
    }
  });
}

main();

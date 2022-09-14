/**
 * based on expand and contract
 * https://github.com/contentful/cx-ps-cms-as-code-demo/blob/main/1-expand.js
 * Step 1.- Update pages with compose required fields and aggregations
 */
const conf = require("../config.js");
const mgnt = require("contentful-management");

/**
 * 1.- Set your credentials
 */
const spaceID = conf.config().spaceID;
const envID = conf.config().envID;
const accessToken = conf.config().accessToken;

/**
 * 2.- Add compose root or start pages to update. except "compose:page"
 */
const cTypesToUpdate = ["page_help_center_article", "landingpage"];
const ComposePageID = "page";

// done add a single reference field to compose:page (compose parent)
// done set refernce field as aggregate composable
// add a reference entry to compose parent

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
      conf.loggerCTF("converting: '" + currentCT.sys.id + "'");

      // Adding a reference field to compose:page parent
      currentCT.fields.push({
        id: "compose_page",
        name: "Compose PAGE fields",
        type: "Link",
        localized: false,
        required: true,
        validations: [
          {
            linkContentType: [ComposePageID],
          },
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
            compose_page: [
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

      conf.loggerCTF("saving changes for: '" + currentCT.sys.id + "'");
      // Updated the content type.
      currentCT = await currentCT.update();
      if (currentCT) {
        conf.loggerCTF(
          "publishing changes for for: '" + currentCT.sys.id + "'"
        );
      }
      // Publish the content type.
      currentCT = await currentCT.publish();
      if (currentCT) {
        conf.loggerCTF("...done: '" + currentCT.sys.id + "'");
      }
    }
  });
}

main();

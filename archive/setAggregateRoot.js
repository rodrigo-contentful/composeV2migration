/**
 * based on expand and contract
 * https://github.com/contentful/cx-ps-cms-as-code-demo/blob/main/1-expand.js
 * Step 1.- Update pages with compose required fields and aggregations
 */

const mgnt = require("contentful-management");

/**
 * 1.- Set your credentials
 */
const spaceID = "***";
const envID = "***";
const accessToken = "**";

/**
 * 2.- Add compose root or start pages to update. except "compose:page"
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
      
      

      // add new composite content annotations
      // this annotations are needed for:
      // Contentful:AggregateRoot - Defines this contenType as a new root or start compose Page
      // Contentful:AggregateComponent - Defines the field as a Compose component, will activate the flat view of compose on this reference
      let ContentTypeMetadata = {
        annotations: {
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

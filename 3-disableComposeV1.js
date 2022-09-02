/**
 * Step 3.- disable compose:page entries
 */

const mgnt = require("contentful-management");

/**
 * 1.- Set your credentials
 */
 const spaceID = "****";
 const envID = "****";
 const accessToken = "***";

/**
 *  2.- Set former compose contentType Id, from where the fields Title,Slug and Seo will be copied.
 */
const composePageID = "page";

async function main() {
  const cma = mgnt.createClient({ accessToken });
  const space = await cma.getSpace(spaceID);
  const env = await space.getEnvironment(envID);

  // Grab all the entries compose:pages to be archived.
  const composeEntriesCollection = await env.getEntries({
    content_type: composePageID,
  });

  // for each compose:page entry, unpublish and archive
  composeEntriesCollection.items.forEach(async (entry) => {
    if (entry.isPublished()) {
      console.log(
        "unpublish '" + composePageID + "' entry: '" + entry.sys.id + "' "
      );
      entry = await entry.unpublish();
    }
    if (!entry.isArchived()) {
      console.log(
        "archiving '" + composePageID + "' entry: '" + entry.sys.id + "'"
      );
      entry = await entry.archive();
    }
  });

  console.log("..done");
  console.log(" ");
}

main();

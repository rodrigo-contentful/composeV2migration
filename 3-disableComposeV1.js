/**
 * Step 3.- disable compose:page entries
 */
 const conf = require("./config.js");
 const mgnt = require("contentful-management");
 
 /**
  * 1.- Set your credentials
  */
 const spaceID = conf.config().spaceID;
 const envID = conf.config().envID;
 const accessToken = conf.config().accessToken;

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
      conf.loggerCTF(
        "unpublish '" + composePageID + "' entry: '" + entry.sys.id + "' "
      );
      entry = await entry.unpublish();
    }
    if (!entry.isArchived()) {
      conf.loggerCTF(
        "archiving '" + composePageID + "' entry: '" + entry.sys.id + "'"
      );
      entry = await entry.archive();
    }
  });

  conf.loggerCTF("..done");
  conf.loggerCTF(" ");
}

main();

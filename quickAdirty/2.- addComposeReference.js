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
const cTypesToUpdate = ["page_help_center_article"];
const ComposePageID = "page";

// done add a single reference field to compose:page (compose parent)
// done set refernce field as aggregate composable
// add a reference entry to compose parent

// set pages as root

async function main() {
  // Boilerplate for connecting to Contentful
  const cma = mgnt.createClient({ accessToken });
  const space = await cma.getSpace(spaceID);
  const env = await space.getEnvironment(envID);

  // find the selected ones, PAGES from compose
  cTypesToUpdate.forEach(async (currentCT) => {
    // on ech, add new compose fields (EXPAND)
    // Grab all the entries compose:pages of the content type we are modifying.
    const entriesCollection = await env.getEntries({
      content_type: ComposePageID,
      "fields.content.sys.contentType.sys.id": currentCT,
    });

    // set a default locale
    let defaultLocale = "en-US";
    // get true default language
    const locales = await env.getLocales();
    //  get default locale
    locales.items.forEach(async (locale) => {
      if (locale.default) {
        defaultLocale = locale.code;
      }
    });

    entriesCollection.items.forEach(async (parentPage) => {
      // get compose:page fields
      var composePageEntryID = parentPage.sys.id;

      // get a child page for current compose entry
      childPage = await env.getEntry(
        parentPage.fields.content[defaultLocale].sys.id
      );

      conf.loggerCTF(
        "working... '" + currentCT + "' entry: '" + childPage.sys.id + "'"
      );

      let pageEntryRef = {};
      pageEntryRef[defaultLocale] = {
        sys: {
          type: "Link",
          linkType: "Entry",
          id: composePageEntryID,
        },
      };

      childPage.fields.compose_page = pageEntryRef;

      conf.loggerCTF(
        "saving '" +
          currentCT +
          "' changes for entry: '" +
          childPage.sys.id +
          "'"
      );

      childPageUpdate = await childPage.update();

      if (childPage) {
        conf.loggerCTF(
          "publishing '" +
            currentCT +
            "' changes for entry: '" +
            childPage.sys.id +
            "'"
        );
        childPageDone = await childPageUpdate.publish();

        if (childPageDone) {
          conf.loggerCTF(
            "...done '" + currentCT + "' entry: '" + childPage.sys.id + "'"
          );
        }
      }
    });
  });
}

main();

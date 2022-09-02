/**
 * Step 2.- update new page fields
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
const ComposePageID = "page";

/**
 *  3.- Set new compose root or start contentType Id, to where the fields Title,Slug and Seo (from former compose) will be copied.
 */
const ComposePagesTypeToUpdate = ["page_help_center_article", "page_landing"];

async function main() {
  const cma = mgnt.createClient({ accessToken });
  const space = await cma.getSpace(spaceID);
  const env = await space.getEnvironment(envID);

  ComposePagesTypeToUpdate.forEach(async (ComposePageTypeToUpdate) => {
    // Grab all the entries compose:pages of the content type we are modifying.
    const entriesCollection = await env.getEntries({
      content_type: ComposePageID,
      "fields.content.sys.contentType.sys.id": ComposePageTypeToUpdate,
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

    // Insert IDs for the new field. Please note that this example logic is overly simplistic.
    entriesCollection.items.forEach(async (parentPage) => {
      // get compose:page fields
      var pTitle = parentPage.fields.title;
      var pSlug = parentPage.fields.slug;
      var pSeo = parentPage.fields.seo;

      // get a child page for current compose entry
      childPage = await env.getEntry(
        parentPage.fields.content[defaultLocale].sys.id
      );

      console.log(
        "updating '" +
          ComposePageTypeToUpdate +
          "' entry: '" +
          childPage.sys.id +
          "'"
      );

      if (pTitle != undefined) {
        childPage.fields["compose_title"] = pTitle;
      } else {
        childPage.fields["compose_title"][defaultLocale] =
          "undefined but required";
      }
      if (pSlug != undefined) {
        childPage.fields["compose_slug"] = pSlug;
      } else {
        childPage.fields["compose_slug"] = {};
        childPage.fields["compose_slug"][defaultLocale] =
          "undefined_but_required";
      }
      if (pSeo != undefined) {
        childPage.fields.compose_seo = pSeo;
      }

      console.log(
        "saving '" +
          ComposePageTypeToUpdate +
          "' changes for entry: '" +
          childPage.sys.id +
          "'"
      );
      childPage = await childPage.update();

      console.log(
        "publishing '" +
          ComposePageTypeToUpdate +
          "' changes for entry: '" +
          childPage.sys.id +
          "'"
      );
      childPage = await childPage.publish();

      console.log(
        "...done '" +
          ComposePageTypeToUpdate +
          "' entry: '" +
          childPage.sys.id +
          "'"
      );
      console.log(" ");
    });
  });
}

main();

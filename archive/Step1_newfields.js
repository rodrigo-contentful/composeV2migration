module.exports = function (migration) {

  /*
    to keep in mind:
    * Keep in mind to correctly duplicate localization settings, validations and the appearance of each field.
    * You might run into a situation where you are about to create a field with an ID that is already present on the page type itself 
    * (e.g. you already added a “Title” field on the page type). 
    * To make an informed decision on which of the fields (or both of them) to keep and how to migrate their content, 
    * take into consideration your content model and what kind of data those fields contain.
    */
  const ctToUpdate = migration.editContentType("composeSubPageDe");

  ctToUpdate
    .createField("title_c")
    .name("Page title")
    .type("Symbol")
    .localized(true)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  ctToUpdate
    .editField("slug_c")
    .name("Slug_c")
    .type("Symbol")
    .localized(true)
    .required(true)
    .validations([
      {
        unique: true,
      },
      {
        regexp: {
          pattern: "^((\\/)|(([\\/\\w\\-\\._~:!$&'\\(\\)*+,;@]|(%\\d+))+))$",
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  ctToUpdate
    .editField("seo")
    .name("SEO metadata")
    .type("Link")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .linkType("Entry")
    .setAnnotations(["Contentful:AggregateComponent"]);

  ctToUpdate.changeFieldControl("title_c", "builtin", "singleLine", {
    helpText: "This will be displayed at the top of the page when published",
  });

  ctToUpdate.changeFieldControl("slug_c", "builtin", "slugEditor", {
    helpText: "The last part of the URL for this page",
  });

  ctToUpdate.changeFieldControl("seo", "builtin", "entryCardEditor", {});
  ctToUpdate.setAnnotations(["Contentful:AggregateRoot"]);
};

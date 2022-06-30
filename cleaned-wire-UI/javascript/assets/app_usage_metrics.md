# Data Usage Metrics

---
:heavy_check_mark:  *Done*
:soon:            *Partially Implemented*
:grey_question:     *Not Yet Implemented*
:x:                 *Not Implementing*

---

## _beta_quick_search.html.erb
:heavy_check_mark:  ==nav-header-search==
## _criterion.html.erb
:grey_question:     search-help-keyword
## chosen-custom.js
:heavy_check_mark:  ==boolean-toggle==
## _default_social.html.erb
:heavy_check_mark:  ==my-wire==
## documents/_social_tools.html.erb
:heavy_check_mark:  ==doc-add-tag==
:heavy_check_mark:  ==doc-add-to-folder==
:heavy_check_mark:  ==doc-admin-cog==
:heavy_check_mark:  ==doc-comment==
:heavy_check_mark:  ==doc-edit==
:heavy_check_mark:  ==doc-email==
:heavy_check_mark:  ==doc-my-wire==
:heavy_check_mark:  ==doc-print==
## _facets.html.erb
:heavy_check_mark:  search-aggs-<%=aggregation.name.downcase%>-<%=row.name.parameterize(separator:"-").downcase%>
## _header.html.erb
:x:                 ~~nav-little-search~~
:x:                 ~~nav-issues~~
:heavy_check_mark:  ==nav-issues-issue-<%= issue.name><%= issue.name %>==
:x:                 ~~nav-regions~~
:heavy_check_mark:  ==nav-regions-region-<%=region.name%>"><%= region.name %>==
:grey_question:     skip-to-footer
:grey_question:     skip-to-main-content-link
## helpers/application_helper.rb
:heavy_check_mark:  ==more-link==
## home/_social_tools.html.erb
:heavy_check_mark:  ==daily-subscription==
:grey_question:     edit-this-wire
:heavy_check_mark:  ==export-zip==
:heavy_check_mark:  ==front-page-by-date==
:heavy_check_mark:  ==print-edition==
:grey_question:     rearrange-wire-sections
## _more_criteria.html.erb
:heavy_check_mark:  ==search-<%=button&.downcase%>==
:heavy_check_mark:  ==search-<%=category.downcase%>==
:grey_question:     search-hide-unused
:grey_question:     search-misc-<%=button.downcase%>
:heavy_check_mark:  ==search-show-all==
## _navmodal_wrap.html.erb
:heavy_check_mark:  ==nav-modal-close==
:heavy_check_mark:  ==nav-modal-next==
:heavy_check_mark:  ==nav-modal-previous==
## portlets_helper.rb
:grey_question:     portlet-link-#{usage_tracking_type}-#{feed_title.parameterize} ***usage_tracking_type not yet implemented. Needed for internal/external in string***
## _related_docs.html.erb
:heavy_check_mark:  ==doc-find-other-relevant==
## _related_document.html.erb
:heavy_check_mark:  ==doc-related-products==
## revisions/index.html.erb
:heavy_check_mark:  ==revision-year-selection==
## search/_social_tools.html.erb
:heavy_check_mark:  ==add-to-folder==
:heavy_check_mark:  ==clear-search==
:heavy_check_mark:  ==export-search-results==
:heavy_check_mark:  ==save-search==
:heavy_check_mark:  ==saved-searches==
:x:                 ~~search-my-wire~~
:heavy_check_mark:  ==tag-results==
:grey_question:     view-search-metrics
## shared/_nav.html.erb
:grey_question:     admin-nav-edit-another-wire
:heavy_check_mark:  ==nav-program-of-analysis==
:heavy_check_mark:  ==nav-resources==
## shared/_nav.html.erb
:heavy_check_mark:  ==admin-nav-edit-todays-wire==
:heavy_check_mark:  ==admin-nav-edit-tomorrows-wire==
:heavy_check_mark:  ==nav-front-page==
:heavy_check_mark:  ==nav-revisions==
:heavy_check_mark:  ==nav-special-editions==
:grey_question:     nav-visuals
## _sort_by.html.erb
:grey_question:     search-sort-newest
:grey_question:     search-sort-oldest
:grey_question:     search-sort-relevance
## New
:heavy_check_mark:   ==search-keyword-search==
:heavy_check_mark:   ==nav-leadership==
:heavy_check_mark:   ==front-page-featured==
:heavy_check_mark:   ==front-page-da-highlights==
:heavy_check_mark:   ==front-page-across-the-_temp_327==
:heavy_check_mark:   ==front-page-wire-feeds==
:heavy_check_mark:   ==search-layout-visuals==
:heavy_check_mark:   ==search-layout-list==
:heavy_check_mark:   ==search-layout-grid==
:x:                  ~~nav-countries~~

---
export const searchTips = {
  title: "Search Help and Advanced Usage",
  summary:
    "In conjunction with Current's Advanced Search fields, the Keywords field provides the user with a powerful interface to search for products in Current. As with all search engines, the more specific and well-formed your query, the quicker you will find the data that you are looking for.",
  sections: [
    {
      title: "Terms",
      content:
        "<p>A search query using the Keywords field is broken up into <span class='color'>terms</span> and <span class='color'>operators</span>. Terms, or the words for which you search, come into two types: <span class='color'>Single Terms</span> and <span class='color'>Phrases</span>. A Single Term is one word, such as <span class='color'>Protest</span>. Single terms can be enclosed in quotation marks if the user wants an exact match (only return matches for \"protest\"). Single terms without quotation marks will execute word stemming. A Phrase is multiple words used within quotation marks, such as <span class='color'>\"peaceful protest\"</span>. This search will return only exact phrase matches and will not execute stemming.</p><br><p>Note: When searching with quotation marks, it is extremely important to use regular double quotes - not single quotation marks - and close the quotation marks to end the phrase appropriately.</p>",
    },
    {
      title: "Operators (AND/OR/NOT)",
      content:
        "<p>Boolean operators allow terms and phrases to be combined through logic operations. Current supports AND, OR, and NOT operators. Operators must be capitalized to work. AND is the default when no operator exists between two terms without quotes. For example, <span class='color'>peaceful protest </span>is the same as searching for <span class='color'>peaceful AND protest</span>.</p>",
    },
    {
      title: "AND",
      content:
        '<p>The AND operator matches documents where both terms exist anywhere in the text of a single document. To search for documents that mention peaceful protests in Switzerland, enter the following into the Keywords field: <span class=\'color\'>Switzerland AND "peaceful protests"</span></p><br><p>Note: This example will not return documents with the phrases "peaceful protestor" or "peaceful protest" (unless the document happens to also contain "peaceful protest_s_"). Since "peaceful protests" is in quotes, it will only search that exact phrase.</p>',
    },
    {
      title: "OR",
      content:
        '<p>The OR operator links two terms or phrases to find matching documents that contain either word/phrase. To find all documents on Switzerland and find all documents on "peaceful protests" (not just for Switzerland), use the query: <span class=\'color\'>Switzerland OR "peaceful protests"</span>.</p>',
    },
    {
      title: "NOT",
      content:
        "<p>The NOT operator excludes documents that contain the term or phrase that immediately follow NOT. To search for documents that contain the phrase \"protest situation\" but have no mention of the word England, you would search: <span class='color'>\"protest situation\" NOT England</span></p><br><p>The NOT operator cannot be used with just one term. If you enter the keywords <span class='color'>NOT England</span> the search will treat NOT as a term, not an operator. This will produce the same search results as entering: <span class='color'>not AND England</span></p>",
    },
    {
      title: "Capitalization",
      content:
        "<p>Terms in Current keyword searches are case insensitive; BRAZIL is the same as Brazil is the same as brazil. By tokenizing and analyzing in this fashion, Current decreases the number of tokens necessary to maintain the index and increases the search accuracy when it comes to incorrectly capitalized terms.</p><br><p>For operators, capitalization is essential - operators will only function when written in ALL CAPS (AND/OR/NOT). Lowercase operators will be treated as simple search terms. For example: <span class='color'>cyber or security</span> = <span class='color'>cyber AND or AND security</span></p>",
    },
    {
      title: "Grouping",
      content:
        '<p>Current supports using parentheses to group clauses (term or phrase predicates) to form sub queries. This can be very useful when running complex queries.</p><br><p>Let\'s say you need to find all products on cyber security for China or Hong Kong. If you try creating a query without parentheses, you would write the following: <span class=\'color\'>"cyber security" AND china OR "hong kong"</span></p><br><p>The above query will return all documents that have the phrase cyber security AND China, and will also return all documents with Hong Kong (regardless of cyber security). That produces the same results as if you put parentheses around the first two terms: <span class=\'color\'>("cyber security" AND china) OR "hong kong"</span></p><br><p>In order to ensure you find just cyber security products on either country, you need to add parentheses around the countries: <span class="color">"cyber security" AND (China OR "Hong Kong")</span> This eliminates any confusion and ensures that we are searching for all documents with the phrase cyber security, and within that set of documents either the term China or the phrase Hong Kong, resulting in a much more useful result set.</p><br><p>It is important to always close all open parentheses, especially as you get more complex queries. For example: <span class="color">"cyber security" AND (China OR "Hong Kong") NOT Beijing</span> This query will take all of the documents from the original query and eliminate all documents that reference Beijing.</p>',
    },
    {
      title: "Stemming",
      content:
        "<p>All terms in the Keywords field without quotation marks are subject to word stemming. Stemming is intended to help the user find variations of a search term by finding the root word of your search term and automatically adding suffixes or pluralization without forcing the user to manually enter all of the variations.</p><br><p>For example, if I enter the term <span class='color'>project</span> (without quotation marks), I will get results with all of the following variations: <span class='color'>project</span> or <span class='color'>projects</span> or <span class='color'>projecting</span> or <span class='color'>projections</span> or <span class='color'>projected</span> ...etc</p><br><p>It is important to note that stemming also works in reverse. If you search for the term <span class='color'>projections</span> you will still get all of the variations listed above. If you only want documents with the exact match on <span class='color'>projections</span> you will need to put it in quotation marks.</p><br><p>As a less obvious example, to find variations on <span class='color'>militarization</span> you can simply enter <span class='color'>militar</span> into the keyword field and get the following results: <span class='color'>Militarize, militarized, militarization, militarizations, </span>etc.</p>",
    },
    {
      title: "Analyzers",
      content:
        "<p>Spellings of common terms can often vary greatly across documents. To resolve this issue, Current uses word delimiters, case changes, number parts, lowercase filter, etc, to generate filters for querying to help you find the data that you are looking for.</p><br><p>For example, say there are six documents that have divergent spellings of Al-Qa'ida. The Keyword search field is smart enough to ignore the punctuation and search for a simplified token:</p><br><p>term in doc: <span class='color'>Al-Qa'ida</span> is tokenized to: <span class='color'>qaida</span><br>term in doc: <span class='color'>al Qaida</span> is tokenized to: <span class='color'>qaida</span><br>term in doc: <span class='color'>Al-Qiada</span> is tokenized to: <span class='color'>qiada</span><br>term in doc: <span class='color'>Al Qeada</span> is tokenized to: <span class='color'>qeada</span><br>term in doc: <span class='color'>d'Al-Qaida</span> is tokenized to: <span class='color'>qaida</span><br>term in doc: <span class='color'>Al-Qeada-linked</span> is tokenized to: <span class='color'>qeada</span></p><br><p>Therefore, utilizing the following query will return all six results: <span class='color'>qaida OR qiada OR qeada</span></p>",
    },
    {
      title: "Boosting and Relevance",
      content:
        '<p>To "boost" a term, or tell the search engine you want that term/phrase to have a higher priority, use the caret symbol (^) to indicate boost, and apply a boost factor (a number) at the end of the term you are searching. The higher the boost factor, the higher a priority the term will receive within your search results. The boost factor is a simple multiplier, so using "^1" does nothing to boost your search term.</p><br><p>Let\'s look at the following example: <span class=\'color\'>brazil^8 OR protest OR (mexico AND "tropical storms")^50</span></p><br><p>If you sort by relevance, the third part of the predicate, (mexico and "tropical storms") received the greatest boost (50x) and will be presented before anything with brazil or protest. Although there is no limit on the boost factor, the boost factor must be positive. It can be less than 1 (e.g. 0.2), which will reduce the relevency of a term lower than that of the rest of the terms in your query.</p><br><p>By default, Current sorts search results by date, ensuring that users get the most recent reporting first, regardless of the relevance. However, users may be performing searches where they want the most relevant results (those that best align to the search criteria) rather than by date. Current allows this process through term/phrase boosting.</p><br><p>Relevance only applies to OR operator searches. No matter the relevancy of the terms, if you use them in a conjunctive clause (AND), boosting will be ignored since all terms are required to be in the document.</p>',
    },
    {
      title: "Proximity (nearness) Searches",
      content:
        "<p>Please note that the Current search engine does not allow proximity searches (only returning results where two or more terms are found within a certain number of words in the document).</p>",
    },
  ],
};

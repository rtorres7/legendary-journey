In conjunction with Current's Advanced Search fields, the Keywords field provides the user with a powerful interface to search for products in Current. As with all search engines, the more specific and well-formed your query, the quicker you will find the data that you are looking for.
<br>

<h2 id="Terms" class="font-semibold text-xl">Terms</h2> <br>

A search query using the _Keywords_ field is broken up into `terms` and `operators`. Terms, or the
words for which you search, come in two types: _Single Terms_ and _Phrases_.
<br>

A _Single Term_ is one word, such as `Protest`. Single terms can be enclosed in quotation marks if
the users wants an exact match (only return matches for ‘protest’). Single terms without quotation
marks will execute word _stemming_.
<br>

A Phrase is multiple words used within quotation marks, such as “`violent protest`.” This search
will return only exact phrase matches and will not execute _stemming_.
<br>

Note: When searching with quotation marks it is extremely important to use regular double
quotes - not single quotation marks - and close the quotation marks to end the phrase
appropriately.
<br>

<h2 id="Operators" class="font-semibold text-xl">Operators (AND/OR/NOT)</h2><br>

Boolean operators allow terms and phrases to be combined through logic operations. Current supports
AND, OR, and NOT operators. _Operators must be capitalized to work_.
<br>

_AND is the default when no operator exists between two terms without quotes_. For example,
`airlift operations` is the same as searching for `airlift AND operations`.
<br>

<h2 id="AND" class="font-semibold text-xl">AND</h2><br>

The _AND_ operator matches documents where both terms exist anywhere in the text of a single
document.
<br>

To search for documents that mention airlift operations in Brazil, enter the following into the
_Keywords_ field:

`brazil AND "airlift operations"`
<br>

Note: This example will not return documents with the phrases “airlift operator” or “airlift
operation” (unless the document happens to also contains “airlift operation*s*”). Since “airlift
operations” is in quotes it will only search that exact phrase.
<br>

<h2 id="OR" class="font-semibold text-xl">OR</h2><br>

The _OR_ operator links two terms or phrases to find matching documents that contain either
word/phrase.
<br>

To find all documents on Brazil and find all documents on "airlift operation" (not just for
Brazil), use the query:

`brazil OR "airlift operation"`
<br>

<h2 id="NOT" class="font-semibold text-xl">NOT</h2><br>

The _NOT_ operator excludes documents that contain the term or phrase that immediately follows NOT.
To search for documents that contain the phrase “protest situation” but have no mention of the word
China, you would search:

`“protest situation” NOT china`
<br>

The NOT operator cannot be used with just one term. If you enter the keywords `NOT Beijing` the
search will treat NOT as a term, not an operator. This will produce the same search results as
entering:

`not AND china`
<br>

<h2 id="Capitalization" class="font-semibold text-xl">Capitalization</h2><br>

Terms in Current keyword searches are case insensitive, `BRAZIL` is the same as `Brazil` is the same
as `brazil`. By tokenizing and analyzing in this fashion, Current decreases the number of tokens
necessary to maintain the index and increases the search accuracy when it comes to incorrectly
capitalized terms.
<br>

For operators, capitalization is essential – operators will only function when written in ALL CAPS
(AND/OR/NOT). Lower-case operators will be treated as simple search terms. For example:

`cyber or security = cyber AND or AND security`
<br>

<h2 id="Grouping" class="font-semibold text-xl">Grouping</h2><br>

Current supports using parentheses to group clauses (term or phrase predicates) to form sub queries.
This can be very useful when running complex queries.
<br>

Let’s say you need to find all products on cyber security for China or Hong Kong. If you try
creating a query without parentheses you would write the following:

`"cyber security" AND china OR "hong kong"`
<br>

The above query will return all documents that have the phrase cyber security AND China, and will
also return all documents with Hong Kong (regardless of cyber security). That produces the same
results as if you put parentheses around the first two terms:

`("cyber security" AND china) OR "hong kong"`
<br>

In order to ensure you find just cyber security products on either country, you need to add
parentheses around the countries:

`"cyber security" AND (China OR "Hong Kong")`
<br>

This eliminates any confusion and ensures that we are searching for all documents with the phrase
cyber security, and within that set of documents either the term China or the phrase Hong Kong,
resulting in a much more useful result set.
<br>

It is important to always close all open parentheses, especially as you get more complex queries.
For example:

`"cyber security" AND (China OR "Hong Kong") NOT Beijing`
<br>

This query will take all of the documents from the original query and eliminate all documents that
reference Beijing.
<br>

<h2 id="Stemming" class="font-semibold text-xl">Stemming</h2><br>

All terms in the _Keywords_ field _without quotation marks_ are subject to word stemming. Stemming
is intended to help the user find variations of a search term by finding the root word of your
search term and automatically adding suffixes or pluralization without forcing the user to manually
enter all of the variations.
<br>

For example, if I enter the term `project` (without quotation marks) I will get results with all of
the following variations:

`project` or `projects` or `projecting` or `projections` or `projected` or... etc, etc
<br>

It is important to note that stemming also works in reverse. If you search for the term
`projections` you will still get all of the variations listed above. If you only want documents
with the exact match on `projections` you will need to put it in quotation marks.
<br>

As a less obvious example, to find variations on `militarization` you can simply enter `militar`
into the keyword field and get the following results:

`Militarize, militarized, militarization, militarizations, etc.`
<br>

<h2 id="Analyzers" class="font-semibold text-xl">Analyzers</h2><br>

Since Current receives raw transcripts, open source documents, foreign language attachments and more
from around the world, spellings of common terms may vary greatly across documents. To resolve this
issue, Current uses word delimiters, case changes, number parts, lower case filter, etc, to generate
filters for querying to help you find the data that you are looking for.
<br>

For example, say we have 6 documents that have divergent spellings of Al-Qa`ida. The Keyword search
field is smart enough to ignore the punctuation and search for a simplified token:
<br>

Term in doc: _Al-Qa`ida_ is tokenized to: _qaida_
Term in doc: _al Qaida_ is tokenized to: _qaida_
Term in doc: _Al-Qiada_ is tokenized to: _qiada_
Term in doc: _Al Qeada_ is tokenized to: _qeada_
Term in doc: _d'Al-Qaida_ is tokenized to: _qaida_
Term in doc: _Al-Qeada-linked_ is tokenized to: _qeada_

<br>
Therefore, utilizing the following query will return all six results:

`qaida OR qiada OR qeada`
<br>

<h2 id="Boosting" class="font-semibold text-xl">Boosting and Relevance</h2><br>

By default, Current sorts search results by date ensuring that users get the most recent intelligence
reporting first, regardless of relevance. However, users may be performing searches where they want
the most relevant results (those that best align to the search criteria) rather than by date. The
Current allows this process through term/phrase boosting.
<br>

In order to sort by relevance you must change the _SORT BY_ field to Relevance (as opposed to the
default setting of “Date: Newest First”)
<br>

To “boost” a term, or tell the search engine you want that term/phrase to have a higher priority,
use the caret symbol (\^) to indicate boost, and apply a boost factor (a number) at the end of the
term you are searching. The higher the boost factor, the higher a priority the term will receive
within your search results. The boost factor is a simple multiplier, so using “^1” does nothing to
boost your search term.
<br>

Let’s look at the following example:

`brazil^8 OR airlift OR (iran AND "chemical weapons")^50`
<br>

If you sort by relevance, the third part of the predicate, `((iran and "chemical weapons"))`
received the greatest boost (50x) and will be presented before anything with brazil or airlift.
Although there is no limit on the boost factor, the boost factor must be positive. It can be less
than 1 (e.g. 0.2), which will reduce the relevancy of a term lower than that of the rest of the
terms in your query.
<br>

Relevance only applies to OR operator searches. No matter the relevancy of the terms, if you use
them in a conjunctive clause (AND), boosting will be ignored since all terms are required to be in
the document.
<br>

<h2 id="Proximity" class="font-semibold text-xl">Proximity (nearness) Searches</h2><br>

Please note that the Current search engine does not allow proximity searches (only returning results
where two or more terms are found within a certain number of words in the document).

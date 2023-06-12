<template>
  <div id="tips" class="flex space-x-8">
    <div class="basis-1/4">
      <div
        class="sticky top-[75px] lg:top-[125px] flex flex-col space-y-2 pr-6 border-r border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
      >
        <h2>Table of Contents</h2>
        <ul>
          <li><a href="#terms">Terms</a></li>
          <li><a href="#operators">Operators</a></li>
          <ul>
            <li><a href="#and">AND</a></li>
            <li><a href="#or">OR</a></li>
            <li><a href="#not">NOT</a></li>
          </ul>
          <li><a href="#capitalization">Capitalization</a></li>
          <li><a href="#grouping">Grouping</a></li>
          <li><a href="#analyzers">Analyzers</a></li>
          <li><a href="#stemming">Stemming</a></li>
          <li><a href="#boosting">Boosting and Relevance</a></li>
          <li><a href="#proximity">Proximity</a></li>
        </ul>
      </div>
    </div>
    <div class="basis-3/4">
      <h1>Search Help and Advanced Usage <a id="top"></a></h1>
      <p>
        In conjunction with the Current Advanced Search fields, the Keywords
        field provides the user with a powerful interface to search the Current
        holdings. As with all search engines, the more specific and well-formed
        your query, the quicker you will find the data that you are looking for.
      </p>

      <h2>Terms <a id="terms"></a></h2>
      <p>
        A search query using the <span class="italic">Keywords</span> field is
        broken up into <span class="highlight">terms</span> and
        <span class="highlight">operators</span>. Terms, or the words for which
        you search, come in two types:
        <span class="italic">Single Terms</span> and
        <span class="italic">Phrases</span>.
      </p>
      <p>
        A <span class="italic">Single Term</span> is one word, such as
        <span class="highlight">Protest</span>. Single terms can be enclosed in
        quotation marks if the users wants an exact match (only return matches
        for ‘protest’). Single terms without quotation marks will execute word
        <a href="#stemming">stemming</a>.
      </p>
      <p>
        A Phrase is multiple words used within quotation marks, such as “<span
          class="highlight"
          >violent protest</span
        >.” This search will return only exact phrase matches and will not
        execute <a href="#stemming">stemming</a>.
      </p>
      <p>
        Note: When searching with quotation marks it is extremely important to
        use regular double quotes - not single quotation marks - and close the
        quotation marks to end the phrase appropriately.
      </p>
      <h2>
        Operators (AND/OR/NOT) <a id="operators"></a>
        <a href="#top">(Back to Top)</a>
      </h2>
      <p>
        Boolean operators allow terms and phrases to be combined through logic
        operations. Current supports AND, OR, and NOT operators.
        <span class="italic">Operators must be capitalized to work</span>.
      </p>
      <p>
        <span class="italic"
          >AND is the default when no operator exists between two terms without
          quotes</span
        >. For example, <span class="highlight">airlift operations</span> is the
        same as searching for
        <span class="highlight">airlift AND operations</span>.
      </p>
      <h2>AND <a id="and"></a> <a href="#top">(Back to Top)</a></h2>
      <p>
        The <span class="italic">AND</span> operator matches documents where
        both terms exist anywhere in the text of a single document. To search
        for documents that mention airlift operations in Brazil, enter the
        following into the <span class="italic">Keywords</span>
        field:
      </p>
      <p><span class="highlight">brazil AND "airlift operations"</span></p>
      <p>
        Note: This example will not return documents with the phrases “airlift
        operator” or “airlift operation” (unless the document happens to also
        contains “airlift operation*s*”). Since “airlift operations” is in
        quotes it will only search that exact phrase.
      </p>
      <h2>OR <a id="or"></a> <a href="#top">(Back to Top)</a></h2>
      <p>
        The <span class="italic">OR</span> operator links two terms or phrases
        to find matching documents that contain either word/phrase. To find all
        documents on Brazil and find all documents on "airlift operation" (not
        just for Brazil), use the query:
      </p>
      <p><span class="highlight">brazil OR "airlift operation"</span></p>
      <h2>NOT <a id="not"></a> <a href="#top">(Back to Top)</a></h2>
      <p>
        The <span class="italic">NOT</span> operator excludes documents that
        contain the term or phrase that immediately follows NOT. To search for
        documents that contain the phrase “protest situation” but have no
        mention of the word China, you would search:
      </p>
      <p><span class="highlight">“protest situation” NOT china</span></p>
      <p>
        The NOT operator cannot be used with just one term. If you enter the
        keywords <span class="highlight">NOT Beijing</span> the search will
        treat NOT as a term, not an operator. This will produce the same search
        results as entering:
      </p>
      <p><span class="highlight">not AND china</span></p>
      <h2>
        Capitalization <a id="capitalization"></a>
        <a href="#top">(Back to Top)</a>
      </h2>
      <p>
        Terms in Current keyword searches are case insensitive,
        <span class="highlight">BRAZIL</span> is the same as
        <span class="highlight">Brazil</span> is the same as
        <span class="highlight">brazil</span>. By tokenizing and analyzing in
        this fashion, Current decreases the number of tokens necessary to
        maintain the index and increases the search accuracy when it comes to
        incorrectly capitalized terms.
      </p>
      <p>
        For operators, capitalization is essential – operators will only
        function when written in ALL CAPS (AND/OR/NOT). Lower-case operators
        will be treated as simple search terms. For example:
      </p>
      <p>
        <span class="highlight"
          >cyber or security = cyber AND or AND security</span
        >
      </p>
      <h2>Grouping <a id="grouping"></a> <a href="#top">(Back to Top)</a></h2>
      <p>
        Current supports using parentheses to group clauses (term or phrase
        predicates) to form sub queries. This can be very useful when running
        complex queries.
      </p>
      <p>
        Let’s say you need to find all products on cyber security for China or
        Hong Kong. If you try creating a query without parentheses you would
        write the following:
      </p>
      <p>
        <span class="highlight">"cyber security" AND china OR "hong kong"</span>
      </p>
      <p>
        The above query will return all documents that have the phrase cyber
        security AND China, and will also return all documents with Hong Kong
        (regardless of cyber security). That produces the same results as if you
        put parentheses around the first two terms:
      </p>
      <p>
        <span class="higlight"
          >("cyber security" AND china) OR "hong kong"</span
        >
      </p>
      <p>
        In order to ensure you find just cyber security products on either
        country, you need to add parentheses around the countries:
      </p>
      <p>
        <span class="highlight"
          >"cyber security" AND (China OR "Hong Kong")</span
        >
      </p>
      <p>
        This eliminates any confusion and ensures that we are searching for all
        documents with the phrase cyber security, and within that set of
        documents either the term China or the phrase Hong Kong, resulting in a
        much more useful result set.
      </p>
      <p>
        It is important to always close all open parentheses, especially as you
        get more complex queries. For example:
      </p>
      <p>
        <span class="highlight"
          >"cyber security" AND (China OR "Hong Kong") NOT Beijing</span
        >
      </p>
      <p>
        This query will take all of the documents from the original query and
        eliminate all documents that reference Beijing.
      </p>
      <h2>Stemming <a id="stemming"></a> <a href="#top">(Back to Top)</a></h2>
      <p>
        All terms in the <span class="italic">Keywords</span> field
        <span class="italic">without quotation marks</span> are subject to word
        stemming. Stemming is intended to help the user find variations of a
        search term by finding the root word of your search term and
        automatically adding suffixes or pluralization without forcing the user
        to manually enter all of the variations.
      </p>
      <p>
        For example, if I enter the term
        <span class="highlight">project</span> (without quotation marks) I will
        get results with all of the following variations:
      </p>
      <p>
        <span class="highlight">project</span> or
        <span class="highlight">projects</span> or
        <span class="highlight">projecting</span> or
        <span class="highlight">projections</span> or
        <span class="highlight">projected</span> or... etc, etc
      </p>
      <p>
        It is important to note that stemming also works in reverse. If you
        search for the term <span class="highlight">projections</span> you will
        still get all of the variations listed above. If you only want documents
        with the exact match on <span class="highlight">projections</span>
        you will need to put it in quotation marks.
      </p>
      <p>
        As a less obvious example, to find variations on
        <span class="highlight">militarization</span> you can simply enter
        <span class="highlight">militar</span> into the keyword field and get
        the following results:
      </p>
      <p>
        <span class="highlight"
          >Militarize, militarized, militarization, militarizations, etc.</span
        >
      </p>
      <h2>Analyzers <a id="analyzers"></a> <a href="#top">(Back to Top)</a></h2>
      <p>
        Since Current receives raw transcripts, open source documents, foreign
        language attachments and more from around the world, spellings of common
        terms may vary greatly across documents. To resolve this issue, Current
        uses word delimiters, case changes, number parts, lower case filter,
        etc, to generate filters for querying to help you find the data that you
        are looking for.
      </p>
      <p>
        For example, say we have 6 documents that have divergent spellings of
        Al-Qa`ida. The Keyword search field is smart enough to ignore the
        punctuation and search for a simplified token:
      </p>
      <table>
        <tr>
          <th>doc #</th>
          <th>term in doc</th>
          <th>is tokenized to</th>
        </tr>
        <tr>
          <td>doc 1</td>
          <td>Al-Qa`ida</td>
          <td>qaida</td>
        </tr>
        <tr>
          <td>doc 2</td>
          <td>al Qaida</td>
          <td>qaida</td>
        </tr>
        <tr>
          <td>doc 3</td>
          <td>Al-Qiada</td>
          <td>qiada</td>
        </tr>
        <tr>
          <td>doc 4</td>
          <td>Al Qeada</td>
          <td>qeada</td>
        </tr>
        <tr>
          <td>doc 5</td>
          <td>d'Al-Qaida</td>
          <td>qaida</td>
        </tr>
        <tr>
          <td>doc 6</td>
          <td>Al-Qeada-linked</td>
          <td>qeada</td>
        </tr>
      </table>
      <p>
        Therefore, utilizing the following query will return all six results:
      </p>
      <p><span class="highlight">qaida OR qiada OR qeada</span></p>
      <h2>
        Boosting and Relevance <a id="boosting"></a>
        <a href="#top">(Back to Top)</a>
      </h2>
      <p>
        By default, Current sorts search results by date ensuring that users get
        the most recent intelligence reporting first, regardless of relevance.
        However, users may be performing searches where they want the most
        relevant results (those that best align to the search criteria) rather
        than by date. The Current allows this process through term/phrase
        boosting.
      </p>
      <p>
        In order to sort by relevance you must change the
        <span class="italic">SORT BY</span> field to Relevance (as opposed to
        the default setting of “Date: Newest First”):
      </p>
      <img
        id="search-relevancy"
        src="@/assets/search-tips.jpg"
        alt="select the Relevance option from the Sort By dropdown"
        class="mb-12"
      />
      <p>
        To “boost” a term, or tell the search engine you want that term/phrase
        to have a higher priority, use the caret symbol (\^) to indicate boost,
        and apply a boost factor (a number) at the end of the term you are
        searching. The higher the boost factor, the higher a priority the term
        will receive within your search results. The boost factor is a simple
        multiplier, so using “^1” does nothing to boost your search term.
      </p>
      <p>Let’s look at the following example:</p>
      <p>
        <span class="highlight"
          >brazil^8 OR airlift OR (iran AND "chemical weapons")^50</span
        >
      </p>
      <p>
        If you sort by relevance, the third part of the predicate,
        <span class="highlight">((iran and "chemical weapons"))</span> received
        the greatest boost (50x) and will be presented before anything with
        brazil or airlift. Although there is no limit on the boost factor, the
        boost factor must be positive. It can be less than 1 (e.g. 0.2), which
        will reduce the relevancy of a term lower than that of the rest of the
        terms in your query.
      </p>
      <p>
        Relevance only applies to OR operator searches. No matter the relevancy
        of the terms, if you use them in a conjunctive clause (AND), boosting
        will be ignored since all terms are required to be in the document.
      </p>
      <h2>
        Proximity (nearness) Searches <a id="proximity"></a>
        <a href="#top">(Back to Top)</a>
      </h2>
      <p>
        Please note that the Current search engine does not allow proximity
        searches (only returning results where two or more terms are found
        within a certain number of words in the document).
      </p>
    </div>
  </div>
</template>
<script></script>
<style lang="scss">
#tips {
  @apply lg:w-3/4;
  h1 {
    @apply font-semibold text-2xl pt-4 pb-2 mb-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25;
  }
  h2 {
    @apply font-medium text-xl mt-6 mb-4 pb-2 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25;
  }
  h3 {
    @apply font-medium mt-4 mb-2;
  }
  hr {
    @apply border-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/50;
  }
  em {
    @apply bg-transparent;
  }
  code {
    @apply text-sm rounded-md p-1 bg-slate-100 dark:bg-slate-700 energy:bg-zinc-700;
  }
  a {
    @apply hover:underline text-mission-light-blue dark:text-teal-300 energy:text-energy-yellow;
  }
  ul {
    @apply list-disc pl-8 pb-4;
    ul {
      list-style-type: circle;
      @apply pl-8;
    }
  }
  table {
    td {
      @apply border border-slate-900/50 dark:border-slate-700 energy:border-zinc-700 text-center py-2 px-4;
    }
    tr:nth-child(2n) {
      @apply bg-slate-100/75 dark:bg-slate-600/10 energy:bg-zinc-600/10;
    }
    th {
      @apply border border-slate-900/50 dark:border-slate-700 energy:border-zinc-700 text-center py-2 px-4;
    }
  }
  p {
    @apply mt-2 mb-4;
  }
  .highlight {
    @apply bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700;
  }
}
</style>

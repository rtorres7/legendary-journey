import { date } from "joi";
const constant = require("../util/constant.js");
const EventLog = require("../models/event_log");

class AggregatedMetricsService {
  constructor() {
    this.client = require("../data/elasticsearch");
    this.index = "eventlogs";
  }

  async _createDateRangeFilter(startDate, endDate) {
    if (startDate || endDate) {
      return {
        range: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
      };
    }
    return null;
  }

  async getProductViewsCountForMultipleProducts(productIds) {
    try {
      const viewCounts = await EventLog.aggregate([
        {
          $match: {
            productId: { $in: productIds },
            eventType: constant.EVENT_TYPES.PRODUCT_VIEW,
          },
        },
        {
          $group: {
            _id: "$productId",
            count: { $sum: 1 },
          },
        },
      ]);

      const viewsLookup = {};
      viewCounts.forEach((entry) => {
        viewsLookup[entry._id] = entry.count;
      });

      return viewsLookup;
    } catch (err) {
      console.error("Error fetching product view counts", err);
      return {};
    }
  }

  async getUniqueReadershipByOrganizationForProduct(
    productId,
    startDate,
    endDate,
  ) {
    const dateFilter = await this._createDateRangeFilter(startDate, endDate);
    const queryFilters = [
      { term: { productId: productId } },
      { term: { eventType: "PRODUCT_VIEW" } },
    ];
    if (dateFilter) queryFilters.push(dateFilter);

    const result = await this.client.search({
      index: this.index,
      query: {
        bool: {
          filter: queryFilters,
        },
      },
      aggs: {
        organizations: {
          terms: {
            field: "organization.id",
            size: 100, //TODO: Returns top 100 organizations. Need to paginate?
          },
          aggs: {
            organization_name: {
              terms: { field: "organization.name.keyword" },
            },
            unique_users: {
              cardinality: {
                field: "userId",
              },
            },
          },
        },
      },
      size: 0,
    });

    const readershipData = result.aggregations.organizations.buckets.map(
      (bucket) => {
        return {
          name: bucket.organization_name.buckets[0]?.key,
          y: bucket.doc_count,
        };
      },
    );

    // If there's no data, push a placeholder entry
    if (readershipData.length === 0) {
      readershipData.push({
        name: "No Data",
        y: 1,
      });
    }

    const uniqueReadershipCount =
      readershipData[0].name === "No Data"
        ? 1
        : result.aggregations.organizations.buckets.reduce(
            (acc, bucket) => acc + bucket.unique_users.value,
            0,
          );

    return {
      metrics: {
        readership: readershipData,
        uniqueReadership: uniqueReadershipCount,
      },
    };
  }

  async getTotalViewsForProductsPublishedByOrganization(
    organizationName,
    startDate,
    endDate,
  ) {
    const dateFilter = await this._createDateRangeFilter(startDate, endDate);
    const queryFilters = [
      {
        term: {
          "meta.producingOffices.name.keyword": organizationName,
        },
      },
      { term: { eventType: "PRODUCT_VIEW" } },
    ];

    if (dateFilter) queryFilters.push(dateFilter);

    const result = await this.client.search({
      query: {
        bool: {
          filter: queryFilters,
        },
      },
      aggs: {
        total_views: {
          value_count: {
            field: "productId",
          },
        },
      },
    });

    const totalViews = result.aggregations.total_views.value;

    return {
      totalViews: totalViews,
    };
  }
}

module.exports = AggregatedMetricsService;
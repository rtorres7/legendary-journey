import { expect, jest } from '@jest/globals';
import 'jest-extended';
import { Client } from 'minio';
import request from 'supertest';
import { StartedTestContainer } from 'testcontainers';

import logger from '../../src/config/logger';
import { MinioContainerUtils } from '../__utils__/containerUtils';
import { articles, metadata } from '../__utils__/dataLoader';
import { setupAppWithUser } from '../__utils__/expressUtils';

jest.mock('../../src/services/product-service.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      findAllByDate: jest.fn().mockImplementation(() => {
        logger.info('ProductServiceMock.findAllByDate:');
        return Promise.resolve([articles[1]]);
      }),
      findByProductNumber: jest.fn().mockImplementation(() => {
        logger.info('ProductServiceMock.findByProductNumber:');
        return Promise.resolve(articles[0]);
      }),
      updateProduct: jest.fn().mockImplementation(() => {
        logger.info('ProductServiceMock.updateProduct:');
        return Promise.resolve(articles[0]);
      }),
      createProduct: jest.fn().mockImplementation(() => {
        logger.info('ProductServiceMock.createProduct:');
        return Promise.resolve(articles[0]);
      }),
      findById: jest.fn().mockImplementation(() => {
        logger.info('ProductServiceMock.findById:');
        return Promise.resolve(articles[0]);
      }),
      deleteProduct: jest.fn().mockImplementation(() => {
        logger.info('ProductServiceMock.deleteProduct:');
        return Promise.resolve(true);
      }),
      addAttachment: jest.fn().mockImplementation(() => {
        logger.info('ProductServiceMock.addAttachment:');
        return Promise.resolve(true);
      }),
    };
  });
});

jest.mock('../../src/services/metadata.js', () => {
  return jest.fn().mockImplementation(() => {
    // prettier-ignore
    return {
      findCountriesFor:           jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.countries.values),
      findSubRegionsForCountries: jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.subregions.values),
      findRegionsForSubRegions:   jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.regions.values),
      findTopicsFor:              jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.topics.values),
      findIssuesForTopics:        jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.issues.values),
      findProducingOfficesFor:    jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.producing_offices.values),
      findCoauthorsFor:           jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.coauthors.values),
      findCoordinatorsFor:        jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.coordinators.values),
      findDissemOrgsFor:          jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.dissem_orgs.values),
      findProductType:            jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.product_types.values[0]),
      findReportingTypeFor:       jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.reporting_types.values[0]),
      findNonStateActorsFor:      jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.non_state_actors.values),
    };
  });
});

const USER = { id: 1, firstName: 'First', lastName: 'Last', dn: 'O=org,OU=orgunit,CN=commonname' };

describe('Article Attachment Routes', () => {

  let server: StartedTestContainer;
  let port: number;
  let client: Client;

  beforeAll(async () => {
    server = await MinioContainerUtils.startContainer();
    client = MinioContainerUtils.newClient();
  });

  describe('Attachments', () => {

    afterEach(() => {
      jest.clearAllMocks();
      delete process.env.THROW_TEST_ERROR;
    });

    describe('POST /articles/:productNumber/attachments', () => {
      it('should put an attachment in the object store', async () => {
        const router = require('../../src/routes/articles');
        const app = setupAppWithUser(router, USER);

        const original = articles[0];
        const postData = {
          document_action: 'save',
          classification: 'S',
          id: original.id,
          date_published: original.datePublished,
          doc_num: original.productNumber,
          countries: ['AFG'],
          topics: ['TERR'],
          producing_offices: ['ANCESTRY', 'OTHER'],
          coauthors: ['ANCESTRY'],
          coordinators: ['ANCESTRY'],
          dissem_orgs: ['ANCESTRY'],
          product_type_id: 10378,
        };

        // create product
        await request(app)
          .post('/articles/processDocument')
          .send(postData)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(async (res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.date).toEqual(original.datePublished.toISOString());
            expect(res.body.doc_num).toBe(original.productNumber);
            expect(res.body.id).toBe(original.id);
            expect(res.body.state).toBe(original.state);
          });

        const file = await MinioContainerUtils.fileWriteRandomToTmp();
        let attachmentId: string;

        // create attachment
        await request(app)
          .post(`/articles/${original.id}/attachments`)
          .field('Content-Type', 'multipart/form-data')
          .set({ connection: 'keep-alive' })
          .attach('file', file)
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .then(async (res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.att_id).toBeDefined();
            logger.info(`att_id:${res.body.thumbnail_id}`);
          });

        /*
      // can't run this since product service is mocked and does not return saved attachments
      // get attachment
      await request(app)
        .get(`/articles/${original.id}/attachments/${attachmentId}`)
        .expect(200)
        .expect('Content-Type', /binary/)
        .then(async (res) => {
          expect(res.body.success).toBe(true);
        });
      */
      });
    });
  });
});

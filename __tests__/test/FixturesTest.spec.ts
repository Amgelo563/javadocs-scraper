import { join as pathJoin } from 'path';
import { describe, it } from 'vitest';
import { Scraper } from '../../src';
import { generateJavadocs } from '../expected/ExpectedJavadocsFactory';
import { FixtureJavaVersions, generatePath } from './FixtureJavaVersion';
import { annotationsMatch } from './matchers/AnnotationMatcher';
import { classesMatch } from './matchers/ClassMatcher';
import { enumsMatch } from './matchers/EnumMatcher';
import { collectionsMatch } from './matchers/generic/CollectionMatcher';
import { interfacesMatch } from './matchers/InterfaceMatcher';
import { packagesMatch } from './matchers/PackageMatcher';

const testsRoot = pathJoin(__dirname, '..');

describe('Fixtures', () => {
  for (const version of FixtureJavaVersions) {
    describe(`Java ${version}`, () => {
      const expected = generateJavadocs(version);
      const path = generatePath(version, testsRoot);

      it.concurrent('matches expected packages', async () => {
        const scraper = Scraper.fromPath(path);
        const actual = await scraper.scrape();

        const packagesHaveMatched = collectionsMatch({
          got: actual.getPackages(),
          expected: expected.getPackages(),
          comparator: ({ got, expected }) => {
            return packagesMatch({
              got,
              expected,
            });
          },
        });

        if (packagesHaveMatched !== true) {
          throw new Error(`Failed: ${packagesHaveMatched}`);
        }
      });

      it.concurrent('matches expected interfaces', async () => {
        const scraper = Scraper.fromPath(path);
        const actual = await scraper.scrape();

        const interfacesHaveMatched = collectionsMatch({
          got: actual.getInterfaces(),
          expected: expected.getInterfaces(),
          comparator: ({ got, expected }) => {
            return interfacesMatch({
              got,
              expected,
            });
          },
        });

        if (interfacesHaveMatched !== true) {
          throw new Error(`Failed: ${interfacesHaveMatched}`);
        }
      });

      it.concurrent('matches expected annotations', async () => {
        const scraper = Scraper.fromPath(path);
        const actual = await scraper.scrape();

        const annotationsHaveMatched = collectionsMatch({
          got: actual.getAnnotations(),
          expected: expected.getAnnotations(),
          comparator: ({ got, expected }) => {
            return annotationsMatch({
              got,
              expected,
            });
          },
        });

        if (annotationsHaveMatched !== true) {
          throw new Error(`Failed: ${annotationsHaveMatched}`);
        }
      });

      it.concurrent('matches expected enums', async () => {
        const scraper = Scraper.fromPath(path);
        const actual = await scraper.scrape();

        const enumsHaveMatched = collectionsMatch({
          got: actual.getEnums(),
          expected: expected.getEnums(),
          comparator: ({ got, expected }) => {
            return enumsMatch({
              got,
              expected,
            });
          },
        });

        if (enumsHaveMatched !== true) {
          throw new Error(`Failed: ${enumsHaveMatched}`);
        }
      });

      it.concurrent('matches expected classes', async () => {
        const scraper = Scraper.fromPath(path);
        const actual = await scraper.scrape();

        const classesHaveMatched = collectionsMatch({
          got: actual.getClasses(),
          expected: expected.getClasses(),
          comparator: ({ got, expected }) => {
            return classesMatch({
              got,
              expected,
            });
          },
        });

        if (classesHaveMatched !== true) {
          throw new Error(`Failed: ${classesHaveMatched}`);
        }
      });
    });
  }
});

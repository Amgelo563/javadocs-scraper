## [2.1.2](https://github.com/Amgelo563/javadocs-scraper/compare/v2.1.1...v2.1.2) (2025-07-24)

### Bug Fixes

* **annotation-element:** dont replace prototype so url isn't changed ([5a72f20](https://github.com/Amgelo563/javadocs-scraper/commit/5a72f20fe72d61fde0ef71f8b3fd21222d8cea51))

## [2.1.1](https://github.com/Amgelo563/javadocs-scraper/compare/v2.1.0...v2.1.1) (2025-07-22)

### Bug Fixes

* remove unused function ([94ecc2a](https://github.com/Amgelo563/javadocs-scraper/commit/94ecc2a191b3e1594dbc74cc747f8778f4921b14))

## [2.1.0](https://github.com/Amgelo563/javadocs-scraper/compare/v2.0.0...v2.1.0) (2025-07-21)

### Features

* add java 7 support ([cde4cb0](https://github.com/Amgelo563/javadocs-scraper/commit/cde4cb0f7d689f889d77a2dc2decaa5bc75544ed))

## [2.0.0](https://github.com/Amgelo563/javadocs-scraper/compare/v1.5.2...v2.0.0) (2025-07-20)

### ⚠ BREAKING CHANGES

* split annotation element logic from MethodScraper to a new scraper
* split strategies into multiple sub-interfaces
* make DeprecationContent#forRemoval non nullable

### Features

* type Javadocs properties as Collections ([cb29cd0](https://github.com/Amgelo563/javadocs-scraper/commit/cb29cd0e23c59cfb77870e210ccc3869e0ab8458))

### Bug Fixes

* add objects to their respective package after patching ([506a892](https://github.com/Amgelo563/javadocs-scraper/commit/506a89250e206a6c4bd52278c7beea9941e237c7))
* **annotation-element:** fix getting incorrect blocks for description ([6875df3](https://github.com/Amgelo563/javadocs-scraper/commit/6875df34e5c1915e82d8ade960275ae0908a0b98))
* **annotation-element:** fix legacy table, name and deprecation queries ([17ca6f4](https://github.com/Amgelo563/javadocs-scraper/commit/17ca6f443b5614d451697eacbe8382473b6a4616))
* correctly query extensions for java 13 and 14 ([1c3cac0](https://github.com/Amgelo563/javadocs-scraper/commit/1c3cac0e297b1f1f5c349497baf89a3b9e00007a))
* **enum-constant:** fix table queries for most versions ([7425e2b](https://github.com/Amgelo563/javadocs-scraper/commit/7425e2b1264bb3b4cee7d0ba08d28d0d82d2e74f))
* export new strategies ([518df00](https://github.com/Amgelo563/javadocs-scraper/commit/518df00bb6a71af1c95e89c72b8b8541dc611cf9))
* **field:** correctly fallback deprecation html to text ([29c9a16](https://github.com/Amgelo563/javadocs-scraper/commit/29c9a16f4d1ab3f97173926b028a2097da28d98c))
* **field:** fix missing deprecation if it didn't have a comment ([4d3808c](https://github.com/Amgelo563/javadocs-scraper/commit/4d3808cd0d40938f3eae61efc3af5a1859b5d416))
* fix nullability check for node contents ([a7a9d9f](https://github.com/Amgelo563/javadocs-scraper/commit/a7a9d9f81b6150d00a13bd1f82daaa987c137ef7))
* fix object description query from java 13 to 16 ([59794b2](https://github.com/Amgelo563/javadocs-scraper/commit/59794b2da05a62d2c2a5009bc4d57869ac17e073))
* fix object signature query from java 13 to 16 ([b2d4fe5](https://github.com/Amgelo563/javadocs-scraper/commit/b2d4fe5a431876b1c7f434a06b04bfaad41b2528))
* **method:** fix edge-cases for return type and deprecation detection ([fa6721b](https://github.com/Amgelo563/javadocs-scraper/commit/fa6721bc0a76793620ee8038aebc941ceae9c644))
* **method:** fix incorrect return type being extracted for some versions ([2cf0724](https://github.com/Amgelo563/javadocs-scraper/commit/2cf0724a3834324cadcfada2e0eef7ce4ddaa291))
* **method:** fix nullability for description and edge-case with type params ([2ed5708](https://github.com/Amgelo563/javadocs-scraper/commit/2ed57080a2f46b9bb3aab44317f191dbe6e8f990))
* **method:** yet another deprecation fix for java 15 ([fcd0f96](https://github.com/Amgelo563/javadocs-scraper/commit/fcd0f96c597b088c24ec8a39f0f07ba6809b592b))
* more accurate strategy resolution method ([79486ff](https://github.com/Amgelo563/javadocs-scraper/commit/79486fff7ac3f1198cffea00edfa1d63c2d35aaf))
* **object:** fix deprecation querying for various versions ([a4ace97](https://github.com/Amgelo563/javadocs-scraper/commit/a4ace97b4015b85ad2411d96a9beefff6322d98c))
* patch method prototype arguments for legacy javadocs ([2c8abd9](https://github.com/Amgelo563/javadocs-scraper/commit/2c8abd91de028f9ee7849ce2493d280d31e4685e))
* patch method prototypes for legacy javadocs ([ae884b2](https://github.com/Amgelo563/javadocs-scraper/commit/ae884b24843a51898ba2eb133462e0b4ba31207f))
* strip whitespace from signatures ([f3623c1](https://github.com/Amgelo563/javadocs-scraper/commit/f3623c106d78cfe8b65daa037c4a6bdc81e3b8e3))

### Code Refactoring

* make DeprecationContent[#for](https://github.com/Amgelo563/javadocs-scraper/issues/for)Removal non nullable ([af30391](https://github.com/Amgelo563/javadocs-scraper/commit/af3039183837a85c656425004abd80c3cefa0246))
* split annotation element logic from MethodScraper to a new scraper ([9018dda](https://github.com/Amgelo563/javadocs-scraper/commit/9018dda4847cf65c42e67400b2e1267127dc5aed))
* split strategies into multiple sub-interfaces ([71ecb9f](https://github.com/Amgelo563/javadocs-scraper/commit/71ecb9f85c7a0a857d14e67d73076b5dcc9cfeff))

## [1.5.2](https://github.com/Amgelo563/javadocs-scraper/compare/v1.5.1...v1.5.2) (2025-07-13)

### Bug Fixes

* also omit fields from annotation when annotations on it are parsed ([c2d9e61](https://github.com/Amgelo563/javadocs-scraper/commit/c2d9e61177df8252335897efe3a4897c5e001ebe))

## [1.5.1](https://github.com/Amgelo563/javadocs-scraper/compare/v1.5.0...v1.5.1) (2025-07-13)

### Bug Fixes

* omit extra fields from annotations ([84b58d6](https://github.com/Amgelo563/javadocs-scraper/commit/84b58d6484b53e11a66c9047958d540fa1067069))

## [1.5.0](https://github.com/Amgelo563/javadocs-scraper/compare/v1.4.9...v1.5.0) (2025-06-26)

### Features

* add FileFetcher ([6d0bf55](https://github.com/Amgelo563/javadocs-scraper/commit/6d0bf554dd83362dc7c84a3c4a46aab157705ae5))

### Bug Fixes

* omit extra fields from parameters in enum constants ([d37ced9](https://github.com/Amgelo563/javadocs-scraper/commit/d37ced9e9f68b06ce3b24ccaa756b285fc917d67))
* scrape enum fields and constants separately ([c922aab](https://github.com/Amgelo563/javadocs-scraper/commit/c922aabd7d9d681df9d6002e5b96d5a180b7a499))

## [1.4.9](https://github.com/Amgelo563/javadocs-scraper/compare/v1.4.8...v1.4.9) (2025-06-05)

### Bug Fixes

* delete extra partials due to base object scraper ([94b9a8c](https://github.com/Amgelo563/javadocs-scraper/commit/94b9a8cc365661f83ad37ea65f0d7e715793eda4))

## [1.4.8](https://github.com/Amgelo563/javadocs-scraper/compare/v1.4.7...v1.4.8) (2025-06-05)

### Bug Fixes

* delete partial data from outputs ([ff8c6ae](https://github.com/Amgelo563/javadocs-scraper/commit/ff8c6ae1b577963486ecdfbc49190b8c1dd66b03))

## [1.4.7](https://github.com/Amgelo563/javadocs-scraper/compare/v1.4.6...v1.4.7) (2025-05-08)

### Bug Fixes

* fix annotations being included in parameter types ([dc8d4a0](https://github.com/Amgelo563/javadocs-scraper/commit/dc8d4a08ef240974d4876fcde4d6d3d8a3fc0f7b))

## [1.4.6](https://github.com/Amgelo563/javadocs-scraper/compare/v1.4.5...v1.4.6) (2025-04-28)

### Bug Fixes

* omit "Description copied from" label from descriptions ([86b2487](https://github.com/Amgelo563/javadocs-scraper/commit/86b2487768c8d9e6917d2a7ccb577c161521a5b4))

## [1.4.5](https://github.com/Amgelo563/javadocs-scraper/compare/v1.4.4...v1.4.5) (2025-04-28)

### Bug Fixes

* patch present inheritance instead of ignoring, consistently use id as key ([548e0d4](https://github.com/Amgelo563/javadocs-scraper/commit/548e0d44dde32c6a4b8e09bdf9f51e4421026324))

## [1.4.4](https://github.com/Amgelo563/javadocs-scraper/compare/v1.4.3...v1.4.4) (2025-04-24)

### Bug Fixes

* fix annotation element and method return types ([abf9465](https://github.com/Amgelo563/javadocs-scraper/commit/abf9465e5e9c6ccd2f5a718a1e8dd41c8c175955))

### Reverts

* Revert "fix: fix return type for annotation elements" ([8173691](https://github.com/Amgelo563/javadocs-scraper/commit/81736918c15f7f85fd40985540c393256a68f930))

## [1.4.3](https://github.com/Amgelo563/javadocs-scraper/compare/v1.4.2...v1.4.3) (2025-04-24)

### Bug Fixes

* fix return type for annotation elements ([ee66b01](https://github.com/Amgelo563/javadocs-scraper/commit/ee66b0126842a24c3bda9e49767d84eb03eef005))

## [1.4.2](https://github.com/Amgelo563/javadocs-scraper/compare/v1.4.1...v1.4.2) (2025-04-24)

### Bug Fixes

* add support for empty annotation targets (@Target({})) ([0df69bd](https://github.com/Amgelo563/javadocs-scraper/commit/0df69bd5afc9ae5565926a8b5ec00a7ade449993))

## [1.4.1](https://github.com/Amgelo563/javadocs-scraper/compare/v1.4.0...v1.4.1) (2025-04-21)

### Bug Fixes

* fix field and method querying on some legacy versions ([50ee8c9](https://github.com/Amgelo563/javadocs-scraper/commit/50ee8c9c0eb8ad2a8debea7e7d5225ff8b134c6f))
* fix missing selectors on b9a9202 ([de8c78b](https://github.com/Amgelo563/javadocs-scraper/commit/de8c78b2e3f0083fe0d7d5980d112ba6ba71a325))
* fix root tabs query with modern javadocs ([b9a9202](https://github.com/Amgelo563/javadocs-scraper/commit/b9a92020592211f5f46d76aa2062b37d9daba8e3))

## [1.4.0](https://github.com/Amgelo563/javadocs-scraper/compare/v1.3.0...v1.4.0) (2024-11-25)

### Features

* add missing top level documentation ([ab361ca](https://github.com/Amgelo563/javadocs-scraper/commit/ab361ca313625c131f8a6874586aa647ddab497b))

### Bug Fixes

* remove unreleased typedoc version ([3765129](https://github.com/Amgelo563/javadocs-scraper/commit/3765129a0174b17c08eee94255dd75f7b0b9c6d7))

## [1.3.0](https://github.com/Amgelo563/javadocs-scraper/compare/v1.2.0...v1.3.0) (2024-11-25)

### Features

* add AnnotationData[#targets](https://github.com/Amgelo563/javadocs-scraper/issues/targets) ([d60684e](https://github.com/Amgelo563/javadocs-scraper/commit/d60684e6cf21336f43761052ebfa82d85cbcb758))
* export AnnotationElementData ([06ae72d](https://github.com/Amgelo563/javadocs-scraper/commit/06ae72d8ec9d8fd6c4c72de863298145613579af))

## [1.2.0](https://github.com/Amgelo563/javadocs-scraper/compare/v1.1.0...v1.2.0) (2024-11-16)

### Features

* fallback to text for node content ([e29b76c](https://github.com/Amgelo563/javadocs-scraper/commit/e29b76c3bd7b5387323c01717580fc3862eb958c))

## [1.1.0](https://github.com/Amgelo563/javadocs-scraper/compare/v1.0.1...v1.1.0) (2024-11-15)

### Features

* add EnumConstantData[#url](https://github.com/Amgelo563/javadocs-scraper/issues/url) ([53f5a91](https://github.com/Amgelo563/javadocs-scraper/commit/53f5a91162aa87726770ad0fa1f13bd083dad09d))
* only include tarball to github release ([7fac72a](https://github.com/Amgelo563/javadocs-scraper/commit/7fac72a5521eb657426697dcae5b6097214189b0))

## [1.0.1](https://github.com/Amgelo563/javadocs-scraper/compare/v1.0.0...v1.0.1) (2024-11-12)

### Bug Fixes

* add build step to release ([017b92a](https://github.com/Amgelo563/javadocs-scraper/commit/017b92ac72e33d2370b74cfe1851cfd0e6ed0769))

## 1.0.0 (2024-11-12)

### ⚠ BREAKING CHANGES

* initial commit

### Features

* initial commit ([9e924c5](https://github.com/Amgelo563/javadocs-scraper/commit/9e924c578ea754bef46ecc03a0f59f00a16dc3f0))

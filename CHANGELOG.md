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

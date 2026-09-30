import { sum } from "./stats";

type SeriesAnalysisCache = {
  deltas: number[];
  dispersion: number;
  mean: number;
  median: number;
  max: number;
  min: number;
  range: number;
  sorted: number[];
  sigma: number;
  std: number;
  sum: number;
};

type SeriesDuplicationKey = {
  [K in keyof SeriesAnalysisCache]: SeriesAnalysisCache[K] extends number[]
  ? K : never;
}[keyof SeriesAnalysisCache];

export class Series {
  private series: number[];
  private cacheData: Partial<SeriesAnalysisCache>;

  constructor(series: number[]) {
    this.series = series;
    this.cacheData = {};
  }

  static from(series: number[]) {
    return new Series(series);
  }

  private cache<
    K extends keyof SeriesAnalysisCache
  >(prop: K, callback: () => SeriesAnalysisCache[K]) {
    const existing = this.cacheData[prop];
    if (existing !== undefined) return existing;
    const updated = callback();
    this.cacheData = { ...this.cacheData, [prop]: updated };
    return updated;
  }

  clone(key: SeriesDuplicationKey) {
    return new Series(this[key]);
  }

  get data() { return this.series; };

  get deltas() {
    return this.cache('deltas', () => {
      const [previous, ...series] = this.data;
      const { deltas } = series.reduce(
        ({ deltas, previous }, value) => ({
          deltas: [...deltas, value - previous],
          previous: value
        }),
        { deltas: [], previous }
      );
      return deltas;
    });
  }
  get last() { return this.data[this.data.length - 1]; }
  get sum() {
    return this.cache('sum', () => sum(this.series));
  }
  get mean() {
    return this.cache('mean', () => this.sum / this.series.length);
  }
  get sorted() {
    return this.cache('sorted', () => [...this.series].sort());
  }
  get median() {
    return this.cache('median', () => {
      const length = this.series.length;
      const middle = length / 2;
      const median = length % 2 === 0
        ? (this.sorted[middle] + this.sorted[middle - 1]) / 2
        : this.sorted[Math.floor(middle)]
        ;
      return median;
    });
  }

  get max() {
    return this.cache('max', () => Math.max(...this.series));
  }
  get min() {
    return this.cache('min', () => Math.min(...this.series));
  }
  get range() {
    return this.cache('range', () => Math.abs(this.max - this.min));
  }
  get dispersion() {
    return this.cache(
      'dispersion',
      () => this.range === 0 ? 0 : this.range / Math.max(
        Math.abs(this.min), Math.abs(this.max)
      )
    );
  }
  get std() {
    return this.cache('std', () => {
      const mean = this.mean;
      const squaredDifferences = this.series.map((value) => Math.pow(value - mean, 2));
      const meanSquaredDifference = squaredDifferences.reduce((a, b) => a + b, 0) / squaredDifferences.length;
      return Math.sqrt(meanSquaredDifference);
    });
  }
}

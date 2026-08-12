import { sum } from "./stats";

type SeriesAnalysisCache = {
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

export class Series {
  private series: number[];
  private cache: Partial<SeriesAnalysisCache>;

  constructor(series: number[]) {
    this.series = series;
    this.cache = {};
  }

  static from(series: number[]) {
    return new Series(series);
  }

  private setCache<
    K extends keyof SeriesAnalysisCache
  >(prop: K, callback: () => SeriesAnalysisCache[K]) {
    const existing = this.cache[prop];
    if (existing !== undefined) return existing;
    const updated = callback();
    this.cache = { ...this.cache, [prop]: updated };
    return updated;
  }

  get sum() {
    return this.setCache('sum', () => sum(this.series));
  }
  get mean() {
    return this.setCache('mean', () => this.sum / this.series.length);
  }
  get sorted() {
    return this.setCache('sorted', () => [...this.series].sort());
  }
  get median() {
    return this.setCache('median', () => {
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
    return this.setCache('max', () => Math.max(...this.series));
  }
  get min() {
    return this.setCache('min', () => Math.min(...this.series));
  }
  get range() {
    return this.setCache('range', () => Math.abs(this.max - this.min));
  }
  get dispersion() {
    return this.setCache(
      'dispersion',
      () => this.range === 0 ? 0 : this.range / Math.max(
        Math.abs(this.min), Math.abs(this.max)
      )
    );
  }
  get std() {
    return this.setCache('std', () => {
      const mean = this.mean;
      const squaredDifferences = this.series.map((value) => Math.pow(value - mean, 2));
      const meanSquaredDifference = squaredDifferences.reduce((a, b) => a + b, 0) / squaredDifferences.length;
      return Math.sqrt(meanSquaredDifference);
    });
  }
}

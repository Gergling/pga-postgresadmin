export const PARETO_CONSTANT = 15;

export const getParetoProgressFactory = (paretoScalar = 1) => {
  const scalar = paretoScalar * PARETO_CONSTANT;
  return (value: number) => {
    const weight = scalar + 1;
    const offset = scalar * value;
    const denominator = weight - offset;
    return value / denominator;
  };
};

type LanguageModelResponse = {
  content: string;
  type: 'success';
} | {
  model: string;
  type: 'traffic';
};
export type OptionType<ID extends string = string> = {
  duplicate?: boolean;
  id?: ID;
  inputValue?: string;
  title: string;
}

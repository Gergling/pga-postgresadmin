import { TypesaurusCore } from "typesaurus";

export type TsCollectionDef<
  Name extends string,
  Model extends TypesaurusCore.ModelType,
  CustomId = false,
  CustomName = false,
  BasePath extends string | false = false,
> = TypesaurusCore.CollectionDef<Name, Model, CustomId, CustomName, BasePath>;

export type TsDoc<CollectionDef extends TsCollectionDef<string, TypesaurusCore.ModelType>> = TypesaurusCore.Doc<CollectionDef, TypesaurusCore.DocProps & {
  environment: TypesaurusCore.RuntimeEnvironment;
}>

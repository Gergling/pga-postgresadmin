// Assume envelopes.

// Very much this is in-progress.

// The idea is to just make sure relationships between envelopes that might be
// stored are standardised. This is because combined ids must always be in the
// same order, and it will always be a string id named `id` at the base of the
// object.
// Additionally, we probably want callbacks for when records are linked,
// unlinked, or when the link itself is updated to express a change in the
// connection, however this may represent a simpler envelope one-to-many
// relationship.
// Ideally, create the situation(s) first, rather than second-guessing to the
// maximum YAGNI.

import z from "zod";

type Relationship<
  Name extends string,
  Schema extends z.ZodType, // rich envelope schema
  Summarisation extends object
> = {
  name: Name;
  schema: Schema,
  summarisation: Summarisation;
};

type AnyRelationship = Relationship<string, z.ZodType, object>;

type FncParams<RelationshipSchema extends z.ZodType> = {
  schema: RelationshipSchema,
  data: z.infer<RelationshipSchema>
}

type RelationshipFactoryParamsTransform<
  R extends AnyRelationship,
> = {
  schema: R['schema'],
  summarise?: (props: FncParams<R['schema']>) => R['summarisation'],
}

type RelationshipHelper<
  RelationshipA extends AnyRelationship,
  RelationshipB extends AnyRelationship
> = {
  a: RelationshipA['name'];
  b: RelationshipB['name'];
  map: {
    [K in RelationshipA['name']]: RelationshipA;
  } & {
    [K in RelationshipB['name']]: RelationshipB;
  };
};

// type RelationshipFactoryParams<
//   Helper extends RelationshipHelper<AnyRelationship, AnyRelationship>,
//   Join extends AnyRelationship
// > = {
//   a: Helper['a']; b: Helper['b'];
//   relationship: {
//     [Name in keyof Helper['map']]: RelationshipFactoryParamsTransform<Helper['map'][Name]>
//   };
//   join?: {
//     schema: z.ZodType, // Maybe this should be restricted to a special schema
//     // type that joins two envelopes together by id.
//     summarise: (props: {
//       relationship: {
//         [K in keyof Helper['map']]: FncParams<Helper['map'][K]['schema']>;
//       }
//     } & { join: Join['schema'] }) => Join['summarisation'];
//   };
//   persist: (props: {
//     relationship: {
//       [K in keyof Helper['map']]: FncParams<Helper['map'][K]['schema']>;
//     }
//   } & { join: FncParams<Join['schema']> }) => Promise<void>;
// };

// Currently thinking in terms of many-to-many relationships.
const relationshipFactory = <
  // RelationshipAName extends string,
  // RelationshipASchema extends z.ZodType,
  // RelationshipASummaryResponse extends object,
  // RelationshipBName extends string,
  // RelationshipBSchema extends z.ZodType,
  // RelationshipBSummaryResponse extends object,
  // JoinSchema extends z.ZodType,
  // JoinSummaryResponse extends object,
  Helper extends RelationshipHelper<AnyRelationship, AnyRelationship>,
  Join extends AnyRelationship,
//   Params extends RelationshipFactoryParams<
//     RelationshipHelper<
//       Relationship<RelationshipAName, RelationshipASchema, RelationshipASummaryResponse>,
//       Relationship<RelationshipBName, RelationshipBSchema, RelationshipBSummaryResponse>
//     >,
//     Relationship<"join", JoinSchema, JoinSummaryResponse>
//   > = RelationshipFactoryParams<
//     RelationshipHelper<
//       Relationship<RelationshipAName, RelationshipASchema, RelationshipASummaryResponse>,
//       Relationship<RelationshipBName, RelationshipBSchema, RelationshipBSummaryResponse>
//     >,
//     Relationship<"join", JoinSchema, JoinSummaryResponse>
//   >
// >(props: Params) => (
>(props: {
  a: Helper['a']; b: Helper['b'];
  relationship: {
    [
    Name in keyof Helper['map']
    ]: RelationshipFactoryParamsTransform<Helper['map'][Name]>
  };
  join?: {
    schema: z.ZodType, // Maybe this should be restricted to a special schema
    // type that joins two envelopes together by id.
    summarise: (props: {
      relationship: {
        [K in keyof Helper['map']]: FncParams<Helper['map'][K]['schema']>;
      }
    } & { join: Join['schema'] }) => Join['summarisation'];
  };
  persist: (props: {
    relationship: {
      [K in keyof Helper['map']]: FncParams<Helper['map'][K]['schema']>;
    }
  } & { join: FncParams<Join['schema']> }) => Promise<void>;
}) => (
    // >(props: RelationshipFactoryParams<
    //   RelationshipHelper<
    //     Relationship<RelationshipAName, RelationshipASchema, RelationshipASummaryResponse>,
    //     Relationship<RelationshipBName, RelationshipBSchema, RelationshipBSummaryResponse>
    //   >,
    //   Relationship<"join", JoinSchema, JoinSummaryResponse>
    // >) => (
    // function which takes row data from A and generates summary for B.
    // function which takes row data from B and generates summary for A.
    // must be assumed as included in both functions, so type output can be
    // id, data.
    // function which takes both sets of data and generates join record.
    // at least one of the above must be provided.
    // persistence function (required) is asynchronous and is fed the results of
    // all three functions.
  ) => (a: any, b: any) => { };

// Currently thinking in terms of many-to-many relationships.
class RelationshipConfiguration<
  Helper extends RelationshipHelper<AnyRelationship, AnyRelationship>,
  Join extends AnyRelationship,
> {
  config: any;
  constructor(params: {
    a: Helper['a']; b: Helper['b'];
    relationship: {
      [
      Name in keyof Helper['map']
      ]: RelationshipFactoryParamsTransform<Helper['map'][Name]>
    };
    join?: {
      schema: z.ZodType, // Maybe this should be restricted to a special schema
      // type that joins two envelopes together by id.
      summarise: (props: {
        relationship: {
          [K in keyof Helper['map']]: FncParams<Helper['map'][K]['schema']>;
        }
      } & { join: Join['schema'] }) => Join['summarisation'];
    };
  }) {
    this.config = params;
  }

  // Functions:
  // Link: supply ids + metadata
  //   Updates both record summaries for ids.
  // Unlink: supply ids
  //  Updates both record summaries for ids.
  // UnlinkAll: supply id
  // Update: select by ids, update metadata
}
// Usage:
const taskProjectsRelationship = relationshipFactory({
  a: 'project', b: 'task',
  relationship: {
    project: {
      schema: z.object({
        name: z.string(), type: z.enum(['local', 'git'])
      })
    },
    task: {
      schema: z.object({
        id: z.string(), status: z.enum(['todo', 'doing', 'done'])
      })
    },
  },
  // schema: {
  //   project: z.string(), // required
  //   task: z.string(), // required
  //   join: z.string(), // required with join function provided, otherwise omitted
  // },
  // summarise: {
  //   ({ schema, data }) => {
  //     // summarise project data for the task
  //   },
  //   ({ schema, data }) => {
  //     // summarise task data for the project
  //   },
  // },
  // join: ({ project, task }) => {
  //   // create join transform data
  // },
  persist: async ({ join, relationship: { project, task } }) => {
    const projectSchema = project.schema;
    const projectData = project.data;
    // const projectType = projectData.type;
    // persist the relationship
  },
});

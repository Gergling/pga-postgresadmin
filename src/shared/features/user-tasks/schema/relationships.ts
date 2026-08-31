import z from "zod";

const taskRelationshipProposalSchema = z.union([
  z.literal('child').describe(
    'The task appears to describe a specific step in completing the candidate task.'
  ),
  z.literal('parent').describe(
    'The task appears to encapsulate the scope of the candidate task.'
  ),
  z.literal('predecessor').describe(
    'The task appears to require completion in order to complete the candidate task.'
  ),
  z.literal('successor').describe(
    'The task appears to require the completion of the candidate task to be completed itself.'
  )
]);

export type TaskRelationshipProposal = z.infer<
  typeof taskRelationshipProposalSchema
>;

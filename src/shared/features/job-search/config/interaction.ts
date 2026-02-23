import { ChatBubble, Email, Phone } from "@mui/icons-material";

export const JOB_SEARCH_INTERACTION_TYPES = [
  {
    icon: Email,
    name: 'email',
    label: 'Email',
    validate: (value: string) => {
      const [local, domain] = value.split('@');
      const [domainName, tld] = domain ? domain.split('.') : [];
      const criteria = [local, domainName, tld];
      const validity = criteria.every(Boolean);
      return {
        criteria,
        validity,
      };
    },
  },
  {
    icon: Phone,
    name: 'phone',
    label: 'Phone',
    validate: (value: string) => {
      // TODO: Loop through and check each character is not a letter.
      // const notANumber = Number.isNaN(value);
      return {
        criteria: [true],
        validity: true,
      };
    },
  },
  {
    icon: ChatBubble,
    name: 'other',
    label: 'Other',
    validate: () => ({ criteria: [true], validity: true }),
  },
] as const;
export type JobSearchInteractionType = typeof JOB_SEARCH_INTERACTION_TYPES[number]['name'];

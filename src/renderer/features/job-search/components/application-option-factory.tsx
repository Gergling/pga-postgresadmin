import { JobSearchArchetype } from "../../../../shared/features/job-search";
import { AutocompleteId, AutocompleteListItem, AutocompleteTitle, OptionType } from "../../../shared/autocomplete";
import { JobSearchOptionType } from "../types";
import { getShortSalary } from "../utilities";

const ApplicationAutocompleteListItem = ({
  application,
  option,
  ...props
}: React.HTMLAttributes<HTMLLIElement> & {
  application?: JobSearchArchetype['base']['applications'];
  option: OptionType<JobSearchArchetype['id']['applications']>;
}) => {
  const jobTitle = option.title.length > 10 ? `${option.title.slice(0, 10)}...` : option.title;
  const salary = application ? getShortSalary(application.salary) : '';
  const company = application?.company ? application.company.name : '(Unknown Company)';

  return <AutocompleteListItem {...props}>
    {option.inputValue && (
      <span style={{ color: '#ffcc00', fontWeight: 'bold' }}>
        + CREATE:
      </span>
    )}
    <AutocompleteTitle>{jobTitle}</AutocompleteTitle>
    <AutocompleteId>{salary} @ {company}</AutocompleteId>
  </AutocompleteListItem>
};

export const autocompleteRenderOptionFactory = (
  applications: Map<JobSearchArchetype['id']['applications'], JobSearchArchetype['base']['applications']> | undefined,
  options: OptionType<JobSearchArchetype['id']['applications']>[],
) => {
  const optionsArr = [...options.values()];
  return (
    props: React.HTMLAttributes<HTMLLIElement>,
    optionProp: string | JobSearchOptionType<'applications'>,
  ) => {
    const option = typeof optionProp === 'string' ? optionsArr.find(({ title }) => title === optionProp) : optionProp;

    if (!option) {
      console.warn('how do we not have an option?', optionProp, optionsArr)
      return null;
    }

    const application = option.id && applications?.get(option.id);

    return (
      <ApplicationAutocompleteListItem
        {...props}
        application={application}
        key={`${option.id}_${option.title}`}
        option={option}
      />
    );
  };
};

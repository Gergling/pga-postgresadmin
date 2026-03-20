import { useMutation, useQuery } from "@tanstack/react-query";
import { CrmCompanyTransfer, CrmSchema, hydrateCrmCompany } from "../../../../shared/features/crm";
import { useIpc } from "../../../shared/ipc";
import { getCollectionKeyFactory, useIpcCreateFactory, useQueryDataFactory } from "../../../libs/react-query";

const getCollectionKey = getCollectionKeyFactory<CrmSchema>();

export const useCrmCompanyIpc = (companyId?: CrmCompanyTransfer['id']) => {
  const { createCompany: createCompanyIpc, fetchRecentCompanies, fetchCompany, updateCompany } = useIpc();
  const setQueryData = useQueryDataFactory<CrmCompanyTransfer>('companies');

  const {
    create: createCompany,
    createError: createCompanyError,
    createIsError: createCompanyIsError,
  } = useIpcCreateFactory(
    createCompanyIpc,
    'companies',
    hydrateCrmCompany,
  );

  const {
    data: company,
    isLoading: fetchCompanyIsLoading,
    isError: fetchCompanyIsError,
    error: fetchCompanyError,
  } = useQuery({
    enabled: !!companyId,
    queryKey: getCollectionKey('companies', companyId),
    queryFn: () => companyId ? fetchCompany(companyId) : undefined,
    select: (model) => model || undefined,
  });
  const {
    data: companies,
    isLoading: fetchRecentCompanyIsLoading,
    isError: fetchRecentCompanyIsError,
    error: fetchRecentCompanyError,
  } = useQuery({
    queryKey: getCollectionKey('companies'),
    queryFn: () => fetchRecentCompanies(),
  });

  const {
    mutate: updateCompanyMutation,
    isError: updateCompanyIsError,
    error: updateCompanyError,
  } = useMutation({
    mutationFn: updateCompany,
    onSuccess: setQueryData,
  });

  return {
    companies,
    company,
    createCompanyError,
    createCompanyIsError,
    createCompany,
    fetchCompanyError,
    fetchCompanyIsError,
    fetchCompanyIsLoading,
    fetchRecentCompanyError,
    fetchRecentCompanyIsError,
    fetchRecentCompanyIsLoading,
    updateCompanyError,
    updateCompanyIsError,
    updateCompany: updateCompanyMutation,
  };
};

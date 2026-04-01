import { useQuery } from "@tanstack/react-query";
import { useIpc } from "@/renderer/shared/ipc";

export const useProjects = () => {
  const { fetchProjectsList } = useIpc();
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjectsList(),
  });
  return { projects };
};

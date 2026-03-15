import { useQuery } from "@tanstack/react-query";
import { getPolicy } from "@/apis/option/policyApi";

export const usePolicy = () =>
  useQuery<{ result: string }, unknown, string>({
    queryKey: ["policy"],
    queryFn: () => getPolicy(),
    select: data => data.result,
  });

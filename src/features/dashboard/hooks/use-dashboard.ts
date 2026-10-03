import { useMutation, useQuery } from '@tanstack/react-query';

import { endpoints } from '@/lib/api/endpoints';
import { dashboardKeys } from '@/lib/api/keys';

export const useDashboard = () => useQuery({ queryKey: dashboardKeys.all, queryFn: endpoints.dashboard });

/** Runs only when "Brief me" is pressed, never on load. It is rules over the dashboard data, not a model call. */
export const useBriefing = () => useMutation({ mutationFn: endpoints.briefing });

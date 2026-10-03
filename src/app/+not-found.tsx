import { useRouter } from 'expo-router';

import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { copy } from '@/lib/copy';

export default function NotFound() {
  const router = useRouter();
  return (
    <Screen header={false}>
      <EmptyState
        title={copy.notFound.page.title}
        description={copy.notFound.page.body}
        actionLabel="Go home"
        onAction={() => router.replace('/')}
      />
    </Screen>
  );
}

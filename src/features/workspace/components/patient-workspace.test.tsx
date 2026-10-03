import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ApiError } from '@/lib/api/errors';

import { PatientWorkspace } from './patient-workspace';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));
jest.mock('expo-haptics', () => ({ impactAsync: jest.fn(), ImpactFeedbackStyle: { Light: 'light' } }));
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), replace: jest.fn(), push: jest.fn(), canGoBack: () => true }),
}));
jest.mock('@/lib/api/endpoints', () => ({ endpoints: { patient: jest.fn() } }));

import { endpoints } from '@/lib/api/endpoints';

const metrics = { frame: { x: 0, y: 0, width: 360, height: 800 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };

async function open() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <QueryClientProvider client={client}>
        <PatientWorkspace patientId="P-1" />
      </QueryClientProvider>
    </SafeAreaProvider>,
  );
}

describe('PatientWorkspace gate (SEC-05)', () => {
  it('shows the not-found state, with no header and no tabs, when the patient is denied or missing', async () => {
    (endpoints.patient as jest.Mock).mockRejectedValue(
      new ApiError(404, 'not_found', 'The requested resource was not found.'),
    );
    await open();
    expect(await screen.findByText("We couldn't find that patient.")).toBeTruthy();
    expect(screen.queryByText('Overview')).toBeNull();
    expect(screen.queryByText('Safety')).toBeNull();
    expect(screen.queryByText(/synthetic data/i)).toBeNull();
  });

  it('shows the synthetic-data banner and the tabs once the patient has loaded', async () => {
    (endpoints.patient as jest.Mock).mockResolvedValue({
      patient_id: 'P-1',
      name: 'Rahul Patel',
      age: 61,
      sex: 'M',
      city: null,
      as_of: '2026-10-02',
      diagnoses: [],
      medications: [],
      latest_labs: [],
      recent_events: [],
      utilization: {
        opd_visits: 1,
        emergency_visits: 0,
        hospitalizations: 0,
        procedures: 0,
        billed: { amount: 0 },
        approved: { amount: 0 },
      },
    });
    await open();
    expect(await screen.findByText('Rahul Patel')).toBeTruthy();
    expect(screen.getByText(/synthetic data/i)).toBeTruthy();
    expect(screen.getByText('Safety')).toBeTruthy();
  });
});
